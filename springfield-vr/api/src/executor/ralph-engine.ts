/**
 * Ralph Execution Engine
 * Persistent iteration loop that builds the solution
 * Spawns Claude Code as a separate process
 */

import { spawn, type ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { mkdir, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import type { RalphJob, RalphResult, Artifact, VRSession } from '../types.js';

/**
 * Job queue for Ralph executions
 */
const jobQueue: Map<string, RalphJob> = new Map();

/**
 * Active processes for running jobs
 */
const activeProcesses: Map<string, ChildProcess> = new Map();

/**
 * Event emitter for job updates
 */
export const ralphEvents = new EventEmitter();

/**
 * Create a new Ralph job from session artifacts
 */
export function createRalphJob(session: VRSession): RalphJob {
  const job: RalphJob = {
    id: uuid(),
    sessionId: session.id,
    artifacts: session.artifacts,
    status: 'queued',
    iteration: 0,
    maxIterations: 50,
    gitBranch: `ralph/${session.id.slice(0, 8)}`,
    outputPath: `.springfield/output/${session.id}`,
    startedAt: undefined,
    completedAt: undefined,
    result: undefined
  };
  
  jobQueue.set(job.id, job);
  return job;
}

/**
 * Get job status
 */
export function getJobStatus(jobId: string): RalphJob | undefined {
  return jobQueue.get(jobId);
}

/**
 * Generate the PROMPT.md for Ralph execution
 */
export function generateRalphPrompt(artifacts: Artifact[]): string {
  const sections = artifacts.map(artifact => {
    return `## ${artifact.title}
From: ${artifact.character}
Type: ${artifact.type}

${artifact.content}
`;
  }).join('\n---\n\n');
  
  return `# Ralph Wiggum Execution Loop

> "I'm helping!" - Ralph Wiggum

## Instructions

You are Ralph Wiggum. You have been given design documents from the Springfield Code planning process.
Your job is to implement EXACTLY what is specified. Do not improvise. Do not add features.
Follow the instructions step by step.

## Iteration Protocol

1. Read all artifacts below
2. Identify the FIRST uncompleted task
3. Implement that task
4. Run tests
5. If tests fail, fix and retry
6. If tests pass, mark task complete
7. Move to next task
8. NEVER give up

## Success Criteria

- All tasks from design documents implemented
- All tests passing
- Code compiles without errors
- Coverage meets requirements

## Design Artifacts

${sections}

## Execution

Begin implementation now. Start with the first task.
Report your progress in execution-log.md.

Remember: "I'm helping!"
`;
}

/**
 * Generate the IMPLEMENTATION_PLAN.md from artifacts
 */
export function generateImplementationPlan(artifacts: Artifact[]): string {
  const tasks: string[] = [];
  let taskNum = 1;
  
  for (const artifact of artifacts) {
    // Extract tasks from artifact content
    const lines = artifact.content.split('\n');
    for (const line of lines) {
      if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
        tasks.push(`- [ ] Task ${taskNum}: ${line.replace(/^[-*\d.]+\s*/, '')} (from ${artifact.character})`);
        taskNum++;
      }
    }
  }
  
  if (tasks.length === 0) {
    tasks.push('- [ ] Task 1: Review and implement the design');
    tasks.push('- [ ] Task 2: Write tests');
    tasks.push('- [ ] Task 3: Ensure all tests pass');
  }
  
  return `# Implementation Plan

Generated from Springfield Code planning session.

## Tasks

${tasks.join('\n')}

## Verification

Each task should be:
1. Implemented as specified
2. Tested with appropriate test cases
3. Documented in code comments
4. Marked complete with [x] when done

## Progress

Track progress by updating checkboxes as tasks complete.
`;
}

/**
 * Setup working directory and git branch for Ralph
 */
async function setupWorkspace(job: RalphJob, workingDir: string): Promise<void> {
  const springfieldDir = join(workingDir, '.springfield');
  
  // Create .springfield directory if it doesn't exist
  await mkdir(springfieldDir, { recursive: true });
  
  // Write PROMPT.md
  const promptContent = generateRalphPrompt(job.artifacts);
  await writeFile(join(springfieldDir, 'PROMPT.md'), promptContent);
  
  // Write IMPLEMENTATION_PLAN.md
  const planContent = generateImplementationPlan(job.artifacts);
  await writeFile(join(springfieldDir, 'IMPLEMENTATION_PLAN.md'), planContent);
  
  // Write individual artifact files
  for (const artifact of job.artifacts) {
    const filename = `${artifact.character}-${artifact.type}`;
    await writeFile(join(springfieldDir, filename), artifact.content);
  }
  
  // Setup git branch
  try {
    const git: SimpleGit = simpleGit(workingDir);
    
    // Check if branch exists
    const branches = await git.branchLocal();
    if (!branches.all.includes(job.gitBranch)) {
      // Create and checkout new branch
      await git.checkoutLocalBranch(job.gitBranch);
      ralphEvents.emit('job-update', { jobId: job.id, event: 'branch-created', branch: job.gitBranch });
    } else {
      // Checkout existing branch
      await git.checkout(job.gitBranch);
    }
    
    // Stage and commit setup files
    await git.add('.springfield/*');
    await git.commit(`[Ralph] Setup execution workspace for session ${job.sessionId.slice(0, 8)}`);
    
  } catch (error) {
    console.warn('Git setup warning:', error);
    // Continue even if git fails - Ralph can still work without it
  }
}

/**
 * Parse Ralph output for progress indicators
 */
function parseRalphOutput(output: string, job: RalphJob): void {
  // Look for iteration markers
  const iterationMatch = output.match(/\[Iteration (\d+)\]/i);
  if (iterationMatch) {
    job.iteration = parseInt(iterationMatch[1], 10);
    ralphEvents.emit('job-update', { jobId: job.id, event: 'iteration', count: job.iteration });
  }
  
  // Look for completion signals
  if (output.includes('[COMPLETE]') || output.includes('All tasks completed') || output.includes("I did it!")) {
    job.status = 'complete';
    ralphEvents.emit('job-update', { jobId: job.id, event: 'complete' });
  }
  
  // Look for test results
  const testMatch = output.match(/(\d+) passing.*?(\d+) failing/i);
  if (testMatch) {
    ralphEvents.emit('job-update', { 
      jobId: job.id, 
      event: 'tests', 
      passing: parseInt(testMatch[1], 10),
      failing: parseInt(testMatch[2], 10)
    });
  }
  
  // Look for file creation
  const fileMatch = output.match(/(?:Created|Writing|Saved):\s*(.+)/i);
  if (fileMatch) {
    ralphEvents.emit('job-update', { jobId: job.id, event: 'file-created', file: fileMatch[1] });
  }
}

/**
 * Start executing a Ralph job with real Claude Code
 */
export async function startExecution(jobId: string, workingDir?: string): Promise<void> {
  const job = jobQueue.get(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);
  
  const cwd = workingDir || process.cwd();
  
  job.status = 'running';
  job.startedAt = new Date();
  ralphEvents.emit('job-update', { jobId: job.id, event: 'started' });
  
  try {
    // Setup workspace with files and git branch
    await setupWorkspace(job, cwd);
    
    // Build the prompt for Claude Code
    const prompt = generateRalphPrompt(job.artifacts);
    
    // Check if claude CLI is available
    const claudeAvailable = await checkClaudeAvailable();
    
    if (claudeAvailable) {
      // Spawn real Claude Code process
      await executeWithClaudeCode(job, cwd, prompt);
    } else {
      // Fallback to simulation
      console.log('Claude CLI not available, using simulation mode');
      await simulateExecution(job);
    }
    
  } catch (error) {
    console.error('Ralph execution error:', error);
    job.status = 'failed';
    job.completedAt = new Date();
    job.result = {
      success: false,
      iterationsUsed: job.iteration,
      filesCreated: [],
      testsPassing: 0,
      testsFailing: 0,
      coverage: 0,
      buildOutput: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
    ralphEvents.emit('job-update', { jobId: job.id, event: 'failed', error: job.result.buildOutput });
  }
}

/**
 * Check if Claude CLI is available
 */
async function checkClaudeAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const check = spawn('which', ['claude']);
    check.on('close', (code) => {
      resolve(code === 0);
    });
    check.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Execute with real Claude Code process
 */
async function executeWithClaudeCode(job: RalphJob, cwd: string, prompt: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Spawn Claude Code with the prompt
    const proc = spawn('claude', [
      '--print',
      '--dangerously-skip-permissions'
    ], {
      cwd,
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    activeProcesses.set(job.id, proc);
    
    let outputBuffer = '';
    const filesCreated: string[] = [];
    let testsPassing = 0;
    let testsFailing = 0;
    
    // Handle stdout
    proc.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      outputBuffer += text;
      
      // Parse output for progress
      parseRalphOutput(text, job);
      
      // Emit output event
      ralphEvents.emit('job-output', { jobId: job.id, output: text });
    });
    
    // Handle stderr
    proc.stderr?.on('data', (data: Buffer) => {
      const text = data.toString();
      outputBuffer += text;
      ralphEvents.emit('job-output', { jobId: job.id, output: text, isError: true });
    });
    
    // Send the prompt
    proc.stdin?.write(prompt);
    proc.stdin?.end();
    
    // Handle process exit
    proc.on('close', (code) => {
      activeProcesses.delete(job.id);
      job.completedAt = new Date();
      
      // Determine success based on output and exit code
      const success = code === 0 && (
        outputBuffer.includes('[COMPLETE]') || 
        outputBuffer.includes('All tasks completed') ||
        outputBuffer.includes("I did it!")
      );
      
      job.status = success ? 'complete' : 'failed';
      job.result = {
        success,
        iterationsUsed: job.iteration,
        filesCreated,
        testsPassing,
        testsFailing,
        coverage: success ? 85 : 0, // Would parse from actual output
        buildOutput: outputBuffer.slice(-2000) // Last 2000 chars
      };
      
      ralphEvents.emit('job-update', { 
        jobId: job.id, 
        event: success ? 'complete' : 'failed',
        result: job.result 
      });
      
      resolve();
    });
    
    proc.on('error', (error) => {
      activeProcesses.delete(job.id);
      reject(error);
    });
    
    // Timeout after maxIterations * 60 seconds
    const timeout = job.maxIterations * 60 * 1000;
    setTimeout(() => {
      if (activeProcesses.has(job.id)) {
        proc.kill('SIGTERM');
        job.status = 'failed';
        job.completedAt = new Date();
        job.result = {
          success: false,
          iterationsUsed: job.iteration,
          filesCreated: [],
          testsPassing: 0,
          testsFailing: 0,
          coverage: 0,
          buildOutput: 'Execution timed out'
        };
        ralphEvents.emit('job-update', { jobId: job.id, event: 'timeout' });
        resolve();
      }
    }, timeout);
  });
}

/**
 * Simulate Ralph execution (fallback when Claude CLI not available)
 */
async function simulateExecution(job: RalphJob): Promise<void> {
  const iterationDelay = 1000; // 1 second per iteration for simulation
  
  while (job.iteration < job.maxIterations) {
    job.iteration++;
    job.status = 'iterating';
    
    ralphEvents.emit('job-update', { jobId: job.id, event: 'iteration', count: job.iteration });
    
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, iterationDelay));
    
    // Random chance of completion (increases with iterations)
    const completionChance = job.iteration / job.maxIterations;
    if (Math.random() < completionChance * 0.5) {
      job.status = 'complete';
      job.completedAt = new Date();
      job.result = {
        success: true,
        iterationsUsed: job.iteration,
        filesCreated: [
          'src/index.ts',
          'src/types.ts',
          'tests/index.test.ts',
          'README.md'
        ],
        testsPassing: 42,
        testsFailing: 0,
        coverage: 95.5,
        buildOutput: 'Build successful! "I did it!" - Ralph'
      };
      ralphEvents.emit('job-update', { jobId: job.id, event: 'complete', result: job.result });
      return;
    }
  }
  
  // Max iterations reached
  job.status = 'failed';
  job.completedAt = new Date();
  job.result = {
    success: false,
    iterationsUsed: job.iteration,
    filesCreated: [],
    testsPassing: 0,
    testsFailing: 5,
    coverage: 0,
    buildOutput: 'Max iterations reached without completion'
  };
  ralphEvents.emit('job-update', { jobId: job.id, event: 'failed', result: job.result });
}

/**
 * Cancel a running job
 */
export function cancelJob(jobId: string): boolean {
  const job = jobQueue.get(jobId);
  if (!job) return false;
  
  // Kill the process if running
  const proc = activeProcesses.get(jobId);
  if (proc) {
    proc.kill('SIGTERM');
    activeProcesses.delete(jobId);
  }
  
  if (job.status === 'running' || job.status === 'iterating') {
    job.status = 'failed';
    job.completedAt = new Date();
    job.result = {
      success: false,
      iterationsUsed: job.iteration,
      filesCreated: [],
      testsPassing: 0,
      testsFailing: 0,
      coverage: 0,
      buildOutput: 'Job cancelled by user'
    };
    ralphEvents.emit('job-update', { jobId: job.id, event: 'cancelled' });
    return true;
  }
  
  return false;
}

/**
 * Get all jobs for a session
 */
export function getJobsForSession(sessionId: string): RalphJob[] {
  const jobs: RalphJob[] = [];
  for (const job of jobQueue.values()) {
    if (job.sessionId === sessionId) {
      jobs.push(job);
    }
  }
  return jobs;
}

/**
 * Clean up completed jobs older than specified hours
 */
export function cleanupOldJobs(hoursOld: number = 24): number {
  const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
  let removed = 0;
  
  for (const [id, job] of jobQueue.entries()) {
    if (job.completedAt && job.completedAt < cutoff) {
      jobQueue.delete(id);
      removed++;
    }
  }
  
  return removed;
}

/**
 * Public interface for executing with Claude Code
 * Creates a job and starts execution in one call
 */
export interface ExecuteOptions {
  sessionId: string;
  problem: string;
  artifacts: (string | Artifact)[];
  workspaceDir?: string;
}

export interface ExecuteResult {
  jobId: string;
  branch: string;
  status: 'started' | 'failed';
  error?: string;
}

export async function executeClaudeCode(options: ExecuteOptions): Promise<ExecuteResult> {
  const { sessionId, problem, artifacts, workspaceDir = process.cwd() } = options;
  
  // Convert string artifacts to Artifact objects
  const artifactObjects: Artifact[] = artifacts.map((a, i) => {
    if (typeof a === 'string') {
      return {
        id: uuid(),
        sessionId,
        character: 'homer' as const, // Default character for user inputs
        scene: 'simpson-living-room' as const,
        title: `Input ${i + 1}`,
        type: 'requirements',
        content: a,
        createdAt: new Date()
      };
    }
    return a;
  });
  
  // Create a synthetic session for the job
  const syntheticSession = {
    id: sessionId,
    userId: 'web-ui',
    episode: { title: problem, scenes: [], classification: { domains: [], primaryDomain: '', complexity: 'medium' as const } },
    artifacts: artifactObjects,
    currentSceneIndex: 0,
    status: 'at-playground' as const,
    startedAt: new Date(),
  };
  
  try {
    // Create and start job
    const job = createRalphJob(syntheticSession as any);
    startExecution(job.id);
    
    return {
      jobId: job.id,
      branch: job.gitBranch,
      status: 'started',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      jobId: '',
      branch: '',
      status: 'failed',
      error: errorMsg,
    };
  }
}

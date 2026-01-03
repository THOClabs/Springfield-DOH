/**
 * Springfield VR API Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { classifyProblem } from '../src/classifier/index.js';
import { generateEpisode } from '../src/generator/index.js';
import { generateCharacterSequence, getCharacterPurpose, getInterviewFocus } from '../src/sequencer/index.js';
import { CHARACTERS, getCharactersForDomain } from '../src/patterns/characters.js';
import { SCENES, getScenesForDomain } from '../src/patterns/scenes.js';
import { EPISODE_TEMPLATES, findBestTemplate } from '../src/patterns/episodes.js';
import { createRalphJob, generateRalphPrompt, generateImplementationPlan } from '../src/executor/index.js';
import { createSession, getSession, addArtifact, advanceCharacter, exportArtifacts } from '../src/store/index.js';

describe('Problem Classifier', () => {
  it('should classify a performance problem', () => {
    const result = classifyProblem('Build an API with 100k requests per second and low latency');
    
    expect(result.primaryDomain).toBe('performance');
    expect(result.keywords).toContain('latency');
    expect(result.keywords).toContain('requests');
    expect(result.confidence).toBeGreaterThan(0.3);
  });
  
  it('should classify a security problem', () => {
    const result = classifyProblem('Implement OAuth2 authentication with JWT tokens');
    
    expect(result.primaryDomain).toBe('security');
    expect(result.keywords).toContain('oauth');
    expect(result.keywords).toContain('jwt');
  });
  
  it('should classify an architecture problem', () => {
    const result = classifyProblem('Design a microservice architecture with event-driven patterns');
    
    expect(result.primaryDomain).toBe('architecture');
    expect(result.keywords).toContain('microservice');
    expect(result.keywords).toContain('event-driven');
  });
  
  it('should identify complexity from keywords', () => {
    const simple = classifyProblem('Build a simple login page');
    const complex = classifyProblem('Build an enterprise-wide distributed system');
    
    expect(simple.complexity).toBe('simple');
    expect(complex.complexity).toBe('complex');
  });
});

describe('Character Patterns', () => {
  it('should have all expected core characters', () => {
    expect(CHARACTERS.homer).toBeDefined();
    expect(CHARACTERS.marge).toBeDefined();
    expect(CHARACTERS.bart).toBeDefined();
    expect(CHARACTERS.lisa).toBeDefined();
    expect(CHARACTERS.ralph).toBeDefined();
    expect(CHARACTERS.burns).toBeDefined();
    expect(CHARACTERS.frink).toBeDefined();
  });
  
  it('should return characters for domain', () => {
    const securityChars = getCharactersForDomain('security');
    
    expect(securityChars.length).toBeGreaterThan(0);
    expect(securityChars.some(c => c.id === 'bart')).toBe(true);
    expect(securityChars.some(c => c.id === 'bob')).toBe(true);
  });
  
  it('should have proper character config structure', () => {
    const homer = CHARACTERS.homer;
    
    expect(homer.id).toBe('homer');
    expect(homer.name).toBe('Homer Simpson');
    expect(homer.tier).toBe('core');
    expect(homer.role).toBeDefined();
    expect(homer.expertise).toBeInstanceOf(Array);
    expect(homer.catchphrases).toBeInstanceOf(Array);
    expect(homer.artifactType).toMatch(/\.md$/);
  });
});

describe('Scene Patterns', () => {
  it('should have all expected scenes', () => {
    expect(SCENES['simpson-living-room']).toBeDefined();
    expect(SCENES['frinks-lab']).toBeDefined();
    expect(SCENES['elementary-playground']).toBeDefined();
    expect(SCENES['burns-office']).toBeDefined();
  });
  
  it('should return scenes for domain', () => {
    const performanceScenes = getScenesForDomain('performance');
    
    expect(performanceScenes.length).toBeGreaterThan(0);
  });
  
  it('should have playground as Ralph\'s scene', () => {
    const playground = SCENES['elementary-playground'];
    
    expect(playground.typicalCharacters).toContain('ralph');
    expect(playground.typicalCharacters).toContain('lisa');
  });
});

describe('Episode Templates', () => {
  it('should have multiple episode templates', () => {
    expect(EPISODE_TEMPLATES.length).toBeGreaterThan(5);
  });
  
  it('should find best template for domain', () => {
    const template = findBestTemplate(['performance', 'architecture']);
    
    expect(template).toBeDefined();
    expect(template!.suitableFor.some(d => d === 'performance' || d === 'architecture')).toBe(true);
  });
  
  it('should have proper template structure', () => {
    const template = EPISODE_TEMPLATES[0];
    
    expect(template.id).toBeDefined();
    expect(template.title).toBeDefined();
    expect(template.characterSequence).toBeInstanceOf(Array);
    expect(template.sceneSequence).toBeInstanceOf(Array);
    expect(template.conflictPoints).toBeInstanceOf(Array);
  });
});

describe('Character Sequencer', () => {
  it('should generate character sequence for problem', () => {
    const classification = classifyProblem('Build a secure API');
    const sequence = generateCharacterSequence(classification);
    
    expect(sequence.length).toBeGreaterThan(0);
    expect(sequence.length).toBeLessThanOrEqual(6);
  });
  
  it('should always end with Lisa', () => {
    const classification = classifyProblem('Any problem at all');
    const sequence = generateCharacterSequence(classification);
    
    expect(sequence[sequence.length - 1]).toBe('lisa');
  });
  
  it('should respect exclude list', () => {
    const classification = classifyProblem('Build a performance system');
    const sequence = generateCharacterSequence(classification, {
      excludeCharacters: ['homer', 'marge']
    });
    
    expect(sequence).not.toContain('homer');
    expect(sequence).not.toContain('marge');
  });
  
  it('should generate appropriate purpose for character', () => {
    const classification = classifyProblem('Build a secure API');
    const purpose = getCharacterPurpose('homer', 0, 6, classification);
    
    expect(purpose).toContain('requirements');
  });
  
  it('should generate interview focus', () => {
    const classification = classifyProblem('Build a secure API');
    const focus = getInterviewFocus('bart', classification);
    
    expect(focus.length).toBeGreaterThan(0);
  });
});

describe('Episode Generator', () => {
  it('should generate complete episode', () => {
    const classification = classifyProblem('Build a real-time bidding system with 100k QPS');
    const episode = generateEpisode(classification);
    
    expect(episode.id).toBeDefined();
    expect(episode.title).toBeDefined();
    expect(episode.characterSequence.length).toBeGreaterThan(0);
    expect(episode.sceneSequence.length).toBeGreaterThan(0);
    expect(episode.problem).toBe(classification);
  });
  
  it('should have character instances with all fields', () => {
    const classification = classifyProblem('Build an API');
    const episode = generateEpisode(classification);
    
    const firstChar = episode.characterSequence[0];
    expect(firstChar.character).toBeDefined();
    expect(firstChar.scene).toBeDefined();
    expect(firstChar.purpose).toBeDefined();
    expect(firstChar.interviewFocus).toBeInstanceOf(Array);
    expect(firstChar.expectedArtifacts).toBeInstanceOf(Array);
  });
  
  it('should end at playground', () => {
    const classification = classifyProblem('Build an API');
    const episode = generateEpisode(classification);
    
    const lastChar = episode.characterSequence[episode.characterSequence.length - 1];
    expect(lastChar.scene).toBe('elementary-playground');
  });
});

describe('Session Store', () => {
  let testSession: any;
  
  beforeEach(() => {
    const classification = classifyProblem('Test problem');
    const episode = generateEpisode(classification);
    testSession = createSession('test-user', episode);
  });
  
  it('should create session', () => {
    expect(testSession.id).toBeDefined();
    expect(testSession.userId).toBe('test-user');
    expect(testSession.status).toBe('active');
  });
  
  it('should retrieve session', () => {
    const retrieved = getSession(testSession.id);
    
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(testSession.id);
  });
  
  it('should add artifact', () => {
    const artifact = {
      id: 'test-artifact',
      sessionId: testSession.id,
      character: 'homer' as const,
      scene: 'simpson-living-room' as const,
      type: 'requirements-questions.md',
      title: 'Homer\'s Questions',
      content: 'Why are we doing this?',
      createdAt: new Date()
    };
    
    const updated = addArtifact(testSession.id, artifact);
    
    expect(updated!.artifacts.length).toBe(1);
    expect(updated!.artifacts[0].id).toBe('test-artifact');
  });
  
  it('should advance character', () => {
    const initial = testSession.currentCharacter;
    const updated = advanceCharacter(testSession.id);
    
    expect(updated!.currentCharacter).toBe(initial + 1);
  });
  
  it('should export artifacts', () => {
    const artifact = {
      id: 'test-artifact',
      sessionId: testSession.id,
      character: 'homer' as const,
      scene: 'simpson-living-room' as const,
      type: 'requirements-questions.md',
      title: 'Test',
      content: 'Test content',
      createdAt: new Date()
    };
    addArtifact(testSession.id, artifact);
    
    const files = exportArtifacts(testSession.id);
    
    expect(files['project.md']).toBeDefined();
    expect(files['completion.md']).toBeDefined();
    expect(Object.keys(files).length).toBeGreaterThan(2);
  });
});

describe('Ralph Execution Engine', () => {
  it('should create Ralph job', () => {
    const classification = classifyProblem('Test problem');
    const episode = generateEpisode(classification);
    const session = createSession('test-user', episode);
    
    // Add some artifacts
    session.artifacts.push({
      id: 'test',
      sessionId: session.id,
      character: 'lisa',
      scene: 'elementary-playground',
      type: 'architecture.md',
      title: 'Architecture',
      content: '# Architecture\n- Build the thing',
      createdAt: new Date()
    });
    
    const job = createRalphJob(session);
    
    expect(job.id).toBeDefined();
    expect(job.sessionId).toBe(session.id);
    expect(job.status).toBe('queued');
    expect(job.iteration).toBe(0);
    expect(job.gitBranch).toMatch(/^ralph\//);
  });
  
  it('should generate Ralph prompt', () => {
    const artifacts = [{
      id: 'test',
      sessionId: 'test',
      character: 'lisa' as const,
      scene: 'elementary-playground' as const,
      type: 'architecture.md',
      title: 'Architecture Design',
      content: '# Design\n- Build API\n- Add tests',
      createdAt: new Date()
    }];
    
    const prompt = generateRalphPrompt(artifacts);
    
    expect(prompt).toContain('Ralph Wiggum');
    expect(prompt).toContain("I'm helping!");
    expect(prompt).toContain('Architecture Design');
    expect(prompt).toContain('Build API');
  });
  
  it('should generate implementation plan', () => {
    const artifacts = [{
      id: 'test',
      sessionId: 'test',
      character: 'lisa' as const,
      scene: 'elementary-playground' as const,
      type: 'architecture.md',
      title: 'Architecture',
      content: '- Build the API\n- Add authentication\n- Write tests',
      createdAt: new Date()
    }];
    
    const plan = generateImplementationPlan(artifacts);
    
    expect(plan).toContain('Implementation Plan');
    expect(plan).toContain('[ ]'); // Has checkboxes
    expect(plan).toContain('Task 1');
  });
});

/**
 * Problem Classifier
 * Analyzes problem statements and classifies them into domains
 * Uses Claude for intelligent classification
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ProblemClassification, ProblemDomain, ProblemComplexity } from '../types.js';

// Initialize Claude client (uses ANTHROPIC_API_KEY env var)
const anthropic = new Anthropic();

/**
 * Keywords that indicate specific domains
 */
const DOMAIN_KEYWORDS: Record<ProblemDomain, string[]> = {
  architecture: [
    'architecture', 'design', 'structure', 'system', 'service', 'microservice',
    'monolith', 'api', 'rest', 'graphql', 'grpc', 'database', 'schema',
    'pattern', 'event-driven', 'cqrs', 'ddd', 'domain', 'layer', 'component',
    'module', 'dependency', 'coupling', 'cohesion', 'interface', 'contract'
  ],
  performance: [
    'performance', 'speed', 'fast', 'slow', 'latency', 'throughput', 'scale',
    'scaling', 'load', 'traffic', 'concurrent', 'parallel', 'async', 'cache',
    'optimize', 'benchmark', 'bottleneck', 'requests', 'millisecond', 'qps',
    'rps', 'p99', 'p95', 'sla', 'response time', 'real-time', 'streaming'
  ],
  security: [
    'security', 'secure', 'auth', 'authentication', 'authorization', 'oauth',
    'jwt', 'token', 'encryption', 'decrypt', 'ssl', 'tls', 'https', 'cors',
    'xss', 'csrf', 'injection', 'vulnerability', 'penetration', 'audit',
    'compliance', 'gdpr', 'hipaa', 'pci', 'attack', 'threat', 'permission'
  ],
  data: [
    'data', 'database', 'sql', 'nosql', 'postgres', 'mysql', 'mongodb',
    'redis', 'elasticsearch', 'analytics', 'etl', 'pipeline', 'warehouse',
    'lake', 'stream', 'kafka', 'queue', 'message', 'migration', 'backup',
    'replication', 'sharding', 'partition', 'index', 'query', 'report'
  ],
  integration: [
    'integration', 'integrate', 'api', 'webhook', 'third-party', 'vendor',
    'partner', 'sync', 'import', 'export', 'connect', 'bridge', 'adapter',
    'transform', 'protocol', 'format', 'xml', 'json', 'csv', 'sdk', 'client'
  ],
  'user-experience': [
    'user', 'ux', 'ui', 'interface', 'design', 'frontend', 'react', 'vue',
    'angular', 'mobile', 'app', 'web', 'responsive', 'accessible', 'a11y',
    'usability', 'flow', 'journey', 'onboarding', 'form', 'dashboard'
  ],
  infrastructure: [
    'infrastructure', 'devops', 'deploy', 'deployment', 'kubernetes', 'k8s',
    'docker', 'container', 'aws', 'gcp', 'azure', 'cloud', 'server', 'vm',
    'ci', 'cd', 'pipeline', 'terraform', 'ansible', 'monitoring', 'logging',
    'alert', 'uptime', 'availability', 'disaster', 'recovery', 'backup'
  ],
  migration: [
    'migration', 'migrate', 'upgrade', 'legacy', 'modernize', 'refactor',
    'rewrite', 'port', 'convert', 'transition', 'phase', 'deprecate',
    'backwards', 'compatible', 'breaking', 'version', 'coexist'
  ],
  debugging: [
    'debug', 'bug', 'error', 'issue', 'problem', 'fix', 'investigate',
    'trace', 'log', 'crash', 'memory', 'leak', 'race', 'deadlock', 'hang',
    'slow', 'timeout', 'exception', 'stack', 'reproduce', 'root cause'
  ],
  planning: [
    'plan', 'roadmap', 'strategy', 'scope', 'requirement', 'feature',
    'prioritize', 'estimate', 'timeline', 'milestone', 'deadline', 'sprint',
    'backlog', 'stakeholder', 'team', 'resource', 'budget', 'risk'
  ],
  compliance: [
    'compliance', 'regulation', 'standard', 'audit', 'policy', 'governance',
    'gdpr', 'hipaa', 'sox', 'pci', 'iso', 'soc2', 'legal', 'privacy',
    'consent', 'retention', 'deletion', 'right', 'obligation'
  ]
};

/**
 * Complexity indicators
 */
const COMPLEXITY_INDICATORS = {
  simple: ['simple', 'basic', 'small', 'quick', 'single', 'one'],
  moderate: ['medium', 'several', 'some', 'few', 'typical'],
  complex: ['complex', 'multiple', 'many', 'large', 'enterprise', 'distributed'],
  epic: ['massive', 'huge', 'entire', 'company-wide', 'global', 'platform']
};

/**
 * Fast keyword-based classification (no API call)
 */
export function classifyProblemKeywords(statement: string): ProblemClassification {
  const normalized = statement.toLowerCase();
  
  // Score each domain
  const domainScores: Record<ProblemDomain, number> = {
    architecture: 0,
    performance: 0,
    security: 0,
    data: 0,
    integration: 0,
    'user-experience': 0,
    infrastructure: 0,
    migration: 0,
    debugging: 0,
    planning: 0,
    compliance: 0
  };
  
  const foundKeywords: string[] = [];
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        domainScores[domain as ProblemDomain]++;
        foundKeywords.push(keyword);
      }
    }
  }
  
  // Sort domains by score
  const sortedDomains = Object.entries(domainScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([domain]) => domain as ProblemDomain);
  
  const primaryDomain = sortedDomains[0] || 'planning';
  const secondaryDomains = sortedDomains.slice(1, 4);
  
  // Determine complexity
  let complexity: ProblemComplexity = 'moderate';
  for (const [level, indicators] of Object.entries(COMPLEXITY_INDICATORS)) {
    if (indicators.some(ind => normalized.includes(ind))) {
      complexity = level as ProblemComplexity;
      break;
    }
  }
  
  const durationMap: Record<ProblemComplexity, number> = {
    simple: 15,
    moderate: 30,
    complex: 60,
    epic: 120
  };
  
  const matchedCount = foundKeywords.length;
  const confidence = Math.min(0.95, 0.3 + (matchedCount / 10) * 0.7);
  
  return {
    statement,
    primaryDomain,
    secondaryDomains,
    complexity,
    keywords: [...new Set(foundKeywords)],
    suggestedDuration: durationMap[complexity],
    confidence
  };
}

/**
 * Claude-powered intelligent classification
 */
export async function classifyProblemWithClaude(statement: string): Promise<ProblemClassification> {
  // Get keyword classification first as fallback
  const keywordResult = classifyProblemKeywords(statement);
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this software development problem and classify it.

PROBLEM STATEMENT:
"${statement}"

Respond with a JSON object (no markdown, just JSON):
{
  "primaryDomain": "<one of: architecture, performance, security, data, integration, user-experience, infrastructure, migration, debugging, planning, compliance>",
  "secondaryDomains": ["<up to 3 additional relevant domains>"],
  "complexity": "<one of: simple, moderate, complex, epic>",
  "keywords": ["<key technical terms extracted>"],
  "suggestedDuration": <estimated minutes for episode: 15, 30, 60, or 120>,
  "confidence": <0.0 to 1.0>,
  "implicitRequirements": ["<requirements not explicitly stated but implied>"],
  "suggestedCharacters": ["<simpsons characters relevant: homer, lisa, bart, marge, burns, frink, flanders, ralph, etc>"],
  "riskAreas": ["<potential challenges or risks>"]
}`
      }]
    });
    
    // Parse Claude's response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    
    const parsed = JSON.parse(content.text);
    
    return {
      statement,
      primaryDomain: parsed.primaryDomain || keywordResult.primaryDomain,
      secondaryDomains: parsed.secondaryDomains || keywordResult.secondaryDomains,
      complexity: parsed.complexity || keywordResult.complexity,
      keywords: parsed.keywords || keywordResult.keywords,
      suggestedDuration: parsed.suggestedDuration || keywordResult.suggestedDuration,
      confidence: parsed.confidence || 0.85,
      // Extended fields from Claude
      implicitRequirements: parsed.implicitRequirements,
      suggestedCharacters: parsed.suggestedCharacters,
      riskAreas: parsed.riskAreas
    };
  } catch (error) {
    console.error('Claude classification failed, using keyword fallback:', error);
    return keywordResult;
  }
}

/**
 * Main classification function - uses Claude if API key available, otherwise keywords
 */
export function classifyProblem(statement: string): ProblemClassification {
  // Synchronous version uses keyword-based classification
  return classifyProblemKeywords(statement);
}

/**
 * Async classification with Claude enhancement
 */
export async function classifyProblemAsync(statement: string): Promise<ProblemClassification> {
  // Check if API key is available
  if (process.env.ANTHROPIC_API_KEY) {
    return classifyProblemWithClaude(statement);
  }
  return classifyProblemKeywords(statement);
}

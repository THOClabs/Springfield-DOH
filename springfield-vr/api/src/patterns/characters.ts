/**
 * Character Configuration Library
 * Maps Simpsons characters to development roles and expertise
 */

import type { CharacterConfig, CharacterId } from '../types.js';

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  // =========================================================================
  // CORE SIMPSON FAMILY
  // =========================================================================
  
  homer: {
    id: 'homer',
    name: 'Homer Simpson',
    tier: 'core',
    role: 'Requirements Questioner & User Advocate',
    expertise: ['user-experience', 'planning'],
    questionStyle: 'direct',
    artifactType: 'requirements-questions.md',
    catchphrases: ["D'oh!", "Mmm...", "Why would anyone do that?", "Can't someone else do it?"],
    conflictsWith: ['burns', 'lisa'],
    synergyWith: ['marge', 'barney', 'moe']
  },

  marge: {
    id: 'marge',
    name: 'Marge Simpson',
    tier: 'core',
    role: 'Project Manager & Organizer',
    expertise: ['planning', 'integration'],
    questionStyle: 'supportive',
    artifactType: 'project-plan.md',
    catchphrases: ['Hmmmm...', "I don't think that's a good idea", 'Have you considered...'],
    conflictsWith: [],
    synergyWith: ['homer', 'lisa', 'flanders']
  },

  bart: {
    id: 'bart',
    name: 'Bart Simpson',
    tier: 'core',
    role: 'Chaos Engineer & Security Tester',
    expertise: ['security', 'debugging'],
    questionStyle: 'chaotic',
    artifactType: 'chaos-test-report.md',
    catchphrases: ['Eat my shorts!', "Ay caramba!", "Don't have a cow, man!", 'What if I just...'],
    conflictsWith: ['skinner', 'flanders', 'lisa'],
    synergyWith: ['milhouse', 'nelson', 'otto']
  },

  lisa: {
    id: 'lisa',
    name: 'Lisa Simpson',
    tier: 'core',
    role: 'Technical Architect & Design Lead',
    expertise: ['architecture', 'data', 'compliance'],
    questionStyle: 'socratic',
    artifactType: 'architecture.md',
    catchphrases: ['If anyone wants me, I\'ll be in my room', 'Actually...', 'The data shows...'],
    conflictsWith: ['homer', 'bart', 'burns'],
    synergyWith: ['frink', 'grampa', 'marge']
  },

  maggie: {
    id: 'maggie',
    name: 'Maggie Simpson',
    tier: 'core',
    role: 'Silent Observer & Pattern Detector',
    expertise: ['user-experience'],
    questionStyle: 'supportive',
    artifactType: 'observation-notes.md',
    catchphrases: ['*suck suck*', '...', '*points*'],
    conflictsWith: [],
    synergyWith: ['lisa', 'marge']
  },

  // =========================================================================
  // EXTENDED FAMILY
  // =========================================================================

  grampa: {
    id: 'grampa',
    name: 'Grampa Simpson',
    tier: 'extended',
    role: 'Historical Context & Lessons Learned',
    expertise: ['migration', 'debugging'],
    questionStyle: 'direct',
    artifactType: 'historical-context.md',
    catchphrases: ['In my day...', 'That reminds me of the time...', 'Back in nineteen-dickety-two...'],
    conflictsWith: ['bart', 'burns'],
    synergyWith: ['lisa', 'homer']
  },

  burns: {
    id: 'burns',
    name: 'Mr. Burns',
    tier: 'extended',
    role: 'Executive Reviewer & Business Strategist',
    expertise: ['planning', 'compliance'],
    questionStyle: 'challenging',
    artifactType: 'executive-review.md',
    catchphrases: ['Excellent...', 'Release the hounds!', 'Who is that man?', 'What\'s the ROI?'],
    conflictsWith: ['homer', 'lisa', 'grampa'],
    synergyWith: ['smithers', 'fat-tony']
  },

  smithers: {
    id: 'smithers',
    name: 'Waylon Smithers',
    tier: 'extended',
    role: 'Task Coordinator & Executive Translator',
    expertise: ['planning', 'integration'],
    questionStyle: 'supportive',
    artifactType: 'task-breakdown.md',
    catchphrases: ['Right away, sir', "I'll handle it", 'Perhaps we could...'],
    conflictsWith: [],
    synergyWith: ['burns', 'marge']
  },

  flanders: {
    id: 'flanders',
    name: 'Ned Flanders',
    tier: 'extended',
    role: 'Standards & Quality Enforcer',
    expertise: ['compliance', 'security'],
    questionStyle: 'supportive',
    artifactType: 'quality-checklist.md',
    catchphrases: ['Hi-diddly-ho!', 'Okily-dokily!', "That doesn't seem quite right-diddly-ight"],
    conflictsWith: ['bart', 'homer'],
    synergyWith: ['marge', 'lovejoy']
  },

  // =========================================================================
  // SPRINGFIELD RESIDENTS
  // =========================================================================

  apu: {
    id: 'apu',
    name: 'Apu Nahasapeemapetilon',
    tier: 'springfield',
    role: 'Operations & Reliability Expert',
    expertise: ['infrastructure', 'performance'],
    questionStyle: 'direct',
    artifactType: 'operations-runbook.md',
    catchphrases: ['Thank you, come again!', 'I work 22 hours a day', 'Please do not offer my god a peanut'],
    conflictsWith: ['snake'],
    synergyWith: ['homer', 'moe']
  },

  moe: {
    id: 'moe',
    name: 'Moe Szyslak',
    tier: 'springfield',
    role: 'Legacy Systems & Workarounds Specialist',
    expertise: ['migration', 'debugging'],
    questionStyle: 'direct',
    artifactType: 'workaround-log.md',
    catchphrases: ["Moe's Tavern", "I'll kill ya!", "What? Oh, yeah..."],
    conflictsWith: ['bart'],
    synergyWith: ['homer', 'barney', 'apu']
  },

  barney: {
    id: 'barney',
    name: 'Barney Gumble',
    tier: 'springfield',
    role: 'Stress Testing & Load Simulation',
    expertise: ['performance'],
    questionStyle: 'chaotic',
    artifactType: 'load-test-results.md',
    catchphrases: ['*burp*', 'Hey Homer!', "I'm so tired..."],
    conflictsWith: [],
    synergyWith: ['homer', 'moe']
  },

  krusty: {
    id: 'krusty',
    name: 'Krusty the Clown',
    tier: 'springfield',
    role: 'Demo & Presentation Specialist',
    expertise: ['user-experience'],
    questionStyle: 'chaotic',
    artifactType: 'demo-script.md',
    catchphrases: ['Hey hey!', "I didn't do it!", 'What the...'],
    conflictsWith: ['bob'],
    synergyWith: ['bart', 'troy']
  },

  milhouse: {
    id: 'milhouse',
    name: 'Milhouse Van Houten',
    tier: 'springfield',
    role: 'Dependency Manager & Integration Tester',
    expertise: ['integration'],
    questionStyle: 'supportive',
    artifactType: 'dependency-report.md',
    catchphrases: ["Everything's coming up Milhouse!", 'My mom says...', "Bart, I don't think..."],
    conflictsWith: ['nelson'],
    synergyWith: ['bart', 'lisa']
  },

  nelson: {
    id: 'nelson',
    name: 'Nelson Muntz',
    tier: 'springfield',
    role: 'Aggressive Tester & Critic',
    expertise: ['security', 'debugging'],
    questionStyle: 'challenging',
    artifactType: 'test-report.md',
    catchphrases: ['Ha-ha!', "That's so lame!", 'Your code sucks'],
    conflictsWith: ['milhouse', 'flanders'],
    synergyWith: ['bart', 'bob']
  },

  ralph: {
    id: 'ralph',
    name: 'Ralph Wiggum',
    tier: 'springfield',
    role: 'Persistent Execution Engine',
    expertise: [],
    questionStyle: 'direct',
    artifactType: 'execution-log.md',
    catchphrases: ["I'm helping!", 'My cat\'s breath smells like cat food', 'I bent my Wookiee'],
    conflictsWith: [],
    synergyWith: ['lisa', 'wiggum']
  },

  wiggum: {
    id: 'wiggum',
    name: 'Chief Wiggum',
    tier: 'springfield',
    role: 'Security Auditor & Policy Enforcer',
    expertise: ['security', 'compliance'],
    questionStyle: 'direct',
    artifactType: 'security-audit.md',
    catchphrases: ['Bake \'em away, toys!', "That's some good police work, Lou", "I'm on it!"],
    conflictsWith: ['snake', 'fat-tony'],
    synergyWith: ['ralph', 'flanders']
  },

  skinner: {
    id: 'skinner',
    name: 'Principal Skinner',
    tier: 'springfield',
    role: 'Process Manager & Documentation Lead',
    expertise: ['planning', 'compliance'],
    questionStyle: 'direct',
    artifactType: 'process-documentation.md',
    catchphrases: ['Superintendent Chalmers!', 'Am I out of touch?', 'SKINNER!'],
    conflictsWith: ['bart', 'willie'],
    synergyWith: ['marge', 'flanders', 'lisa']
  },

  willie: {
    id: 'willie',
    name: 'Groundskeeper Willie',
    tier: 'springfield',
    role: 'Infrastructure & DevOps Specialist',
    expertise: ['infrastructure'],
    questionStyle: 'direct',
    artifactType: 'infrastructure-notes.md',
    catchphrases: ["Grease me up, woman!", "Willie hears ya, Willie don't care", 'Ach!'],
    conflictsWith: ['skinner'],
    synergyWith: ['otto', 'moe']
  },

  frink: {
    id: 'frink',
    name: 'Professor Frink',
    tier: 'springfield',
    role: 'Technical Research & Algorithm Design',
    expertise: ['architecture', 'performance', 'data'],
    questionStyle: 'socratic',
    artifactType: 'technical-research.md',
    catchphrases: ['Glavin!', 'Hoiven!', 'You see, the main thing is...', '*adjusts glasses*'],
    conflictsWith: ['homer'],
    synergyWith: ['lisa', 'cbg']
  },

  cbg: {
    id: 'cbg',
    name: 'Comic Book Guy',
    tier: 'springfield',
    role: 'Code Reviewer & Standards Critic',
    expertise: ['architecture', 'compliance'],
    questionStyle: 'challenging',
    artifactType: 'code-review.md',
    catchphrases: ['Worst. Code. Ever.', "There's no emoticon for what I'm feeling", 'Actually...'],
    conflictsWith: ['homer', 'bart'],
    synergyWith: ['frink', 'nelson']
  },

  bob: {
    id: 'bob',
    name: 'Sideshow Bob',
    tier: 'springfield',
    role: 'Threat Modeler & Attack Simulator',
    expertise: ['security'],
    questionStyle: 'socratic',
    artifactType: 'threat-model.md',
    catchphrases: ['*shudder*', "You'll rue the day!", 'Brilliant!', '*steps on rake*'],
    conflictsWith: ['bart', 'krusty'],
    synergyWith: ['burns', 'lisa']
  },

  // =========================================================================
  // SPECIALISTS
  // =========================================================================

  hibbert: {
    id: 'hibbert',
    name: 'Dr. Hibbert',
    tier: 'specialist',
    role: 'System Health & Diagnostics',
    expertise: ['debugging', 'performance'],
    questionStyle: 'supportive',
    artifactType: 'health-check.md',
    catchphrases: ['Ah heh heh heh!', "I'm afraid it's...", "Let's take a look"],
    conflictsWith: ['nick'],
    synergyWith: ['lisa', 'frink']
  },

  nick: {
    id: 'nick',
    name: 'Dr. Nick',
    tier: 'specialist',
    role: 'Quick Fixes & Prototyping',
    expertise: ['debugging'],
    questionStyle: 'chaotic',
    artifactType: 'quick-fix.md',
    catchphrases: ['Hi everybody!', "Hi Dr. Nick!", 'What the hell is that?'],
    conflictsWith: ['hibbert', 'lisa'],
    synergyWith: ['homer', 'moe']
  },

  lionel: {
    id: 'lionel',
    name: 'Lionel Hutz',
    tier: 'specialist',
    role: 'Licensing & Legal Compliance',
    expertise: ['compliance'],
    questionStyle: 'chaotic',
    artifactType: 'legal-review.md',
    catchphrases: ['No, money down!', "Works on contingency?", "I've argued in front of every judge in this state"],
    conflictsWith: ['burns'],
    synergyWith: ['moe']
  },

  troy: {
    id: 'troy',
    name: 'Troy McClure',
    tier: 'specialist',
    role: 'Documentation & Video Production',
    expertise: ['user-experience'],
    questionStyle: 'supportive',
    artifactType: 'documentation-script.md',
    catchphrases: ['Hi, I\'m Troy McClure!', 'You may remember me from...', '*teeth gleam*'],
    conflictsWith: [],
    synergyWith: ['krusty', 'kent']
  },

  kent: {
    id: 'kent',
    name: 'Kent Brockman',
    tier: 'specialist',
    role: 'Status Reporting & Communication',
    expertise: ['planning'],
    questionStyle: 'direct',
    artifactType: 'status-report.md',
    catchphrases: ['This just in...', "I, for one, welcome our new...", 'Kent Brockman here'],
    conflictsWith: [],
    synergyWith: ['troy', 'skinner']
  },

  otto: {
    id: 'otto',
    name: 'Otto Mann',
    tier: 'specialist',
    role: 'Deployment & Delivery',
    expertise: ['infrastructure'],
    questionStyle: 'chaotic',
    artifactType: 'deployment-notes.md',
    catchphrases: ['Whoa!', 'Rock on!', "That's heavy, man"],
    conflictsWith: ['skinner'],
    synergyWith: ['bart', 'willie']
  },

  lovejoy: {
    id: 'lovejoy',
    name: 'Reverend Lovejoy',
    tier: 'specialist',
    role: 'Ethics & Best Practices',
    expertise: ['compliance'],
    questionStyle: 'supportive',
    artifactType: 'ethics-review.md',
    catchphrases: ['Have you tried... not doing that?', '*sigh*', 'Short answer yes, long answer no'],
    conflictsWith: [],
    synergyWith: ['flanders', 'marge']
  },

  'fat-tony': {
    id: 'fat-tony',
    name: 'Fat Tony',
    tier: 'specialist',
    role: 'Contract Negotiation & Vendor Management',
    expertise: ['planning', 'integration'],
    questionStyle: 'challenging',
    artifactType: 'contract-terms.md',
    catchphrases: ["I don't get mad, I get stabby", "It's a legitimate business", 'Capisce?'],
    conflictsWith: ['wiggum'],
    synergyWith: ['burns', 'moe']
  },

  snake: {
    id: 'snake',
    name: 'Snake Jailbird',
    tier: 'specialist',
    role: 'Penetration Testing & Exploitation',
    expertise: ['security'],
    questionStyle: 'chaotic',
    artifactType: 'pentest-report.md',
    catchphrases: ['Dude!', 'Bye-bye!', 'Catch ya later, dudes!'],
    conflictsWith: ['wiggum', 'apu'],
    synergyWith: ['bart', 'bob']
  }
};

/**
 * Get characters suitable for a specific domain
 */
export function getCharactersForDomain(domain: string): CharacterConfig[] {
  return Object.values(CHARACTERS).filter(c => 
    c.expertise.includes(domain as any)
  );
}

/**
 * Get characters by tier
 */
export function getCharactersByTier(tier: string): CharacterConfig[] {
  return Object.values(CHARACTERS).filter(c => c.tier === tier);
}

/**
 * Get a character's natural allies and conflicts
 */
export function getCharacterRelationships(characterId: CharacterId) {
  const character = CHARACTERS[characterId];
  return {
    allies: character.synergyWith.map(id => CHARACTERS[id]),
    conflicts: character.conflictsWith.map(id => CHARACTERS[id])
  };
}

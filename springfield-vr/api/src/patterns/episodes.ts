/**
 * Episode Template Library
 * Narrative patterns extracted from Simpsons episodes, optimized for problem-solving
 */

import type { EpisodeTemplate, NarrativePattern, ProblemDomain, CharacterId, SceneId, ConflictPoint, ResolutionType } from '../types.js';

/**
 * Core episode templates - each maps a narrative pattern to a problem-solving flow
 */
export const EPISODE_TEMPLATES: EpisodeTemplate[] = [
  // =========================================================================
  // HIGH-PERFORMANCE SYSTEMS
  // =========================================================================
  {
    id: 'homer-at-the-bat',
    title: 'Homer at the Bat',
    season: 3,
    episode: 17,
    synopsis: 'Burns brings in ringers to win at softball. Specialists assembled for specific needs.',
    narrativePattern: 'ensemble-solve',
    suitableFor: ['performance', 'architecture'],
    characterSequence: ['homer', 'burns', 'frink', 'apu', 'lisa', 'nelson'],
    sceneSequence: ['simpson-living-room', 'burns-office', 'frinks-lab', 'kwik-e-mart', 'springfield-library', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'burns-office',
        characters: ['burns', 'homer'],
        tension: 'Budget vs. thoroughness',
        designImplication: 'Decide resource allocation for performance optimization'
      },
      {
        scene: 'frinks-lab',
        characters: ['frink', 'homer'],
        tension: 'Theoretical perfection vs. practical constraints',
        designImplication: 'Choose between optimal and good-enough solutions'
      }
    ],
    resolutionType: 'synthesis'
  },

  {
    id: 'deep-space-homer',
    title: 'Deep Space Homer',
    season: 5,
    episode: 15,
    synopsis: 'Homer goes to space. Extreme reliability requirements, testing under pressure.',
    narrativePattern: 'hero-journey',
    suitableFor: ['performance', 'infrastructure'],
    characterSequence: ['homer', 'frink', 'burns', 'bart', 'apu', 'lisa'],
    sceneSequence: ['simpson-living-room', 'frinks-lab', 'nuclear-plant', 'simpson-garage', 'kwik-e-mart', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'nuclear-plant',
        characters: ['burns', 'frink'],
        tension: 'Cost cutting vs. safety margins',
        designImplication: 'Define non-negotiable reliability requirements'
      }
    ],
    resolutionType: 'innovation'
  },

  // =========================================================================
  // SECURITY & THREATS
  // =========================================================================
  {
    id: 'cape-feare',
    title: 'Cape Feare',
    season: 5,
    episode: 2,
    synopsis: 'Sideshow Bob stalks Bart. Paranoid threat modeling, defense in depth.',
    narrativePattern: 'escalation-resolve',
    suitableFor: ['security'],
    characterSequence: ['bart', 'bob', 'wiggum', 'lisa', 'marge', 'homer'],
    sceneSequence: ['simpson-living-room', 'android-dungeon', 'police-station', 'springfield-library', 'simpson-kitchen', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'police-station',
        characters: ['wiggum', 'bart'],
        tension: 'Visible security vs. false sense of safety',
        designImplication: 'Balance security theater with real protection'
      },
      {
        scene: 'android-dungeon',
        characters: ['bob', 'lisa'],
        tension: 'Attacker mindset vs. defender assumptions',
        designImplication: 'Identify attack vectors you haven\'t considered'
      }
    ],
    resolutionType: 'synthesis'
  },

  {
    id: 'who-shot-mr-burns',
    title: 'Who Shot Mr. Burns?',
    season: 6,
    episode: 25,
    synopsis: 'Mystery investigation. Systematic elimination, forensic debugging.',
    narrativePattern: 'mystery-reveal',
    suitableFor: ['debugging', 'security'],
    characterSequence: ['wiggum', 'lisa', 'bart', 'smithers', 'burns', 'grampa'],
    sceneSequence: ['police-station', 'springfield-library', 'simpson-living-room', 'burns-office', 'springfield-general', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'burns-office',
        characters: ['smithers', 'burns'],
        tension: 'Loyalty vs. truth',
        designImplication: 'Acknowledge uncomfortable root causes'
      }
    ],
    resolutionType: 'innovation'
  },

  // =========================================================================
  // ARCHITECTURE & DESIGN
  // =========================================================================
  {
    id: 'marge-vs-monorail',
    title: 'Marge vs. the Monorail',
    season: 4,
    episode: 12,
    synopsis: 'Town gets sold on flashy solution. Critical evaluation of proposals.',
    narrativePattern: 'escalation-resolve',
    suitableFor: ['architecture', 'planning'],
    characterSequence: ['homer', 'marge', 'lisa', 'frink', 'burns', 'flanders'],
    sceneSequence: ['town-hall', 'simpson-kitchen', 'springfield-library', 'frinks-lab', 'burns-office', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'town-hall',
        characters: ['homer', 'marge'],
        tension: 'Excitement vs. due diligence',
        designImplication: 'Evaluate hype vs. substance in technology choices'
      },
      {
        scene: 'frinks-lab',
        characters: ['frink', 'homer'],
        tension: 'Technical debt warnings vs. shipping pressure',
        designImplication: 'Decide acceptable technical debt levels'
      }
    ],
    resolutionType: 'selection'
  },

  {
    id: 'you-only-move-twice',
    title: 'You Only Move Twice',
    season: 8,
    episode: 2,
    synopsis: 'Simpsons move to Cypress Creek. Green field design, perfect environment.',
    narrativePattern: 'hero-journey',
    suitableFor: ['architecture', 'infrastructure'],
    characterSequence: ['homer', 'marge', 'lisa', 'bart', 'burns', 'smithers'],
    sceneSequence: ['simpson-living-room', 'simpson-kitchen', 'springfield-library', 'springfield-elementary', 'burns-office', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'burns-office',
        characters: ['burns', 'homer'],
        tension: 'Idealism vs. hidden costs',
        designImplication: 'Uncover hidden requirements in "perfect" solutions'
      }
    ],
    resolutionType: 'compromise'
  },

  // =========================================================================
  // MIGRATION & LEGACY
  // =========================================================================
  {
    id: 'burns-verkaufen',
    title: 'Burns Verkaufen der Kraftwerk',
    season: 3,
    episode: 11,
    synopsis: 'Plant sold to Germans. Outsider perspective on existing systems.',
    narrativePattern: 'transformation',
    suitableFor: ['migration', 'architecture'],
    characterSequence: ['burns', 'smithers', 'homer', 'grampa', 'lisa', 'marge'],
    sceneSequence: ['burns-office', 'nuclear-plant', 'moes-tavern', 'simpson-living-room', 'springfield-library', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'nuclear-plant',
        characters: ['homer', 'burns'],
        tension: 'Institutional knowledge vs. documentation',
        designImplication: 'Capture tribal knowledge before migration'
      },
      {
        scene: 'moes-tavern',
        characters: ['moe', 'homer'],
        tension: 'Comfort with old vs. fear of new',
        designImplication: 'Plan change management alongside technical migration'
      }
    ],
    resolutionType: 'transformation'
  },

  // =========================================================================
  // USER EXPERIENCE
  // =========================================================================
  {
    id: 'lisas-substitute',
    title: "Lisa's Substitute",
    season: 2,
    episode: 19,
    synopsis: 'Lisa connects with Mr. Bergstrom. Deep user empathy and understanding.',
    narrativePattern: 'hero-journey',
    suitableFor: ['user-experience', 'planning'],
    characterSequence: ['lisa', 'marge', 'homer', 'milhouse', 'bart', 'flanders'],
    sceneSequence: ['springfield-elementary', 'simpson-kitchen', 'simpson-living-room', 'android-dungeon', 'simpson-backyard', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'simpson-living-room',
        characters: ['lisa', 'homer'],
        tension: 'User needs vs. builder assumptions',
        designImplication: 'Validate that you\'re solving the right problem'
      }
    ],
    resolutionType: 'innovation'
  },

  // =========================================================================
  // COMPLIANCE & STANDARDS
  // =========================================================================
  {
    id: 'homer-the-heretic',
    title: 'Homer the Heretic',
    season: 4,
    episode: 3,
    synopsis: 'Homer skips church. Questioning established practices, finding what matters.',
    narrativePattern: 'hero-journey',
    suitableFor: ['compliance', 'planning'],
    characterSequence: ['homer', 'flanders', 'lovejoy', 'marge', 'lisa', 'burns'],
    sceneSequence: ['simpson-living-room', 'simpson-backyard', 'town-hall', 'simpson-kitchen', 'springfield-library', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'simpson-backyard',
        characters: ['homer', 'flanders'],
        tension: 'Following rules blindly vs. understanding purpose',
        designImplication: 'Distinguish compliance theater from meaningful standards'
      }
    ],
    resolutionType: 'synthesis'
  },

  // =========================================================================
  // TEAM & SCALING
  // =========================================================================
  {
    id: 'kamp-krusty',
    title: 'Kamp Krusty',
    season: 4,
    episode: 1,
    synopsis: 'Summer camp goes wrong. Scaling beyond capacity, quality degradation.',
    narrativePattern: 'escalation-resolve',
    suitableFor: ['infrastructure', 'planning'],
    characterSequence: ['bart', 'lisa', 'krusty', 'milhouse', 'nelson', 'marge'],
    sceneSequence: ['simpson-living-room', 'springfield-elementary', 'krustylu-studios', 'android-dungeon', 'moes-tavern', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'krustylu-studios',
        characters: ['krusty', 'bart'],
        tension: 'Scaling promises vs. delivery reality',
        designImplication: 'Plan capacity before committing to scale'
      }
    ],
    resolutionType: 'compromise'
  },

  // =========================================================================
  // DATA & ANALYTICS
  // =========================================================================
  {
    id: 'lisa-the-skeptic',
    title: 'Lisa the Skeptic',
    season: 9,
    episode: 8,
    synopsis: 'Angel skeleton found. Data interpretation, confirmation bias, truth-seeking.',
    narrativePattern: 'mystery-reveal',
    suitableFor: ['data', 'debugging'],
    characterSequence: ['lisa', 'frink', 'lovejoy', 'cbg', 'burns', 'homer'],
    sceneSequence: ['springfield-elementary', 'frinks-lab', 'town-hall', 'android-dungeon', 'burns-office', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'frinks-lab',
        characters: ['frink', 'lisa'],
        tension: 'Scientific rigor vs. public pressure',
        designImplication: 'Define data quality standards before analysis'
      },
      {
        scene: 'android-dungeon',
        characters: ['cbg', 'lisa'],
        tension: 'Expert opinion vs. evidence',
        designImplication: 'Distinguish expertise from data'
      }
    ],
    resolutionType: 'innovation'
  },

  // =========================================================================
  // INTEGRATION
  // =========================================================================
  {
    id: 'itchy-scratchy-land',
    title: 'Itchy & Scratchy Land',
    season: 6,
    episode: 4,
    synopsis: 'Theme park vacation goes wrong. Complex system integration, cascade failures.',
    narrativePattern: 'escalation-resolve',
    suitableFor: ['integration', 'debugging'],
    characterSequence: ['homer', 'marge', 'lisa', 'bart', 'frink', 'apu'],
    sceneSequence: ['simpson-living-room', 'simpson-kitchen', 'springfield-library', 'simpson-garage', 'frinks-lab', 'elementary-playground'],
    conflictPoints: [
      {
        scene: 'frinks-lab',
        characters: ['frink', 'bart'],
        tension: 'System complexity vs. failure modes',
        designImplication: 'Map integration dependencies before they fail'
      }
    ],
    resolutionType: 'synthesis'
  }
];

/**
 * Get episode templates suitable for a problem domain
 */
export function getTemplatesForDomain(domain: ProblemDomain): EpisodeTemplate[] {
  return EPISODE_TEMPLATES.filter(t => t.suitableFor.includes(domain));
}

/**
 * Get templates by narrative pattern
 */
export function getTemplatesByPattern(pattern: NarrativePattern): EpisodeTemplate[] {
  return EPISODE_TEMPLATES.filter(t => t.narrativePattern === pattern);
}

/**
 * Find best template for a set of domains
 */
export function findBestTemplate(domains: ProblemDomain[]): EpisodeTemplate | undefined {
  // Score templates by how many domains they cover
  const scored = EPISODE_TEMPLATES.map(t => ({
    template: t,
    score: domains.filter(d => t.suitableFor.includes(d)).length
  }));
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  return scored[0]?.template;
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EpisodeTemplate | undefined {
  return EPISODE_TEMPLATES.find(t => t.id === id);
}

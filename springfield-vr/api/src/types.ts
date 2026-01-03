/**
 * Springfield VR - Core Types
 */

// ============================================================================
// PROBLEM CLASSIFICATION
// ============================================================================

export type ProblemDomain =
  | 'architecture'
  | 'performance'
  | 'security'
  | 'data'
  | 'integration'
  | 'user-experience'
  | 'infrastructure'
  | 'migration'
  | 'debugging'
  | 'planning'
  | 'compliance';

export type ProblemComplexity = 'simple' | 'moderate' | 'complex' | 'epic';

export interface ProblemClassification {
  statement: string;
  primaryDomain: ProblemDomain;
  secondaryDomains: ProblemDomain[];
  complexity: ProblemComplexity;
  keywords: string[];
  suggestedDuration: number; // minutes
  confidence: number; // 0-1
  // Extended fields from Claude classification
  implicitRequirements?: string[];
  suggestedCharacters?: string[];
  riskAreas?: string[];
}

// ============================================================================
// CHARACTERS
// ============================================================================

export type CharacterTier = 'core' | 'extended' | 'springfield' | 'specialist';

export type CharacterId =
  // Core Simpson Family
  | 'homer'
  | 'marge'
  | 'bart'
  | 'lisa'
  | 'maggie'
  // Extended Family
  | 'grampa'
  | 'burns'
  | 'smithers'
  | 'flanders'
  // Springfield Residents
  | 'apu'
  | 'moe'
  | 'barney'
  | 'krusty'
  | 'milhouse'
  | 'nelson'
  | 'ralph'
  | 'wiggum'
  | 'skinner'
  | 'willie'
  | 'frink'
  | 'cbg'
  | 'bob'
  // Specialists
  | 'hibbert'
  | 'nick'
  | 'lionel'
  | 'troy'
  | 'kent'
  | 'otto'
  | 'lovejoy'
  | 'fat-tony'
  | 'snake';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  tier: CharacterTier;
  role: string;
  expertise: ProblemDomain[];
  questionStyle: 'direct' | 'socratic' | 'challenging' | 'supportive' | 'chaotic';
  artifactType: string;
  catchphrases: string[];
  conflictsWith: CharacterId[];
  synergyWith: CharacterId[];
}

// ============================================================================
// SCENES
// ============================================================================

export type SceneId =
  | 'simpson-living-room'
  | 'simpson-kitchen'
  | 'simpson-garage'
  | 'simpson-backyard'
  | 'moes-tavern'
  | 'kwik-e-mart'
  | 'nuclear-plant'
  | 'burns-office'
  | 'springfield-elementary'
  | 'elementary-playground'
  | 'frinks-lab'
  | 'springfield-library'
  | 'android-dungeon'
  | 'town-hall'
  | 'police-station'
  | 'springfield-general'
  | 'krustylu-studios'
  | 'channel-6';

export interface SceneConfig {
  id: SceneId;
  name: string;
  description: string;
  ambiance: 'casual' | 'professional' | 'chaotic' | 'formal' | 'educational';
  typicalCharacters: CharacterId[];
  suitableFor: ProblemDomain[];
  environmentAssets: string[];
  lighting: 'day' | 'night' | 'dramatic' | 'cozy';
}

// ============================================================================
// EPISODES
// ============================================================================

export interface EpisodeTemplate {
  id: string;
  title: string;
  season: number;
  episode: number;
  synopsis: string;
  narrativePattern: NarrativePattern;
  suitableFor: ProblemDomain[];
  characterSequence: CharacterId[];
  sceneSequence: SceneId[];
  conflictPoints: ConflictPoint[];
  resolutionType: ResolutionType;
}

export type NarrativePattern =
  | 'hero-journey'        // Problem → Struggle → Victory
  | 'ensemble-solve'      // Multiple perspectives converge
  | 'escalation-resolve'  // Things get worse before better
  | 'parallel-threads'    // Multiple storylines merge
  | 'mystery-reveal'      // Uncover hidden requirements
  | 'competition'         // Competing solutions evaluated
  | 'transformation';     // Complete paradigm shift

export interface ConflictPoint {
  scene: SceneId;
  characters: [CharacterId, CharacterId];
  tension: string; // What they disagree about
  designImplication: string; // What this forces the user to decide
}

export type ResolutionType =
  | 'synthesis'        // Combine multiple viewpoints
  | 'selection'        // Choose one path
  | 'compromise'       // Trade-offs accepted
  | 'innovation'       // New solution emerges
  | 'delegation'       // Hand off to specialist
  | 'transformation';  // Fundamental change in approach

// ============================================================================
// GENERATED EPISODE
// ============================================================================

export interface GeneratedEpisode {
  id: string;
  title: string;
  basedOn: string; // Template ID
  problem: ProblemClassification;
  characterSequence: CharacterInstance[];
  sceneSequence: SceneInstance[];
  estimatedDuration: number; // minutes
  generatedAt: Date;
}

export interface CharacterInstance {
  character: CharacterId;
  scene: SceneId;
  order: number;
  purpose: string;
  interviewFocus: string[];
  expectedArtifacts: string[];
  transitionTo: CharacterId | 'playground';
}

export interface SceneInstance {
  scene: SceneId;
  order: number;
  characters: CharacterId[];
  narrative: string;
  userObjective: string;
}

// ============================================================================
// SESSION & ARTIFACTS
// ============================================================================

export interface VRSession {
  id: string;
  userId: string;
  episode: GeneratedEpisode;
  currentScene: number;
  currentCharacter: number;
  artifacts: Artifact[];
  startedAt: Date;
  lastActivity: Date;
  status: 'active' | 'paused' | 'at-playground' | 'building' | 'complete';
}

export interface Artifact {
  id: string;
  sessionId: string;
  character: CharacterId;
  scene: SceneId;
  type: string;
  title: string;
  content: string;
  createdAt: Date;
}

// ============================================================================
// RALPH EXECUTION
// ============================================================================

export interface RalphJob {
  id: string;
  sessionId: string;
  artifacts: Artifact[];
  status: 'queued' | 'running' | 'iterating' | 'complete' | 'failed';
  iteration: number;
  maxIterations: number;
  gitBranch: string;
  outputPath: string;
  startedAt?: Date;
  completedAt?: Date;
  result?: RalphResult;
}

export interface RalphResult {
  success: boolean;
  iterationsUsed: number;
  filesCreated: string[];
  testsPassing: number;
  testsFailing: number;
  coverage: number;
  buildOutput: string;
  deploymentUrl?: string;
}

// ============================================================================
// API MESSAGES
// ============================================================================

export interface GenerateEpisodeRequest {
  problemStatement: string;
  userId: string;
  preferences?: {
    maxDuration?: number;
    excludeCharacters?: CharacterId[];
    focusDomains?: ProblemDomain[];
  };
}

export interface GenerateEpisodeResponse {
  episode: GeneratedEpisode;
  session: VRSession;
}

export interface CharacterInteractionRequest {
  sessionId: string;
  characterId: CharacterId;
  userMessage: string;
}

export interface CharacterInteractionResponse {
  characterMessage: string;
  artifacts?: Artifact[];
  isComplete: boolean;
  nextCharacter?: CharacterId;
  nextScene?: SceneId;
}

export interface StartRalphRequest {
  sessionId: string;
}

export interface RalphStatusResponse {
  job: RalphJob;
}

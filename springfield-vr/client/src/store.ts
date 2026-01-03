/**
 * Springfield VR - Zustand Store
 */

import { create } from 'zustand';

// Types matching API
interface VRSession {
  id: string;
  userId: string;
  episode: GeneratedEpisode;
  currentScene: number;
  currentCharacter: number;
  status: string;
}

interface GeneratedEpisode {
  id: string;
  title: string;
  characterSequence: CharacterInstance[];
  sceneSequence: SceneInstance[];
}

interface CharacterInstance {
  character: string;
  scene: string;
  order: number;
  purpose: string;
}

interface SceneInstance {
  scene: string;
  order: number;
  characters: string[];
  narrative: string;
}

interface RalphJob {
  id: string;
  status: string;
  iteration: number;
  result?: {
    success: boolean;
    filesCreated: string[];
  };
}

interface SprintfieldState {
  // State
  session: VRSession | null;
  currentCharacter: CharacterInstance | null;
  currentScene: SceneInstance | null;
  ralphJob: RalphJob | null;
  isLoading: boolean;
  error: string | null;
  conversationHistory: Array<{
    role: 'user' | 'character';
    content: string;
    character?: string;
  }>;
  
  // Actions
  startEpisode: (problemStatement: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  startRalph: () => Promise<void>;
  checkRalphStatus: () => Promise<void>;
  reset: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSpringfieldStore = create<SprintfieldState>((set, get) => ({
  // Initial state
  session: null,
  currentCharacter: null,
  currentScene: null,
  ralphJob: null,
  isLoading: false,
  error: null,
  conversationHistory: [],
  
  // Start a new episode
  startEpisode: async (problemStatement: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE}/api/episode/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          userId: 'vr-user-' + Math.random().toString(36).slice(2)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate episode');
      }
      
      const data = await response.json();
      
      set({
        session: data.session,
        currentCharacter: data.session.episode.characterSequence[0],
        currentScene: data.session.episode.sceneSequence[0],
        isLoading: false,
        conversationHistory: [{
          role: 'character',
          content: `Welcome to "${data.session.episode.title}"! I'm ${data.session.episode.characterSequence[0].character}. ${data.session.episode.characterSequence[0].purpose}`,
          character: data.session.episode.characterSequence[0].character
        }]
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },
  
  // Send message to current character
  sendMessage: async (message: string) => {
    const { session, currentCharacter } = get();
    if (!session || !currentCharacter) return;
    
    // Add user message to history
    set(state => ({
      conversationHistory: [
        ...state.conversationHistory,
        { role: 'user', content: message }
      ],
      isLoading: true
    }));
    
    try {
      const response = await fetch(`${API_BASE}/api/session/${session.id}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: message })
      });
      
      if (!response.ok) {
        throw new Error('Interaction failed');
      }
      
      const data = await response.json();
      
      // Add character response to history
      set(state => ({
        conversationHistory: [
          ...state.conversationHistory,
          { 
            role: 'character', 
            content: data.characterMessage,
            character: currentCharacter.character
          }
        ],
        isLoading: false
      }));
      
      // Update current character if moved to next
      if (data.isComplete && data.nextCharacter) {
        const nextChar = session.episode.characterSequence.find(
          c => c.character === data.nextCharacter
        );
        const nextScene = session.episode.sceneSequence.find(
          s => s.scene === data.nextScene
        );
        
        set(state => ({
          currentCharacter: nextChar || null,
          currentScene: nextScene || state.currentScene,
          conversationHistory: [
            ...state.conversationHistory,
            {
              role: 'character',
              content: `*You move to ${data.nextScene}* Hi, I'm ${data.nextCharacter}!`,
              character: data.nextCharacter
            }
          ]
        }));
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },
  
  // Start Ralph execution
  startRalph: async () => {
    const { session } = get();
    if (!session) return;
    
    set({ isLoading: true });
    
    try {
      const response = await fetch(`${API_BASE}/api/session/${session.id}/ralph/start`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start Ralph');
      }
      
      const data = await response.json();
      set({ ralphJob: data.job, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },
  
  // Check Ralph job status
  checkRalphStatus: async () => {
    const { ralphJob } = get();
    if (!ralphJob) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/ralph/${ralphJob.id}`);
      
      if (response.ok) {
        const data = await response.json();
        set({ ralphJob: data.job });
      }
    } catch (error) {
      console.error('Failed to check Ralph status:', error);
    }
  },
  
  // Reset to initial state
  reset: () => {
    set({
      session: null,
      currentCharacter: null,
      currentScene: null,
      ralphJob: null,
      isLoading: false,
      error: null,
      conversationHistory: []
    });
  }
}));

import { create } from 'zustand';

export type CharacterId = 
  | 'homer' | 'marge' | 'bart' | 'lisa' | 'maggie'
  | 'grampa' | 'burns' | 'smithers' | 'flanders' | 'milhouse'
  | 'moe' | 'wiggum' | 'ralph' | 'frink' | 'krusty';

export interface Message {
  id: string;
  sender: CharacterId | 'user';
  content: string;
  timestamp: Date;
}

export interface Classification {
  domains: string[];
  primaryDomain: string;
  complexity: 'low' | 'medium' | 'high' | 'extreme';
  suggestedCharacters: CharacterId[];
}

export interface RalphStatus {
  state: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  currentStep?: string;
  logs: string[];
  branch?: string;
}

export interface Episode {
  code: string;
  title: string;
  themes: string[];
}

export interface AppState {
  // Session
  sessionId: string | null;
  problem: string;
  
  // Classification
  classification: Classification | null;
  isClassifying: boolean;
  
  // Characters
  activeCharacter: CharacterId | null;
  consultedCharacters: CharacterId[];
  
  // Chat
  messages: Message[];
  isSending: boolean;
  
  // Ralph
  ralphStatus: RalphStatus;
  
  // Episodes
  relevantEpisodes: Episode[];
  
  // WebSocket
  wsConnected: boolean;
  
  // Actions
  setProblem: (problem: string) => void;
  submitProblem: () => Promise<void>;
  selectCharacter: (character: CharacterId) => void;
  sendMessage: (content: string) => Promise<void>;
  startRalph: () => Promise<void>;
  connectWebSocket: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateRalphStatus: (status: Partial<RalphStatus>) => void;
  reset: () => void;
}

const API_BASE = '/api';

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  sessionId: null,
  problem: '',
  classification: null,
  isClassifying: false,
  activeCharacter: null,
  consultedCharacters: [],
  messages: [],
  isSending: false,
  ralphStatus: {
    state: 'idle',
    progress: 0,
    logs: [],
  },
  relevantEpisodes: [],
  wsConnected: false,
  
  // Actions
  setProblem: (problem) => set({ problem }),
  
  submitProblem: async () => {
    const { problem } = get();
    if (!problem.trim()) return;
    
    set({ isClassifying: true });
    
    try {
      const response = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });
      
      const data = await response.json();
      
      set({
        sessionId: data.sessionId,
        classification: data.classification,
        relevantEpisodes: data.relevantEpisodes || [],
        isClassifying: false,
      });
      
      // Connect WebSocket for real-time updates
      get().connectWebSocket();
      
    } catch (error) {
      console.error('Failed to submit problem:', error);
      set({ isClassifying: false });
    }
  },
  
  selectCharacter: (character) => {
    set({ activeCharacter: character });
  },
  
  sendMessage: async (content) => {
    const { sessionId, activeCharacter, consultedCharacters } = get();
    if (!sessionId || !activeCharacter || !content.trim()) return;
    
    // Add user message
    get().addMessage({ sender: 'user', content });
    
    set({ isSending: true });
    
    try {
      const response = await fetch(`${API_BASE}/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: activeCharacter,
          message: content,
        }),
      });
      
      const data = await response.json();
      
      // Add character response
      get().addMessage({
        sender: activeCharacter,
        content: data.response,
      });
      
      // Track consulted characters
      if (!consultedCharacters.includes(activeCharacter)) {
        set({ consultedCharacters: [...consultedCharacters, activeCharacter] });
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      set({ isSending: false });
    }
  },
  
  startRalph: async () => {
    const { sessionId } = get();
    if (!sessionId) return;
    
    set({
      ralphStatus: {
        state: 'running',
        progress: 0,
        logs: ['Starting Ralph...'],
      },
    });
    
    try {
      await fetch(`${API_BASE}/sessions/${sessionId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Real-time updates come via WebSocket
    } catch (error) {
      console.error('Failed to start Ralph:', error);
      set({
        ralphStatus: {
          state: 'error',
          progress: 0,
          logs: ['Failed to start Ralph'],
        },
      });
    }
  },
  
  connectWebSocket: () => {
    const { sessionId } = get();
    if (!sessionId) return;
    
    const ws = new WebSocket(`ws://${window.location.host}/ws`);
    
    ws.onopen = () => {
      set({ wsConnected: true });
      ws.send(JSON.stringify({ type: 'subscribe', sessionId }));
    };
    
    ws.onclose = () => {
      set({ wsConnected: false });
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'ralph:started':
          get().updateRalphStatus({
            state: 'running',
            branch: data.branch,
          });
          break;
          
        case 'ralph:progress':
          get().updateRalphStatus({
            progress: data.progress,
            currentStep: data.step,
            logs: [...get().ralphStatus.logs, data.step],
          });
          break;
          
        case 'ralph:output':
          get().updateRalphStatus({
            logs: [...get().ralphStatus.logs, data.output],
          });
          break;
          
        case 'ralph:completed':
          get().updateRalphStatus({
            state: 'completed',
            progress: 100,
            logs: [...get().ralphStatus.logs, 'Execution completed!'],
          });
          break;
          
        case 'ralph:error':
          get().updateRalphStatus({
            state: 'error',
            logs: [...get().ralphStatus.logs, `Error: ${data.error}`],
          });
          break;
          
        case 'character:message':
          get().addMessage({
            sender: data.character,
            content: data.content,
          });
          break;
      }
    };
  },
  
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    set({ messages: [...get().messages, newMessage] });
  },
  
  updateRalphStatus: (status) => {
    set({
      ralphStatus: { ...get().ralphStatus, ...status },
    });
  },
  
  reset: () => {
    set({
      sessionId: null,
      problem: '',
      classification: null,
      isClassifying: false,
      activeCharacter: null,
      consultedCharacters: [],
      messages: [],
      isSending: false,
      ralphStatus: { state: 'idle', progress: 0, logs: [] },
      relevantEpisodes: [],
      wsConnected: false,
    });
  },
}));

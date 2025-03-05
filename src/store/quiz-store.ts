import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PROJECT_ID, persistStorage } from '~/lib/constants';

interface QuizState {
  score: number;
  currentStage: number;
  sessionToken: string;
  lastResponseTime: number;
  nonce: string;
  initializeSession: () => Promise<void>;
  updateScore: (correct: boolean) => void;
  recordResponseTime: () => void;
  generateNonce: () => Promise<string>;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      score: 0,
      currentStage: 1,
      sessionToken: '',
      lastResponseTime: 0,
      nonce: '',
      
      initializeSession: async () => {
        // Combine multiple entropy sources for session token
        const entropy = `${performance.now()}-${Math.random()}-${navigator.userAgent}`;
        const token = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(entropy)
        ).then(buf => Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0')).join(''));

        const nonce = await get().generateNonce();
        
        set({ 
          sessionToken: token,
          nonce,
          score: 0,
          currentStage: 1,
          lastResponseTime: Date.now() // Initialize with current time
        });
      },

      updateScore: (correct) => {
        const newScore = correct ? get().score + 1 : Math.max(0, get().score - 1);
        const newStage = Math.floor(newScore / 5) + 1;
        set({ 
          score: newScore,
          currentStage: newStage
        });
      },

      recordResponseTime: () => {
        const now = Date.now();
        // Prevent rapid answers (minimum 1 second between responses)
        if (now - get().lastResponseTime < 1000) return;
        set({ lastResponseTime: now });
      },

      generateNonce: async () => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        const hashBuffer = await crypto.subtle.digest('SHA-256', array);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    }),
    {
      name: PROJECT_ID,
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => ({
        sessionToken: state.sessionToken,
        score: state.score,
        currentStage: state.currentStage,
        lastResponseTime: state.lastResponseTime,
        responseTimes: state.responseTimes
      }),
    }
  )
);

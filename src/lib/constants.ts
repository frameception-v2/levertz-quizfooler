export const PROJECT_ID = 'farcaster-frames-template';
export const PROJECT_TITLE = "Farcaster Frames Template";
export const PROJECT_DESCRIPTION = "A Farcaster Frames v2 Template by hellno";

export const generateSessionToken = async (input: string): Promise<string> => {
  if (!crypto.subtle) {
    throw new Error('Crypto API not available in this environment');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(input + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyNonce = async (input: string, storedNonce: string): Promise<boolean> => {
  if (!crypto.subtle) return false;
  
  try {
    // Recreate the hash using original input + stored nonce
    const encoder = new TextEncoder();
    const data = encoder.encode(input + storedNonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    const computedNonce = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
    return computedNonce === storedNonce;
  } catch (error) {
    console.error('Nonce verification failed:', error);
    return false;
  }
};

export type QuizState = {
  sessionToken: string;
  score: number;
  lastResponseTime: number;
  responseTimes: number[];
};

// Local storage middleware for Zustand
export const persistStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export type Question = {
  latex: string;
  answer: string;
  difficulty: number;
};

const RESPONSE_THROTTLE = 1000; // Minimum 1 second between answers

// Anti-spam throttle check
const validateResponseTiming = (lastResponseTime: number) => {
  const now = Date.now();
  if (now - lastResponseTime < RESPONSE_THROTTLE) {
    throw new Error('Too many responses too quickly');
  }
  return now;
};

export const recordResponseTime = (state: QuizState) => {
  const now = validateResponseTiming(state.lastResponseTime);
  return {
    responseTimes: [...state.responseTimes, now],
    lastResponseTime: now
  };
};

export const generateQuestion = (difficulty: number): Question => {
  // Calculate linear progression from 2 to 6 based on correct answers
  const stage = Math.min(difficulty + 2, 6);
  
  // Alternate question types with increasing complexity
  return difficulty % 2 === 0
    ? generateLimitQuestion(stage)
    : generateIntegralQuestion(stage);
};

const generateLimitQuestion = (n: number): Question => {
  const equation = `\\lim\\limits_{x \\to ${n}} \\frac{x^2 - ${n**2}}{x - ${n}}`;
  return {
    latex: equation,
    answer: (2 * n).toString(),
    difficulty: n
  };
};

const generateIntegralQuestion = (n: number): Question => {
  const equation = `\\int_{0}^{${n}} x^2 dx`;
  return {
    latex: equation,
    answer: ((n**3)/3).toString(),
    difficulty: n
  };
};

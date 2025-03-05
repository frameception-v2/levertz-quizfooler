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

export type Question = {
  latex: string;
  answer: string;
  difficulty: number;
};

export const generateQuestion = (difficulty: number): Question => {
  // Alternate between limit and integral questions
  return difficulty % 2 === 0 
    ? generateLimitQuestion(difficulty)
    : generateIntegralQuestion(difficulty);
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

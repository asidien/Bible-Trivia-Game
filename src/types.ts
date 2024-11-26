export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface ReflectionQuestion {
  id: number;
  text: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  reflectionQuestions?: ReflectionQuestion[];
}

export interface GameState {
  currentLevel: number;
  currentQuestionIndex: number;
  score: number;
  rewards: string[];
  isGameOver: boolean;
  answeredCorrectly: boolean[];
  showingIntro: boolean;
  showLevelComplete: boolean;
  journalEntries: Record<string, string>;
  selectedLocation: any;
}

export interface Scene {
  id: number;
  level: number;
  word: string;
  image: string;
  description: string;
  hint: string;
  points: number;
}
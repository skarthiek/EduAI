export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // Changed from number to string to match backend
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
  createdBy: string;
  createdAt: Date;
  uniqueCode: string; // 6-digit unique code
  isActive: boolean;
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}
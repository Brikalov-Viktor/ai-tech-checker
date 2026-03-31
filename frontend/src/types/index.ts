// Типы для пользователя
export interface User {
    id: string;
    name: string;
    login: string;
    role: 'user' | 'admin';
    grade?: 'junior' | 'junior+' | 'middle' | 'middle+' | 'senior';
  }
  
  // Типы для темы
  export interface Subject {
    id: number;
    name: string;
    description?: string;
  }
  
  // Типы для вопроса
  export type Difficulty = 'easy' | 'medium' | 'hard';
  
  export interface Question {
    id: number;
    text: string;
    difficulty: Difficulty;
    subject: Subject;
  }
  
  // Типы для интервью
  export type InterviewStatus = 'in_progress' | 'completed' | 'cancelled';
  
  export interface Interview {
    id: string;
    status: InterviewStatus;
    score: number | null;
    startedAt: string;
    completedAt: string | null;
    position?: {
      id: number;
      title: string;
    };
  }
  
  // Типы для ответов API
  export interface StartInterviewResponse {
    success: boolean;
    data: {
      interviewId: string;
      questions: Question[];
      totalQuestions: number;
    };
  }
  
  export interface SubmitAnswerResponse {
    success: boolean;
    data: {
      success: boolean;
      answerId: string;
      mark: number;
      feedback: string;
      isCorrect: boolean;
      answeredCount: number;
      isCompleted: boolean;
    };
  }
  
  export interface AnswerFeedback {
    mark: number;
    feedback: string;
    isCorrect: boolean;
    answeredCount: number;
    isCompleted: boolean;
  }
  
  export interface Answer {
    questionId: number;
    answer: string;
    feedback?: AnswerFeedback;
  }
  
  export interface InterviewResult {
    questionId: number;
    questionText: string;
    subject: string;
    difficulty: Difficulty;
    userAnswer: string;
    mark: number;
    feedback: string;
    isCorrect: boolean;
  }
  
  export interface CompleteInterviewResponse {
    success: boolean;
    data: {
      interviewId: string;
      score: number;
      averageMark: number;
      recommendations: string[];
      results: InterviewResult[];
      completedAt: string;
      totalQuestions: number;
    };
  }
  
  export interface InterviewStats {
    totalInterviews: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    scoresOverTime: {
      date: string;
      score: number;
    }[];
  }
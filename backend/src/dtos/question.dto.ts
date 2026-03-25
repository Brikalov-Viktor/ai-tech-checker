import { QuestionDifficulty } from '../entities/Question';

export interface CreateQuestionDto {
  text: string;
  correctAnswer: string;
  difficulty: QuestionDifficulty;
  subjectId: number;
}

export interface UpdateQuestionDto {
  text?: string;
  correctAnswer?: string;
  difficulty?: QuestionDifficulty;
  subjectId?: number;
}
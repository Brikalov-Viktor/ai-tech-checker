export interface CreateInterviewDto {
    positionId?: number;
    questionsCount?: number;
    subjects?: number[]; // ID тем для тестирования
  }
  
  export interface SubmitAnswerDto {
    questionId: number;
    answer: string;
  }
  
  export interface CompleteInterviewDto {
    interviewId: string;
  }
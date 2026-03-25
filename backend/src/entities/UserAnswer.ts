import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Interview } from './Interview';
  import { Question } from './Question';
  
  @Entity('user_answers')
  export class UserAnswer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Interview, interview => interview.userAnswers)
    @JoinColumn({ name: 'interview_id' })
    interview: Interview;
  
    @Column({ name: 'interview_id' })
    interviewId: string;
  
    @ManyToOne(() => Question, question => question.userAnswers)
    @JoinColumn({ name: 'question_id' })
    question: Question;
  
    @Column({ name: 'question_id' })
    questionId: number;
  
    @Column({ type: 'text', name: 'user_answer_text' })
    userAnswerText: string;
  
    @Column({ type: 'boolean', nullable: true, name: 'is_correct' })
    isCorrect: boolean;
  
    @Column({ type: 'int', nullable: true, name: 'ai_mark' })
    aiMark: number; // Оценка AI от 1 до 5
  
    @Column({ type: 'text', nullable: true, name: 'ai_feedback' })
    aiFeedback: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
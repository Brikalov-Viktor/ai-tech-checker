import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subject } from './Subject';
import { UserAnswer } from './UserAnswer';

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', name: 'correct_answer' })
  correctAnswer: string;

  @Column({
    type: 'enum',
    enum: QuestionDifficulty,
    default: QuestionDifficulty.MEDIUM
  })
  difficulty: QuestionDifficulty;

  @ManyToOne(() => Subject, subject => subject.questions)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @OneToMany(() => UserAnswer, userAnswer => userAnswer.question)
  userAnswers: UserAnswer[];
}
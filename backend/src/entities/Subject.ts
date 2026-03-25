import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './Question';
import { PositionSubject } from './PositionSubject';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Question, question => question.subject)
  questions: Question[];

  @OneToMany(() => PositionSubject, positionSubject => positionSubject.subject)
  positionSubjects: PositionSubject[];
}
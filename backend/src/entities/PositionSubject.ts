import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Position } from './Position';
import { Subject } from './Subject';

@Entity('position_subjects')
export class PositionSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Position, position => position.positionSubjects)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'position_id' })
  positionId: number;

  @ManyToOne(() => Subject, subject => subject.positionSubjects)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @Column({ type: 'int', default: 1 })
  weight: number; // Вес темы для данной позиции
}
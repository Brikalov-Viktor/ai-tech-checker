import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Interview } from './Interview';
import { PositionSubject } from './PositionSubject';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  config: any; // Хранит веса тем и другие настройки

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Interview, interview => interview.position)
  interviews: Interview[];

  @OneToMany(() => PositionSubject, positionSubject => positionSubject.position)
  positionSubjects: PositionSubject[];
}
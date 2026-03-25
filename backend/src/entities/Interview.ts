import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { User } from './User';
  import { Position } from './Position';
  import { UserAnswer } from './UserAnswer';
  
  export enum InterviewStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
  }
  
  @Entity('interviews')
  export class Interview {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, user => user.interviews)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ name: 'user_id' })
    userId: string;
  
    @ManyToOne(() => Position, position => position.interviews)
    @JoinColumn({ name: 'position_id' })
    position: Position;
  
    @Column({ name: 'position_id', nullable: true })
    positionId: number;
  
    @Column({
      type: 'enum',
      enum: InterviewStatus,
      default: InterviewStatus.IN_PROGRESS
    })
    status: InterviewStatus;
  
    @Column({ type: 'float', nullable: true })
    score: number;
  
    @Column({ type: 'jsonb', nullable: true })
    recommendations: any; // Хранит рекомендации AI
  
    @CreateDateColumn({ name: 'started_at' })
    startedAt: Date;
  
    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToMany(() => UserAnswer, userAnswer => userAnswer.interview)
    userAnswers: UserAnswer[];
  }
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany 
  } from 'typeorm';
  import { Interview } from './Interview';
  
  export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
  }
  
  export enum UserGrade {
    JUNIOR = 'junior',
    JUNIOR_PLUS = 'junior+',
    MIDDLE = 'middle',
    MIDDLE_PLUS = 'middle+',
    SENIOR = 'senior'
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ unique: true, length: 100 })
    login: string;
  
    @Column()
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER
    })
    role: UserRole;
  
    @Column({
      type: 'enum',
      enum: UserGrade,
      nullable: true
    })
    grade: UserGrade;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToMany(() => Interview, interview => interview.user)
    interviews: Interview[];
  }
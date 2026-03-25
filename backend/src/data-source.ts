import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/User';
import { Subject } from './entities/Subject';
import { Position } from './entities/Position';
import { PositionSubject } from './entities/PositionSubject';
import { Question } from './entities/Question';
import { Interview } from './entities/Interview';
import { UserAnswer } from './entities/UserAnswer';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ai_tech_checker',
  synchronize: false,
  logging: true,
  entities: [User, Subject, Position, PositionSubject, Question, Interview, UserAnswer],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
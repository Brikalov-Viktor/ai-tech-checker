import { User, UserRole, UserGrade } from '../entities/User';
import bcrypt from 'bcryptjs';
import { QueryRunner } from 'typeorm';

export async function seedUsers(queryRunner: QueryRunner) {
  console.log('\n👤 Seeding users...');
  
  const userRepository = queryRunner.manager.getRepository(User);
  
  const usersData = [
    {
      name: 'Администратор',
      login: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      grade: UserGrade.SENIOR
    },
    {
      name: 'Иван Петров',
      login: 'ivan.petrov',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      grade: UserGrade.JUNIOR
    },
    {
      name: 'Елена Смирнова',
      login: 'elena.smirnova',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      grade: UserGrade.MIDDLE
    },
    {
      name: 'Алексей Иванов',
      login: 'alexey.ivanov',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      grade: UserGrade.JUNIOR_PLUS
    },
    {
      name: 'Мария Петрова',
      login: 'maria.petrova',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      grade: UserGrade.MIDDLE_PLUS
    }
  ];
  
  const savedUsers = [];
  for (const userData of usersData) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    savedUsers.push(user);
    console.log(`  ✓ Created user: ${user.login} (${user.role}, ${user.grade || 'no grade'})`);
  }
  
  return savedUsers;
}
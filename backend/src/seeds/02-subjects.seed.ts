import { Subject } from '../entities/Subject';
import { QueryRunner } from 'typeorm';

export async function seedSubjects(queryRunner: QueryRunner) {
  console.log('\n📚 Seeding subjects...');
  
  const subjectRepository = queryRunner.manager.getRepository(Subject);
  
  const subjectsData = [
    { name: 'JavaScript', description: 'Основы JavaScript, асинхронность, замыкания, прототипы' },
    { name: 'React', description: 'React hooks, компоненты, состояние, жизненный цикл' },
    { name: 'TypeScript', description: 'Типизация, интерфейсы, дженерики, утилитарные типы' },
    { name: 'Git', description: 'Система контроля версий, ветки, merge, rebase' },
    { name: 'Computer Science', description: 'Алгоритмы, структуры данных, О-нотация' },
    { name: 'Node.js', description: 'Серверный JavaScript, Express, middleware' },
    { name: 'HTML/CSS', description: 'Верстка, адаптивность, flexbox, grid' },
    { name: 'Databases', description: 'SQL, PostgreSQL, индексы, оптимизация' },
    { name: 'Algorithms', description: 'Алгоритмы сортировки, поиска, динамическое программирование' },
    { name: 'Design Patterns', description: 'Паттерны проектирования в JavaScript' }
  ];
  
  const subjects: Subject[] = [];
  for (const subjectData of subjectsData) {
    const subject = subjectRepository.create(subjectData);
    await subjectRepository.save(subject);
    subjects.push(subject);
    console.log(`  ✓ Created subject: ${subject.name}`);
  }
  
  return subjects;
}
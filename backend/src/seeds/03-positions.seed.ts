import { Position } from '../entities/Position';
import { PositionSubject } from '../entities/PositionSubject';
import { Subject } from '../entities/Subject';
import { QueryRunner } from 'typeorm';

export async function seedPositions(queryRunner: QueryRunner, subjects: Subject[]) {
  console.log('\n💼 Seeding positions...');
  
  const positionRepository = queryRunner.manager.getRepository(Position);
  const positionSubjectRepository = queryRunner.manager.getRepository(PositionSubject);
  
  const positionsData = [
    {
      title: 'Junior Frontend Developer',
      description: 'Начальный уровень. Знание HTML/CSS, JavaScript, React',
      subjects: [
        { name: 'HTML/CSS', weight: 30 },
        { name: 'JavaScript', weight: 40 },
        { name: 'React', weight: 20 },
        { name: 'Git', weight: 10 }
      ]
    },
    {
      title: 'Middle Frontend Developer',
      description: 'Средний уровень. Глубокое знание React, TypeScript, оптимизация',
      subjects: [
        { name: 'React', weight: 40 },
        { name: 'TypeScript', weight: 30 },
        { name: 'JavaScript', weight: 20 },
        { name: 'Git', weight: 10 }
      ]
    },
    {
      title: 'Fullstack Developer',
      description: 'Разработка и фронтенд и бэкенд. Node.js, базы данных',
      subjects: [
        { name: 'React', weight: 20 },
        { name: 'Node.js', weight: 30 },
        { name: 'Databases', weight: 20 },
        { name: 'JavaScript', weight: 20 },
        { name: 'Git', weight: 10 }
      ]
    },
    {
      title: 'React Developer',
      description: 'Специализация на React экосистеме',
      subjects: [
        { name: 'React', weight: 50 },
        { name: 'TypeScript', weight: 30 },
        { name: 'JavaScript', weight: 20 }
      ]
    },
    {
      title: 'Node.js Developer',
      description: 'Бэкенд разработка на Node.js',
      subjects: [
        { name: 'Node.js', weight: 50 },
        { name: 'Databases', weight: 25 },
        { name: 'JavaScript', weight: 15 },
        { name: 'Git', weight: 10 }
      ]
    }
  ];
  
  const positions: Position[] = [];
  
  for (const positionData of positionsData) {
    const position = positionRepository.create({
      title: positionData.title,
      description: positionData.description
    });
    await positionRepository.save(position);
    
    // Связываем с темами
    for (const subjectWeight of positionData.subjects) {
      const subject = subjects.find(s => s.name === subjectWeight.name);
      if (subject) {
        const ps = positionSubjectRepository.create({
          positionId: position.id,
          subjectId: subject.id,
          weight: subjectWeight.weight
        });
        await positionSubjectRepository.save(ps);
      }
    }
    
    positions.push(position);
    console.log(`  ✓ Created position: ${position.title}`);
  }
  
  return positions;
}
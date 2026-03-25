import { AppDataSource } from '../data-source';
import { User, UserRole, UserGrade } from '../entities/User';
import { Subject } from '../entities/Subject';
import { Position } from '../entities/Position';
import { Question, QuestionDifficulty } from '../entities/Question';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    // Создаем админа
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User();
    admin.name = 'Admin';
    admin.login = 'admin';
    admin.password = adminPassword;
    admin.role = UserRole.ADMIN;
    await AppDataSource.manager.save(admin);
    console.log('Admin created');

    // Создаем тестового пользователя
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User();
    user.name = 'Test User';
    user.login = 'testuser';
    user.password = userPassword;
    user.role = UserRole.USER;
    user.grade = UserGrade.JUNIOR;
    await AppDataSource.manager.save(user);
    console.log('Test user created');

    // Создаем темы
    const subjects = [
      { name: 'Фронтенд', description: 'HTML, CSS, браузерные API' },
      { name: 'Бэкенд', description: 'Серверная разработка, API' },
      { name: 'JavaScript', description: 'Основы JS, асинхронность' },
      { name: 'Computer Science', description: 'Алгоритмы, структуры данных' },
      { name: 'Git', description: 'Система контроля версий' },
      { name: 'TypeScript', description: 'Типизация, утилиты' },
      { name: 'React', description: 'Компоненты, хуки, состояние' }
    ];

    const savedSubjects = [];
    for (const subjectData of subjects) {
      const subject = new Subject();
      subject.name = subjectData.name;
      subject.description = subjectData.description;
      await AppDataSource.manager.save(subject);
      savedSubjects.push(subject);
      console.log(`Subject created: ${subject.name}`);
    }

    // Создаем позиции
    const positions = [
      { title: 'Junior Frontend Developer', description: 'Начальный уровень фронтенд разработки' },
      { title: 'Middle Frontend Developer', description: 'Средний уровень фронтенд разработки' },
      { title: 'Fullstack Developer', description: 'Разработка и фронтенд и бэкенд' }
    ];

    for (const positionData of positions) {
      const position = new Position();
      position.title = positionData.title;
      position.description = positionData.description;
      await AppDataSource.manager.save(position);
      console.log(`Position created: ${position.title}`);
    }

    // Создаем вопросы
    const questions = [
      // JavaScript вопросы
      {
        text: 'Что такое замыкание (closure) в JavaScript? Приведите пример.',
        correctAnswer: 'Замыкание - это функция, которая имеет доступ к переменным из внешней функции даже после того, как внешняя функция завершила выполнение. Пример: function outer() { let x = 10; return function inner() { console.log(x); } }',
        difficulty: QuestionDifficulty.MEDIUM,
        subject: savedSubjects.find(s => s.name === 'JavaScript') ?? savedSubjects[0]
      },
      {
        text: 'Объясните разницу между var, let и const.',
        correctAnswer: 'var - функциональная область видимости, можно переопределять; let - блочная область видимости, можно изменять; const - блочная область видимости, нельзя переопределить, но можно изменять свойства объектов.',
        difficulty: QuestionDifficulty.EASY,
        subject: savedSubjects.find(s => s.name === 'JavaScript') ?? savedSubjects[0]
      },
      // React вопросы
      {
        text: 'Что такое хуки в React? Назовите основные хуки и их назначение.',
        correctAnswer: 'Хуки - функции для использования состояния и других возможностей React в функциональных компонентах. Основные: useState (управление состоянием), useEffect (побочные эффекты), useContext (контекст), useReducer (сложное состояние).',
        difficulty: QuestionDifficulty.MEDIUM,
        subject: savedSubjects.find(s => s.name === 'React') ?? savedSubjects[0]
      },
      {
        text: 'Как оптимизировать производительность React приложения?',
        correctAnswer: 'Использовать React.memo для мемоизации компонентов, useMemo и useCallback для мемоизации значений и функций, ленивую загрузку компонентов (React.lazy), виртуализацию списков, избегать лишних ререндеров.',
        difficulty: QuestionDifficulty.HARD,
        subject: savedSubjects.find(s => s.name === 'React') ?? savedSubjects[0]
      },
      // TypeScript вопросы
      {
        text: 'Что такое дженерики (generics) в TypeScript? Приведите пример.',
        correctAnswer: 'Дженерики - возможность создавать компоненты, работающие с разными типами данных. Пример: function identity<T>(arg: T): T { return arg; }',
        difficulty: QuestionDifficulty.MEDIUM,
        subject: savedSubjects.find(s => s.name === 'TypeScript') ?? savedSubjects[0]
      },
      // Git вопросы
      {
        text: 'Чем отличается git merge от git rebase?',
        correctAnswer: 'Merge создает коммит слияния, сохраняя историю веток. Rebase переписывает историю, перенося коммиты на новую базу, создавая линейную историю.',
        difficulty: QuestionDifficulty.MEDIUM,
        subject: savedSubjects.find(s => s.name === 'Git') ?? savedSubjects[0]
      }
    ];

    for (const questionData of questions) {
      const question = new Question();
      question.text = questionData.text;
      question.correctAnswer = questionData.correctAnswer;
      question.difficulty = questionData.difficulty;
      question.subject = questionData.subject;
      await AppDataSource.manager.save(question);
      console.log(`Question created: ${question.text.substring(0, 50)}...`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
import { Question, QuestionDifficulty } from '../entities/Question';
import { Subject } from '../entities/Subject';
import { QueryRunner } from 'typeorm';

export async function seedQuestions(queryRunner: QueryRunner, subjects: Subject[]) {
  console.log('\n❓ Seeding questions...');
  
  const questionRepository = queryRunner.manager.getRepository(Question);
  
  const getSubject = (name: string) => subjects.find(s => s.name === name)!;
  
  const questionsData = [
    // JavaScript вопросы
    {
      text: 'Что такое замыкание (closure) в JavaScript? Приведите пример использования.',
      correctAnswer: 'Замыкание - это функция, которая имеет доступ к переменным из внешней функции даже после того, как внешняя функция завершила выполнение. Пример: function outer() { let x = 10; return function inner() { console.log(x); } } const closure = outer(); closure(); // выведет 10',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('JavaScript')
    },
    {
      text: 'Объясните разницу между var, let и const. Когда что использовать?',
      correctAnswer: 'var - функциональная область видимости, можно переопределять, поднимается (hoisting). let - блочная область видимости, можно изменять. const - блочная область видимости, нельзя переопределить, но можно изменять свойства объектов. Рекомендуется использовать const по умолчанию, let когда нужно переназначение, var не использовать.',
      difficulty: QuestionDifficulty.EASY,
      subject: getSubject('JavaScript')
    },
    {
      text: 'Что такое промисы (Promises) и как они работают?',
      correctAnswer: 'Promise - объект, представляющий результат асинхронной операции. Состояния: pending (ожидание), fulfilled (успешно), rejected (ошибка). Методы: then() для успешного результата, catch() для ошибок, finally() для завершения. Промисы позволяют избежать "callback hell" и писать асинхронный код более читаемо.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('JavaScript')
    },
    {
      text: 'Объясните, как работает async/await. В чем преимущества перед промисами?',
      correctAnswer: 'async/await - синтаксический сахар над промисами. async функция всегда возвращает Promise. await приостанавливает выполнение функции до завершения Promise. Преимущества: более чистый и читаемый код, похожий на синхронный, лучше обработка ошибок через try/catch.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('JavaScript')
    },
    {
      text: 'Что такое Event Loop в JavaScript? Как он работает?',
      correctAnswer: 'Event Loop - механизм, позволяющий выполнять асинхронный код в однопоточном JavaScript. Он отслеживает очередь задач (callback queue) и перемещает задачи в стек вызовов, когда он пуст. Микрозадачи (Promise, process.nextTick) выполняются перед макрозадачами (setTimeout, setInterval).',
      difficulty: QuestionDifficulty.HARD,
      subject: getSubject('JavaScript')
    },
    
    // React вопросы
    {
      text: 'Что такое хуки (hooks) в React? Назовите основные хуки и их назначение.',
      correctAnswer: 'Хуки - функции для использования состояния и других возможностей React в функциональных компонентах. Основные: useState (управление локальным состоянием), useEffect (побочные эффекты), useContext (доступ к контексту), useReducer (сложное состояние), useMemo (мемоизация значений), useCallback (мемоизация функций).',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('React')
    },
    {
      text: 'Как оптимизировать производительность React приложения? Назовите основные методы.',
      correctAnswer: 'Методы оптимизации: 1) React.memo для мемоизации компонентов, 2) useMemo и useCallback для мемоизации значений и функций, 3) ленивая загрузка компонентов (React.lazy), 4) виртуализация длинных списков (react-window), 5) избегать анонимных функций в пропсах, 6) правильное использование ключей в списках, 7) Code splitting через динамические импорты.',
      difficulty: QuestionDifficulty.HARD,
      subject: getSubject('React')
    },
    {
      text: 'Чем управляемое (controlled) и неуправляемое (uncontrolled) состояние отличаются?',
      correctAnswer: 'Управляемое: значение input контролируется React через state, onChange обновляет состояние. Неуправляемое: значение хранится в DOM, доступ через ref. Управляемые дают больше контроля, но требуют больше кода. Неуправляемые проще, но меньше контроля.',
      difficulty: QuestionDifficulty.EASY,
      subject: getSubject('React')
    },
    
    // TypeScript вопросы
    {
      text: 'Что такое дженерики (generics) в TypeScript? Приведите пример использования.',
      correctAnswer: 'Дженерики - возможность создавать компоненты, работающие с разными типами данных, сохраняя типобезопасность. Пример: function identity<T>(arg: T): T { return arg; } const num = identity<number>(5); const str = identity<string>("hello");',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('TypeScript')
    },
    {
      text: 'Чем интерфейс (interface) отличается от типа (type) в TypeScript?',
      correctAnswer: 'Interface: может быть объединен (declaration merging), лучше для объектов и классов, поддерживает extends. Type: может быть объединением (union), пересечением (intersection), примитивом, кортежем. Оба похожи, но interface предпочтительнее для объектов, type для сложных типов.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('TypeScript')
    },
    
    // Git вопросы
    {
      text: 'Чем отличается git merge от git rebase? Когда что использовать?',
      correctAnswer: 'Merge создает коммит слияния, сохраняя полную историю веток. Rebase переписывает историю, перенося коммиты на новую базу, создавая линейную историю. Merge лучше для публичных веток, rebase для локальных, чтобы поддерживать чистую историю.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('Git')
    },
    {
      text: 'Как отменить коммит, который уже был запушен в удаленный репозиторий?',
      correctAnswer: 'Два способа: 1) git revert <commit-hash> - создает новый коммит с отменой изменений (безопасно для публичных веток). 2) git reset --hard <commit-hash> && git push --force - удаляет коммит из истории (опасно, если кто-то уже стянул изменения).',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('Git')
    },
    
    // Node.js вопросы
    {
      text: 'Что такое middleware в Express? Приведите пример.',
      correctAnswer: 'Middleware - функции, имеющие доступ к объектам запроса (req) и ответа (res), выполняющиеся в процессе обработки запроса. Пример: app.use((req, res, next) => { console.log("Time:", Date.now()); next(); });',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('Node.js')
    },
    {
      text: 'Чем process.nextTick() отличается от setImmediate()?',
      correctAnswer: 'process.nextTick() выполняется на текущей фазе event loop, перед продолжением, имеет самый высокий приоритет. setImmediate() выполняется в следующей итерации event loop, на фазе проверки. NextTick может привести к starvation, если вызывать рекурсивно.',
      difficulty: QuestionDifficulty.HARD,
      subject: getSubject('Node.js')
    },
    
    // HTML/CSS вопросы
    {
      text: 'Что такое семантическая верстка? Назовите основные семантические теги.',
      correctAnswer: 'Семантическая верстка - использование HTML тегов в соответствии с их смысловым значением. Основные теги: header, nav, main, article, section, aside, footer, figure, figcaption. Это улучшает SEO, доступность и понимание структуры страницы.',
      difficulty: QuestionDifficulty.EASY,
      subject: getSubject('HTML/CSS')
    },
    {
      text: 'Объясните разницу между flexbox и grid. Когда что использовать?',
      correctAnswer: 'Flexbox - одномерная модель (ряд или колонка), идеален для выравнивания элементов в одном направлении. Grid - двумерная модель, для сложных сеток по строкам и колонкам. Flexbox для компонентов, Grid для макетов страниц.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('HTML/CSS')
    },
    
    // Databases вопросы
    {
      text: 'Что такое индексы в базе данных? Какие типы индексов бывают?',
      correctAnswer: 'Индексы - структуры данных для ускорения поиска записей. Типы: B-Tree (по умолчанию), Hash (для точных совпадений), GiST (для геоданных), GIN (для массивов и JSON). Индексы ускоряют чтение, но замедляют запись.',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('Databases')
    },
    
    // Algorithms вопросы
    {
      text: 'Объясните разницу между стеком и очередью. Приведите примеры использования.',
      correctAnswer: 'Стек (LIFO) - последним пришел, первым ушел. Пример: история браузера, call stack. Очередь (FIFO) - первым пришел, первым ушел. Пример: очередь задач, обработка запросов.',
      difficulty: QuestionDifficulty.EASY,
      subject: getSubject('Algorithms')
    },
    
    // Design Patterns вопросы
    {
      text: 'Что такое паттерн Singleton? Приведите пример реализации в JavaScript.',
      correctAnswer: 'Singleton гарантирует, что класс имеет только один экземпляр. Реализация: class Singleton { constructor() { if (!Singleton.instance) { Singleton.instance = this; } return Singleton.instance; } }',
      difficulty: QuestionDifficulty.MEDIUM,
      subject: getSubject('Design Patterns')
    }
  ];
  
  const questions: Question[] = [];
  for (const qData of questionsData) {
    const question = questionRepository.create({
      text: qData.text,
      correctAnswer: qData.correctAnswer,
      difficulty: qData.difficulty,
      subjectId: qData.subject.id
    });
    await questionRepository.save(question);
    questions.push(question);
    console.log(`  ✓ Created question: ${qData.text.substring(0, 60)}...`);
  }
  
  console.log(`  Total questions created: ${questions.length}`);
  return questions;
}
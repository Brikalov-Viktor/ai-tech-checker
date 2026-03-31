import { AppDataSource } from '../data-source';
import { AIService } from '../services/ai.service';
import { Question } from '../entities/Question';
import dotenv from 'dotenv';

dotenv.config();

async function testAIService() {
  try {
    console.log('🚀 Starting AI Service Test\n');
    
    // Подключаемся к БД
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');
    
    // Создаем экземпляр AI сервиса
    const aiService = new AIService();
    
    // Получаем 3 вопроса из БД
    const questionRepository = AppDataSource.getRepository(Question);
    const questions = await questionRepository.find({
      relations: ['subject'],
      take: 3
    });
    
    if (questions.length < 3) {
      console.log('❌ Not enough questions in database. Please run seeds first.');
      return;
    }
    
    // Тестовые ответы (разного качества)
    const testAnswers = [
      {
        answer: "Замыкание - это когда внутренняя функция имеет доступ к переменным внешней функции. Например: function outer() { let x = 10; return function inner() { console.log(x); } }",
        quality: "хороший"
      },
      {
        answer: "Замыкание - это функция",
        quality: "плохой"
      },
      {
        answer: "Замыкание в JavaScript - это механизм, который позволяет функции запоминать и иметь доступ к переменным из внешней области видимости даже после того, как внешняя функция завершила свое выполнение. Это происходит потому, что функция сохраняет ссылку на свое лексическое окружение. Практическое применение: создание приватных переменных, каррирование, мемоизация. Пример: const counter = (function() { let count = 0; return { increment: () => ++count, get: () => count }; })();",
        quality: "отличный"
      }
    ];
    
    console.log('=' .repeat(60));
    console.log('📝 AI Evaluation Test\n');
    
    // Тестируем каждый вопрос
    for (let i = 0; i < 3; i++) {
      const question = questions[i];
      const testAnswer = testAnswers[i];
      
      console.log(`\n📌 Question ${i + 1}: ${question.text}`);
      console.log(`📖 Subject: ${question.subject.name}`);
      console.log(`⭐ Difficulty: ${question.difficulty}`);
      console.log(`\n💬 Test Answer (${testAnswer.quality}):`);
      console.log(`   "${testAnswer.answer}"`);
      console.log(`\n🤖 AI Evaluation in progress...`);
      
      try {
        const evaluation = await aiService.evaluateAnswer(question, testAnswer.answer);
        
        console.log(`\n📊 Result:`);
        console.log(`   Mark: ${evaluation.mark}/5`);
        console.log(`   Correct: ${evaluation.isCorrect ? '✅ Yes' : '❌ No'}`);
        console.log(`   Feedback: ${evaluation.feedback}`);
        if (evaluation.keyPoints && evaluation.keyPoints.length > 0) {
          console.log(`   Key points:`);
          evaluation.keyPoints.forEach(point => console.log(`     • ${point}`));
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error}`);
      }
      
      console.log('\n' + '-'.repeat(60));
    }
    
    // Тестируем генерацию рекомендаций
    console.log('\n📝 Recommendations Generation Test\n');
    
    // Создаем мок-данные ответов для рекомендаций
    const mockAnswers = questions.slice(0, 2).map(q => ({
      aiMark: 3,
      aiFeedback: "Ответ неполный",
      question: {
        ...q,
        subject: q.subject,
        text: q.text
      }
    }));
    
    console.log('Generating recommendations based on weak answers...');
    const recommendations = await aiService.generateRecommendations(mockAnswers as any);
    
    console.log('\n📋 Recommendations:');
    recommendations.forEach((rec, idx) => {
      console.log(`   ${idx + 1}. ${rec}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ AI Service Test Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('\n👋 Database connection closed');
  }
}

// Запускаем тест
testAIService();
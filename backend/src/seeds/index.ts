import { AppDataSource } from '../data-source';
import { SeedHelper } from './seeds.config';
import { seedUsers } from './01-users.seed';
import { seedSubjects } from './02-subjects.seed';
import { seedPositions } from './03-positions.seed';
import { seedQuestions } from './04-questions.seed';

async function runAllSeeds() {
  let queryRunner = null;
  
  try {
    console.log('🚀 Starting database seeding...\n');
    
    // Инициализируем подключение
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');
    
    // Начинаем транзакцию
    queryRunner = await SeedHelper.startTransaction();
    
    // Очищаем таблицы в правильном порядке
    console.log('🗑️  Cleaning existing data...');
    await SeedHelper.clearTables([
      'user_answers',
      'interviews',
      'questions',
      'position_subjects',
      'positions',
      'subjects',
      'users'
    ]);
    console.log('✅ All tables cleaned\n');
    
    // Запускаем сиды по порядку, передавая queryRunner
    const users = await seedUsers(queryRunner);
    const subjects = await seedSubjects(queryRunner);
    const positions = await seedPositions(queryRunner, subjects);
    const questions = await seedQuestions(queryRunner, subjects);
    
    // Коммитим транзакцию
    await SeedHelper.commitTransaction();
    
    // Выводим статистику
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`  👤 Users: ${users.length} (1 admin, ${users.length - 1} users)`);
    console.log(`  📚 Subjects: ${subjects.length}`);
    console.log(`  💼 Positions: ${positions.length}`);
    console.log(`  ❓ Questions: ${questions.length}`);
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    if (queryRunner) {
      await SeedHelper.rollbackTransaction();
      console.log('🔄 Transaction rolled back');
    }
  } finally {
    await AppDataSource.destroy();
    console.log('\n👋 Database connection closed');
  }
}

// Запускаем сиды
runAllSeeds().catch(console.error);
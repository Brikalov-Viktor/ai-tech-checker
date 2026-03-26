import { Question } from '../entities/Question';

export class AIService {
  // Временная заглушка для AI проверки
  // Позже заменим на реальный вызов OpenAI или другой LLM
  async evaluateAnswer(question: Question, userAnswer: string): Promise<{ mark: number; feedback: string; isCorrect: boolean }> {
    // Простая эвристика для демонстрации
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = question.correctAnswer.toLowerCase().trim();
    
    // Проверяем ключевые слова из правильного ответа
    const correctKeywords = this.extractKeywords(normalizedCorrectAnswer);
    const matchedKeywords = correctKeywords.filter(keyword => 
      normalizedUserAnswer.includes(keyword.toLowerCase())
    );
    
    const matchPercentage = matchedKeywords.length / correctKeywords.length;
    
    let mark: number;
    let feedback: string;
    let isCorrect: boolean;
    
    if (matchPercentage >= 0.8) {
      mark = 5;
      feedback = 'Отличный ответ! Вы полностью раскрыли тему.';
      isCorrect = true;
    } else if (matchPercentage >= 0.6) {
      mark = 4;
      feedback = 'Хороший ответ, но есть небольшие неточности. Рекомендую углубиться в тему.';
      isCorrect = true;
    } else if (matchPercentage >= 0.4) {
      mark = 3;
      feedback = 'Ответ удовлетворительный, но пропущены важные моменты. Посмотрите правильный ответ.';
      isCorrect = false;
    } else {
      mark = 2;
      feedback = 'Ответ неполный. Рекомендую изучить тему более подробно.';
      isCorrect = false;
    }
    
    return { mark, feedback, isCorrect };
  }
  
  private extractKeywords(text: string): string[] {
    // Простое извлечение ключевых слов (разбиваем на слова и убираем стоп-слова)
    const stopWords = ['это', 'как', 'для', 'в', 'на', 'с', 'по', 'из', 'и', 'а', 'но', 'или', 'то'];
    const words = text.split(/[\s,.;:!?()]+/);
    return words.filter(word => 
      word.length > 3 && !stopWords.includes(word) && !this.isNumber(word)
    );
  }
  
  private isNumber(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
  }
  
  async generateRecommendations(userAnswers: any[]): Promise<string[]> {
    // Генерация рекомендаций на основе ответов
    const weakTopics = new Map<string, number>();
    
    for (const answer of userAnswers) {
      if (answer.aiMark && answer.aiMark < 4) {
        const topic = answer.question.subject.name;
        const currentScore = weakTopics.get(topic) || 0;
        weakTopics.set(topic, currentScore + (5 - answer.aiMark));
      }
    }
    
    const recommendations: string[] = [];
    for (const [topic, score] of weakTopics.entries()) {
      if (score > 3) {
        recommendations.push(`Рекомендуется углубить знания в теме "${topic}". Обратите внимание на основные концепции и практические примеры.`);
      } else if (score > 0) {
        recommendations.push(`По теме "${topic}" стоит повторить материал и выполнить дополнительные упражнения.`);
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Отличная работа! Продолжайте в том же духе. Рекомендуется переходить к более сложным темам.');
    }
    
    return recommendations;
  }
}
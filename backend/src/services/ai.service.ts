import { Question } from '../entities/Question';
import OpenAI from 'openai';

interface AIEvaluation {
  mark: number;
  feedback: string;
  isCorrect: boolean;
  keyPoints: string[];
}

export class AIService {
  private client: OpenAI;
  private model: string;
  private useAI: boolean;

  constructor() {
    // Проверяем наличие API ключа
    this.useAI = !!process.env.DEEPSEEK_API_KEY;
    
    if (this.useAI) {
      this.client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1'
      });
      this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
      console.log('🤖 AI Service initialized with DeepSeek');
    } else {
      console.warn('⚠️  DEEPSEEK_API_KEY not found, using fallback evaluation');
    }
  }

  async evaluateAnswer(question: Question, userAnswer: string): Promise<AIEvaluation> {
    if (!this.useAI || !userAnswer || userAnswer.trim().length === 0) {
      return this.fallbackEvaluation(userAnswer);
    }

    try {
      const prompt = this.buildPrompt(question, userAnswer);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Ты - эксперт по техническому собеседованию. Твоя задача - оценить ответ кандидата на вопрос.
            
Критерии оценки:
- Полнота ответа (насколько раскрыта тема)
- Точность (нет ли фактических ошибок)
- Структурированность (логика изложения)

Отвечай ТОЛЬКО в формате JSON без дополнительного текста.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Низкая температура для более консервативных оценок
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      // Парсим JSON ответ
      const evaluation = JSON.parse(content);
      
      return {
        mark: this.normalizeMark(evaluation.mark),
        feedback: evaluation.feedback || this.generateDefaultFeedback(evaluation.mark),
        isCorrect: evaluation.isCorrect ?? evaluation.mark >= 3.5,
        keyPoints: evaluation.keyPoints || []
      };
      
    } catch (error) {
      console.error('AI evaluation error:', error);
      return this.fallbackEvaluation(userAnswer);
    }
  }

  private buildPrompt(question: Question, userAnswer: string): string {
    return `
Вопрос: ${question.text}

Эталонный ответ: ${question.correctAnswer}

Ответ кандидата: ${userAnswer}

Оцени ответ и верни JSON в формате:
{
  "mark": число от 1 до 5,
  "feedback": "обоснование оценки на русском языке",
  "isCorrect": true/false,
  "keyPoints": ["что сделано хорошо", "что нужно улучшить"]
}

Обрати внимание:
- Оценка 5: полный, точный и структурированный ответ
- Оценка 4: хороший ответ, но есть небольшие неточности или неполнота
- Оценка 3: удовлетворительный ответ, но пропущены важные моменты
- Оценка 2: ответ поверхностный, много ошибок
- Оценка 1: ответ неверный или не по теме
`;
  }

  private normalizeMark(mark: any): number {
    let numMark = typeof mark === 'number' ? mark : parseFloat(mark);
    if (isNaN(numMark)) return 3;
    numMark = Math.max(1, Math.min(5, numMark));
    return Math.round(numMark * 2) / 2; // Округляем до 0.5
  }

  private generateDefaultFeedback(mark: number): string {
    if (mark >= 4.5) return 'Отличный ответ! Тема полностью раскрыта.';
    if (mark >= 3.5) return 'Хороший ответ, но есть небольшие недочеты.';
    if (mark >= 2.5) return 'Удовлетворительный ответ. Рекомендуется углубить знания.';
    return 'Ответ неполный. Рекомендуется изучить тему подробнее.';
  }

  private fallbackEvaluation(userAnswer: string): AIEvaluation {
    // Простая эвристика для работы без AI
    const answerLength = userAnswer?.trim().length || 0;
    
    if (answerLength < 20) {
      return {
        mark: 2,
        feedback: 'Ответ слишком короткий. Рекомендуется давать более развернутые ответы.',
        isCorrect: false,
        keyPoints: ['Нужно больше деталей', 'Раскройте тему подробнее']
      };
    }
    
    if (answerLength < 100) {
      return {
        mark: 3,
        feedback: 'Ответ удовлетворительный, но можно добавить больше деталей.',
        isCorrect: true,
        keyPoints: ['Хорошая попытка', 'Добавьте примеры']
      };
    }
    
    return {
      mark: 4,
      feedback: 'Хороший развернутый ответ.',
      isCorrect: true,
      keyPoints: ['Ответ структурирован', 'Есть ключевые моменты']
    };
  }

  async generateRecommendations(userAnswers: any[]): Promise<string[]> {
    if (!this.useAI || userAnswers.length === 0) {
      return this.fallbackRecommendations(userAnswers);
    }

    try {
      const weakAnswers = userAnswers.filter(a => a.aiMark && a.aiMark < 4);
      
      if (weakAnswers.length === 0) {
        return ['Отличная работа! Продолжайте в том же духе.'];
      }

      const topics = weakAnswers.map(a => a.question.subject.name);
      const uniqueTopics = [...new Set(topics)];
      
      const prompt = `
Кандидат прошел техническое собеседование. Нужно сформулировать рекомендации по развитию.

Слабые темы: ${uniqueTopics.join(', ')}

Примеры слабых ответов:
${weakAnswers.slice(0, 3).map(a => `- Тема: ${a.question.subject.name}\n  Вопрос: ${a.question.text}\n  Оценка: ${a.aiMark}/5\n  Обратная связь: ${a.aiFeedback}`).join('\n')}

Сформулируй 2-3 конкретные рекомендации для кандидата. Каждая рекомендация должна быть практичной и указывать, что именно нужно учить.
Верни ответ в формате JSON: { "recommendations": ["рекомендация 1", "рекомендация 2"] }
`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Ты - ментор по техническому развитию. Давай конкретные, практичные рекомендации.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return parsed.recommendations || this.fallbackRecommendations(userAnswers);
      }
      
      return this.fallbackRecommendations(userAnswers);
      
    } catch (error) {
      console.error('AI recommendations error:', error);
      return this.fallbackRecommendations(userAnswers);
    }
  }

  private fallbackRecommendations(userAnswers: any[]): string[] {
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
        recommendations.push(`Рекомендуется углубить знания в теме "${topic}". Изучите документацию и выполните практические задания.`);
      } else if (score > 0) {
        recommendations.push(`По теме "${topic}" стоит повторить материал. Обратите внимание на ключевые концепции.`);
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Отличная работа! Рекомендуется переходить к более сложным темам.');
    }
    
    return recommendations;
  }
}
import { AppDataSource } from '../data-source';
import { Interview, InterviewStatus } from '../entities/Interview';
import { UserAnswer } from '../entities/UserAnswer';
import { Question } from '../entities/Question';
import { Position } from '../entities/Position';
import { QuestionService } from './question.service';
import { AIService } from './ai.service';
import { CreateInterviewDto, SubmitAnswerDto } from '../dtos/interview.dto';

export class InterviewService {
  private interviewRepository = AppDataSource.getRepository(Interview);
  private userAnswerRepository = AppDataSource.getRepository(UserAnswer);
  private questionService = new QuestionService();
  private aiService = new AIService();

  async startInterview(userId: string, data: CreateInterviewDto) {
    const { positionId, questionsCount = 5, subjects } = data;

    // Проверяем позицию, если указана
    let position: Position | null = null;
    if (positionId) {
      position = await AppDataSource.getRepository(Position).findOne({
        where: { id: positionId }
      });
      if (!position) {
        throw new Error('Позиция не найдена');
      }
    }

    // Получаем вопросы
    let questions: Question[];
    if (subjects && subjects.length > 0) {
      // Получаем вопросы по указанным темам
      const allQuestions = await Promise.all(
        subjects.map(subjectId => 
          this.questionService.getQuestionsBySubject(subjectId)
        )
      );
      questions = allQuestions.flat();
      
      // Перемешиваем и берем нужное количество
      questions = this.shuffleArray(questions).slice(0, questionsCount);
    } else {
      // Получаем случайные вопросы
      questions = await this.questionService.getRandomQuestions(questionsCount);
    }

    if (questions.length === 0) {
      throw new Error('Нет доступных вопросов для тестирования');
    }

    // Создаем интервью
    const interview = this.interviewRepository.create({
      userId,
      positionId: positionId || undefined,
      status: InterviewStatus.IN_PROGRESS,
      startedAt: new Date()
    });

    await this.interviewRepository.save(interview);

    // Возвращаем вопросы (без правильных ответов)
    const questionsForUser = questions.map(q => ({
      id: q.id,
      text: q.text,
      difficulty: q.difficulty,
      subject: q.subject
    }));

    return {
      interviewId: interview.id,
      questions: questionsForUser,
      totalQuestions: questions.length
    };
  }

  async submitAnswer(userId: string, interviewId: string, data: SubmitAnswerDto) {
    const { questionId, answer } = data;

    // Проверяем существование интервью и права доступа
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId, userId },
      relations: ['userAnswers']
    });

    if (!interview) {
      throw new Error('Интервью не найдено или у вас нет доступа');
    }

    if (interview.status !== InterviewStatus.IN_PROGRESS) {
      throw new Error('Интервью уже завершено');
    }

    // Получаем вопрос
    const question = await this.questionService.getQuestionById(questionId);
    if (!question) {
      throw new Error('Вопрос не найден');
    }

    // Проверяем, не отвечал ли уже пользователь на этот вопрос
    const existingAnswer = interview.userAnswers.find(
      ua => ua.questionId === questionId
    );

    if (existingAnswer) {
      throw new Error('Ответ на этот вопрос уже был отправлен');
    }

    // AI проверка ответа
    const evaluation = await this.aiService.evaluateAnswer(question, data.answer);

    // Сохраняем ответ
    const userAnswer = this.userAnswerRepository.create({
        interviewId,
        questionId,
        userAnswerText: data.answer,
        aiMark: evaluation.mark,
        aiFeedback: evaluation.feedback,
        isCorrect: evaluation.isCorrect
    });

    await this.userAnswerRepository.save(userAnswer);

    // Проверяем, все ли вопросы已回答
    const answeredCount = interview.userAnswers.length + 1;
    const totalQuestions = await this.userAnswerRepository.count({
      where: { interviewId }
    });

    return {
      success: true,
      answerId: userAnswer.id,
      mark: evaluation.mark,
      feedback: evaluation.feedback,
      isCorrect: evaluation.isCorrect,
      answeredCount,
      isCompleted: answeredCount === totalQuestions
    };
  }

  async completeInterview(userId: string, interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId, userId },
      relations: ['userAnswers', 'userAnswers.question', 'userAnswers.question.subject']
    });

    if (!interview) {
      throw new Error('Интервью не найдено или у вас нет доступа');
    }

    if (interview.status !== InterviewStatus.IN_PROGRESS) {
      throw new Error('Интервью уже завершено');
    }

    // Вычисляем средний балл
    const totalMarks = interview.userAnswers.reduce((sum, answer) => sum + (answer.aiMark || 0), 0);
    const averageMark = totalMarks / interview.userAnswers.length;
    const score = (averageMark / 5) * 100; // Переводим в проценты

    // Генерируем рекомендации
    const recommendations = await this.aiService.generateRecommendations(interview.userAnswers);

    // Завершаем интервью
    interview.status = InterviewStatus.COMPLETED;
    interview.score = score;
    interview.recommendations = recommendations;
    interview.completedAt = new Date();

    await this.interviewRepository.save(interview);

    // Формируем детальные результаты
    const results = interview.userAnswers.map(answer => ({
      questionId: answer.questionId,
      questionText: answer.question.text,
      subject: answer.question.subject.name,
      difficulty: answer.question.difficulty,
      userAnswer: answer.userAnswerText,
      mark: answer.aiMark,
      feedback: answer.aiFeedback,
      isCorrect: answer.isCorrect
    }));

    return {
      interviewId: interview.id,
      score,
      averageMark,
      recommendations,
      results,
      completedAt: interview.completedAt,
      totalQuestions: interview.userAnswers.length
    };
  }

  async getUserInterviews(userId: string, period?: string) {
    const queryBuilder = this.interviewRepository
      .createQueryBuilder('interview')
      .where('interview.userId = :userId', { userId })
      .leftJoinAndSelect('interview.position', 'position')
      .orderBy('interview.startedAt', 'DESC');

    // Фильтр по периоду
    if (period) {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(0);
      }
      
      queryBuilder.andWhere('interview.startedAt >= :startDate', { startDate });
    }

    const interviews = await queryBuilder.getMany();
    return interviews;
  }

  async getInterviewDetails(userId: string, interviewId: string) {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId, userId },
      relations: ['position', 'userAnswers', 'userAnswers.question', 'userAnswers.question.subject']
    });

    if (!interview) {
      throw new Error('Интервью не найдено или у вас нет доступа');
    }

    const results = interview.userAnswers.map(answer => ({
      questionId: answer.questionId,
      questionText: answer.question.text,
      subject: answer.question.subject.name,
      difficulty: answer.question.difficulty,
      userAnswer: answer.userAnswerText,
      mark: answer.aiMark,
      feedback: answer.aiFeedback,
      isCorrect: answer.isCorrect,
      correctAnswer: answer.question.correctAnswer // Показываем правильный ответ только после завершения
    }));

    return {
      id: interview.id,
      status: interview.status,
      score: interview.score,
      recommendations: interview.recommendations,
      position: interview.position,
      startedAt: interview.startedAt,
      completedAt: interview.completedAt,
      results,
      totalQuestions: interview.userAnswers.length
    };
  }

  async getInterviewStats(userId: string) {
    const interviews = await this.interviewRepository.find({
      where: { userId, status: InterviewStatus.COMPLETED }
    });

    if (interviews.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        scoresOverTime: []
      };
    }

    const scores = interviews.map(i => i.score || 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Данные для графика (за последние 30 дней)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentInterviews = interviews
      .filter(i => i.completedAt && i.completedAt >= thirtyDaysAgo)
      .sort((a, b) => (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0))
      .map(i => ({
        date: i.completedAt?.toISOString().split('T')[0],
        score: i.score
      }));

    return {
      totalInterviews: interviews.length,
      averageScore: Math.round(averageScore),
      bestScore,
      worstScore,
      scoresOverTime: recentInterviews
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
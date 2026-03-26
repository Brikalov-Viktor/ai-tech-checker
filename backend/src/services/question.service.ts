import { AppDataSource } from '../data-source';
import { Question, QuestionDifficulty } from '../entities/Question';
import { Subject } from '../entities/Subject';
import { CreateQuestionDto, UpdateQuestionDto } from '../dtos/question.dto';

export class QuestionService {
  private questionRepository = AppDataSource.getRepository(Question);
  private subjectRepository = AppDataSource.getRepository(Subject);

  async getAllQuestions() {
    const questions = await this.questionRepository.find({
      relations: ['subject'],
      order: { id: 'DESC' }
    });
    return questions;
  }

  async getQuestionsBySubject(subjectId: number) {
    const questions = await this.questionRepository.find({
      where: { subjectId },
      relations: ['subject'],
      order: { difficulty: 'ASC' }
    });
    return questions;
  }

  async getQuestionsByDifficulty(difficulty: QuestionDifficulty) {
    const questions = await this.questionRepository.find({
      where: { difficulty },
      relations: ['subject'],
      order: { subjectId: 'ASC' }
    });
    return questions;
  }

  async getQuestionById(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['subject']
    });

    if (!question) {
      throw new Error('Вопрос не найден');
    }

    return question;
  }

  async getQuestionsPaginated(page: number = 1, limit: number = 10, subjectId?: number) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.questionRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.subject', 'subject')
      .skip(skip)
      .take(limit)
      .orderBy('question.id', 'DESC');
    
    if (subjectId) {
      queryBuilder.andWhere('question.subjectId = :subjectId', { subjectId });
    }
    
    const [questions, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createQuestion(data: CreateQuestionDto) {
    // Проверяем, существует ли тема
    const subject = await this.subjectRepository.findOne({
      where: { id: data.subjectId }
    });

    if (!subject) {
      throw new Error('Указанная тема не существует');
    }

    const question = this.questionRepository.create({
      text: data.text,
      correctAnswer: data.correctAnswer,
      difficulty: data.difficulty,
      subjectId: data.subjectId
    });

    await this.questionRepository.save(question);
    
    // Возвращаем вопрос с информацией о теме
    return await this.getQuestionById(question.id);
  }

  async updateQuestion(id: number, data: UpdateQuestionDto) {
    const question = await this.getQuestionById(id);

    // Если меняется subjectId, проверяем существование темы
    if (data.subjectId && data.subjectId !== question.subjectId) {
      const subject = await this.subjectRepository.findOne({
        where: { id: data.subjectId }
      });
      if (!subject) {
        throw new Error('Указанная тема не существует');
      }
    }

    Object.assign(question, data);
    await this.questionRepository.save(question);
    return await this.getQuestionById(question.id);
  }

  async deleteQuestion(id: number) {
    const question = await this.getQuestionById(id);
    
    // Проверяем, есть ли ответы на этот вопрос (позже добавим)
    // Пока просто удаляем
    
    await this.questionRepository.remove(question);
    return { message: 'Вопрос успешно удален' };
  }

  async getRandomQuestions(limit: number = 10, subjectId?: number, difficulty?: QuestionDifficulty) {
    const queryBuilder = this.questionRepository.createQueryBuilder('question');
    
    if (subjectId) {
      queryBuilder.andWhere('question.subjectId = :subjectId', { subjectId });
    }
    
    if (difficulty) {
      queryBuilder.andWhere('question.difficulty = :difficulty', { difficulty });
    }
    
    const questions = await queryBuilder
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
    
    return questions;
  }

  async getQuestionsStats() {
    const total = await this.questionRepository.count();
    const byDifficulty = await this.questionRepository
      .createQueryBuilder('question')
      .select('question.difficulty', 'difficulty')
      .addSelect('COUNT(*)', 'count')
      .groupBy('question.difficulty')
      .getRawMany();
    
    const bySubject = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.subject', 'subject')
      .select('subject.name', 'subjectName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('subject.name')
      .getRawMany();

    return {
      total,
      byDifficulty,
      bySubject
    };
  }
}
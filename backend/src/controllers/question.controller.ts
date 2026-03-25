import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dtos/question.dto';

const questionService = new QuestionService();

export class QuestionController {
  async getAllQuestions(req: Request, res: Response) {
    try {
      const questions = await questionService.getAllQuestions();
      res.json({
        success: true,
        data: questions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getQuestionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const question = await questionService.getQuestionById(id);
      res.json({
        success: true,
        data: question
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getQuestionsBySubject(req: Request, res: Response) {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const questions = await questionService.getQuestionsBySubject(subjectId);
      res.json({
        success: true,
        data: questions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRandomQuestions(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      const difficulty = req.query.difficulty as any;
      
      const questions = await questionService.getRandomQuestions(limit, subjectId, difficulty);
      res.json({
        success: true,
        data: questions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createQuestion(req: Request, res: Response) {
    try {
      const data: CreateQuestionDto = req.body;
      
      // Валидация
      if (!data.text || !data.correctAnswer || !data.difficulty || !data.subjectId) {
        return res.status(400).json({
          success: false,
          message: 'Все поля (text, correctAnswer, difficulty, subjectId) обязательны'
        });
      }

      const question = await questionService.createQuestion(data);
      res.status(201).json({
        success: true,
        data: question
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateQuestionDto = req.body;
      
      const question = await questionService.updateQuestion(id, data);
      res.json({
        success: true,
        data: question
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await questionService.deleteQuestion(id);
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getQuestionsStats(req: Request, res: Response) {
    try {
      const stats = await questionService.getQuestionsStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
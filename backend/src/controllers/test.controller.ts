import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { AIService } from '../services/ai.service';
import { Question } from '../entities/Question';
import { AuthRequest } from '../middleware/auth.middleware';

const aiService = new AIService();

export class TestController {
  async testAI(req: AuthRequest, res: Response) {
    try {
      const { questionId, answer } = req.body;
      
      if (!questionId || !answer) {
        return res.status(400).json({
          success: false,
          message: 'questionId and answer are required'
        });
      }
      
      const questionRepository = AppDataSource.getRepository(Question);
      const question = await questionRepository.findOne({
        where: { id: questionId },
        relations: ['subject']
      });
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      const evaluation = await aiService.evaluateAnswer(question, answer);
      
      res.json({
        success: true,
        data: {
          question: {
            id: question.id,
            text: question.text,
            subject: question.subject.name,
            difficulty: question.difficulty
          },
          userAnswer: answer,
          evaluation
        }
      });
      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async testRecommendations(req: AuthRequest, res: Response) {
    try {
      const { answers } = req.body;
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'answers array is required'
        });
      }
      
      const recommendations = await aiService.generateRecommendations(answers);
      
      res.json({
        success: true,
        data: { recommendations }
      });
      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
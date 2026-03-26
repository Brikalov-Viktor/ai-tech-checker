import { Request, Response } from 'express';
import { InterviewService } from '../services/interview.service';
import { AuthRequest } from '../middleware/auth.middleware';

const interviewService = new InterviewService();

export class InterviewController {
  async startInterview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const result = await interviewService.startInterview(userId, req.body);
      res.status(201).json({
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

  async submitAnswer(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { interviewId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const result = await interviewService.submitAnswer(
        userId,
        interviewId,
        req.body
      );
      
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

  async completeInterview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { interviewId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const result = await interviewService.completeInterview(userId, interviewId);
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

  async getUserInterviews(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { period } = req.query;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const interviews = await interviewService.getUserInterviews(
        userId,
        period as string
      );
      
      res.json({
        success: true,
        data: interviews
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getInterviewDetails(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { interviewId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const details = await interviewService.getInterviewDetails(userId, interviewId);
      res.json({
        success: true,
        data: details
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getInterviewStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }

      const stats = await interviewService.getInterviewStats(userId);
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
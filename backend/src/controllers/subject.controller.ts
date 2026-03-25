import { Request, Response } from 'express';
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from '../dtos/subject.dto';

const subjectService = new SubjectService();

export class SubjectController {
  async getAllSubjects(req: Request, res: Response) {
    try {
      const subjects = await subjectService.getAllSubjects();
      res.json({
        success: true,
        data: subjects
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSubjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const subject = await subjectService.getSubjectById(id);
      res.json({
        success: true,
        data: subject
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createSubject(req: Request, res: Response) {
    try {
      const data: CreateSubjectDto = req.body;
      
      if (!data.name) {
        return res.status(400).json({
          success: false,
          message: 'Название темы обязательно'
        });
      }

      const subject = await subjectService.createSubject(data);
      res.status(201).json({
        success: true,
        data: subject
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateSubject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateSubjectDto = req.body;
      
      const subject = await subjectService.updateSubject(id, data);
      res.json({
        success: true,
        data: subject
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteSubject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await subjectService.deleteSubject(id);
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
}
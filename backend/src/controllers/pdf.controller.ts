import { Request, Response } from 'express';
import { PDFService } from '../services/pdf.service';
import { AuthRequest } from '../middleware/auth.middleware';

const pdfService = new PDFService();

export class PDFController {
  async downloadRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { interviewId } = req.params;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Не авторизован'
        });
      }
      
      const pdfBuffer = await pdfService.generateRecommendationsPDF(userId, interviewId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=recommendations_${interviewId}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
      
    } catch (error: any) {
      console.error('PDF generation error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Ошибка при генерации PDF'
      });
    }
  }
}
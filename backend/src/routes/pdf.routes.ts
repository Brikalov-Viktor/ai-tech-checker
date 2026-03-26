import { Router } from 'express';
import { PDFController } from '../controllers/pdf.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const pdfController = new PDFController();

// Все маршруты требуют авторизации
router.use(authMiddleware);

// GET /api/pdf/interviews/:interviewId/pdf
router.get('/interviews/:interviewId/pdf', pdfController.downloadRecommendations.bind(pdfController));

export default router;
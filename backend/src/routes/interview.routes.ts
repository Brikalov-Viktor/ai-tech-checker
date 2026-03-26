import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const interviewController = new InterviewController();

// Все маршруты требуют авторизации
router.use(authMiddleware);

router.post('/start', interviewController.startInterview.bind(interviewController));
router.post('/:interviewId/answer', interviewController.submitAnswer.bind(interviewController));
router.post('/:interviewId/complete', interviewController.completeInterview.bind(interviewController));
router.get('/', interviewController.getUserInterviews.bind(interviewController));
router.get('/stats', interviewController.getInterviewStats.bind(interviewController));
router.get('/:interviewId', interviewController.getInterviewDetails.bind(interviewController));

export default router;
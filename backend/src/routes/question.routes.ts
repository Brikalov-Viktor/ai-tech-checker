import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();
const questionController = new QuestionController();

// Публичные маршруты (доступны всем авторизованным)
router.get('/', authMiddleware, questionController.getAllQuestions.bind(questionController));
router.get('/random', authMiddleware, questionController.getRandomQuestions.bind(questionController));
router.get('/stats', authMiddleware, questionController.getQuestionsStats.bind(questionController));
router.get('/subject/:subjectId', authMiddleware, questionController.getQuestionsBySubject.bind(questionController));
router.get('/:id', authMiddleware, questionController.getQuestionById.bind(questionController));

// Админские маршруты
router.post('/', authMiddleware, adminMiddleware, questionController.createQuestion.bind(questionController));
router.put('/:id', authMiddleware, adminMiddleware, questionController.updateQuestion.bind(questionController));
router.delete('/:id', authMiddleware, adminMiddleware, questionController.deleteQuestion.bind(questionController));

export default router;
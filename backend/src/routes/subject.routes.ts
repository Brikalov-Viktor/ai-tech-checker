import { Router } from 'express';
import { SubjectController } from '../controllers/subject.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();
const subjectController = new SubjectController();

// Публичные маршруты (доступны всем авторизованным)
router.get('/', authMiddleware, subjectController.getAllSubjects.bind(subjectController));
router.get('/:id', authMiddleware, subjectController.getSubjectById.bind(subjectController));

// Админские маршруты
router.post('/', authMiddleware, adminMiddleware, subjectController.createSubject.bind(subjectController));
router.put('/:id', authMiddleware, adminMiddleware, subjectController.updateSubject.bind(subjectController));
router.delete('/:id', authMiddleware, adminMiddleware, subjectController.deleteSubject.bind(subjectController));

export default router;
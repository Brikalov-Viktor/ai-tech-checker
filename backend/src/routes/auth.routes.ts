import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Публичные маршруты
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Защищенные маршруты
router.get('/me', authMiddleware, authController.getMe.bind(authController));
router.post('/change-password', authMiddleware, authController.changePassword.bind(authController));

// Админские маршруты
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers.bind(authController));

export default router;
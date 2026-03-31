import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const testController = new TestController();

router.use(authMiddleware);
router.post('/ai/evaluate', testController.testAI.bind(testController));
router.post('/ai/recommendations', testController.testRecommendations.bind(testController));

export default router;
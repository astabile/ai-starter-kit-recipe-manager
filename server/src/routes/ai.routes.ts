import { Router } from 'express';
import { classifyRecipe } from '../controllers/ai.controller';

const router = Router();

router.route('/classify').post(classifyRecipe);

export default router;

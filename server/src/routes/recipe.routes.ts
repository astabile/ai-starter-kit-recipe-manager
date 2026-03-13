import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller';

const router = Router();

router.route('/').get(getAllRecipes).post(createRecipe);

router.route('/:id').get(getRecipeById).put(updateRecipe).delete(deleteRecipe);

export default router;

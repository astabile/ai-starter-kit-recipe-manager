import type { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service';

export const classifyRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, ingredients, instructions } = req.body;

    if (!name || !ingredients || !instructions) {
      res.status(400);
      throw new Error('Recipe name, ingredients, and instructions are required');
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400);
      throw new Error('Ingredients must be a non-empty array');
    }

    if (typeof instructions !== 'string' || instructions.length < 10) {
      res.status(400);
      throw new Error('Instructions must be a string with at least 10 characters');
    }

    const classification = await aiService.classifyRecipe({
      name,
      ingredients,
      instructions,
    });

    res.status(200).json({
      success: true,
      data: classification,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

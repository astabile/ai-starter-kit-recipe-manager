import type { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipe.service';

export const getAllRecipes = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const recipe = await recipeService.getRecipeById(id);
    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const recipe = await recipeService.updateRecipe(id, req.body);
    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await recipeService.deleteRecipe(id);
    res.status(200).json({
      success: true,
      data: { message: 'Recipe deleted successfully' },
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

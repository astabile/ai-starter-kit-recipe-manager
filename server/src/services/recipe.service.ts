import { Recipe, IRecipe } from '../models/recipe.model';

export interface RecipeInput {
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}

export const getAllRecipes = async (): Promise<IRecipe[]> => {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    throw new Error(`Error fetching recipes: ${error}`);
  }
};

export const getRecipeById = async (id: string): Promise<IRecipe> => {
  try {
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
    
    return recipe;
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    throw error;
  }
};

export const createRecipe = async (data: RecipeInput): Promise<IRecipe> => {
  try {
    const recipe = new Recipe(data);
    await recipe.save();
    return recipe;
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    throw error;
  }
};

export const updateRecipe = async (
  id: string,
  data: Partial<RecipeInput>
): Promise<IRecipe> => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
    
    return recipe;
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    throw error;
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndDelete(id);
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    throw error;
  }
};

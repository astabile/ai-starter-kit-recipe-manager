import apiClient from './api';
import type { Recipe, RecipeInput, AIClassification, ApiResponse } from '../types/recipe';

export const recipeApi = {
  getRecipes: async (): Promise<Recipe[]> => {
    const response = await apiClient.get<ApiResponse<Recipe[]>>('/recipes');
    return response.data.data || [];
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`);
    if (!response.data.data) {
      throw new Error('Recipe not found');
    }
    return response.data.data;
  },

  createRecipe: async (data: RecipeInput): Promise<Recipe> => {
    const response = await apiClient.post<ApiResponse<Recipe>>('/recipes', data);
    if (!response.data.data) {
      throw new Error('Failed to create recipe');
    }
    return response.data.data;
  },

  updateRecipe: async (id: string, data: Partial<RecipeInput>): Promise<Recipe> => {
    const response = await apiClient.put<ApiResponse<Recipe>>(`/recipes/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update recipe');
    }
    return response.data.data;
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipes/${id}`);
  },

  classifyRecipe: async (data: {
    name: string;
    ingredients: string[];
    instructions: string;
  }): Promise<AIClassification> => {
    const response = await apiClient.post<ApiResponse<AIClassification>>('/ai/classify', data);
    if (!response.data.data) {
      throw new Error('Failed to classify recipe');
    }
    return response.data.data;
  },
};

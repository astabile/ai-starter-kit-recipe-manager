export interface Recipe {
  _id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface AIClassification {
  suggestedCuisine: string;
  suggestedDifficulty: 'easy' | 'medium' | 'hard';
  reasoning: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

import { Schema, model, Document } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [3, 'Recipe name must be at least 3 characters'],
      maxlength: [200, 'Recipe name must not exceed 200 characters'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (arr: string[]) {
          return arr && arr.length > 0;
        },
        message: 'At least one ingredient is required',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      minlength: [50, 'Instructions must be at least 50 characters'],
      maxlength: [5000, 'Instructions must not exceed 5000 characters'],
    },
    cuisine: {
      type: String,
      default: 'Other',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard',
      },
      default: 'medium',
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = model<IRecipe>('Recipe', recipeSchema);

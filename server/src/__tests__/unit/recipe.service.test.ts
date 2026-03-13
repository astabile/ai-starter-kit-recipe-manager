import * as recipeService from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

describe('Recipe Service', () => {
  const validRecipeData = {
    name: 'Test Recipe',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions:
      'This is a test recipe with at least 50 characters in the instructions to pass validation.',
    cuisine: 'Italian',
    difficulty: 'easy' as const,
    prepTime: 15,
    cookTime: 30,
    servings: 4,
  };

  describe('createRecipe', () => {
    it('should create a recipe successfully', async () => {
      const recipe = await recipeService.createRecipe(validRecipeData);

      expect(recipe).toBeDefined();
      expect(recipe.name).toBe(validRecipeData.name);
      expect(recipe.ingredients).toEqual(validRecipeData.ingredients);
      expect(recipe.cuisine).toBe(validRecipeData.cuisine);
      expect(recipe.difficulty).toBe(validRecipeData.difficulty);
    });

    it('should throw validation error for name too short', async () => {
      const invalidData = { ...validRecipeData, name: 'AB' };

      await expect(recipeService.createRecipe(invalidData)).rejects.toThrow();
    });

    it('should throw validation error for empty ingredients', async () => {
      const invalidData = { ...validRecipeData, ingredients: [] };

      await expect(recipeService.createRecipe(invalidData)).rejects.toThrow();
    });

    it('should throw validation error for instructions too short', async () => {
      const invalidData = { ...validRecipeData, instructions: 'Too short' };

      await expect(recipeService.createRecipe(invalidData)).rejects.toThrow();
    });

    it('should throw validation error for servings less than 1', async () => {
      const invalidData = { ...validRecipeData, servings: 0 };

      await expect(recipeService.createRecipe(invalidData)).rejects.toThrow();
    });

    it('should use default values for optional fields', async () => {
      const minimalData = {
        name: 'Minimal Recipe',
        ingredients: ['Ingredient 1'],
        instructions:
          'This is a minimal recipe with at least 50 characters in the instructions.',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
      };

      const recipe = await recipeService.createRecipe(minimalData);

      expect(recipe.cuisine).toBe('Other');
      expect(recipe.difficulty).toBe('medium');
    });
  });

  describe('getAllRecipes', () => {
    it('should return empty array when no recipes exist', async () => {
      const recipes = await recipeService.getAllRecipes();

      expect(recipes).toEqual([]);
    });

    it('should return all recipes', async () => {
      await recipeService.createRecipe(validRecipeData);
      await recipeService.createRecipe({
        ...validRecipeData,
        name: 'Another Recipe',
      });

      const recipes = await recipeService.getAllRecipes();

      expect(recipes).toHaveLength(2);
      expect(recipes[0].name).toBe('Test Recipe');
      expect(recipes[1].name).toBe('Another Recipe');
    });
  });

  describe('getRecipeById', () => {
    it('should return recipe by id', async () => {
      const created = await recipeService.createRecipe(validRecipeData);
      const found = await recipeService.getRecipeById(created._id.toString());

      expect(found).toBeDefined();
      expect(found.name).toBe(validRecipeData.name);
      expect(found._id.toString()).toBe(created._id.toString());
    });

    it('should throw 404 error for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(recipeService.getRecipeById(fakeId)).rejects.toThrow('Recipe not found');
    });

    it('should throw 400 error for invalid id format', async () => {
      await expect(recipeService.getRecipeById('invalid-id')).rejects.toThrow(
        'Invalid recipe ID'
      );
    });
  });

  describe('updateRecipe', () => {
    it('should update recipe successfully', async () => {
      const created = await recipeService.createRecipe(validRecipeData);
      const updated = await recipeService.updateRecipe(created._id.toString(), {
        name: 'Updated Recipe Name',
        difficulty: 'hard',
      });

      expect(updated.name).toBe('Updated Recipe Name');
      expect(updated.difficulty).toBe('hard');
      expect(updated.ingredients).toEqual(validRecipeData.ingredients);
    });

    it('should throw 404 error for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(
        recipeService.updateRecipe(fakeId, { name: 'Updated' })
      ).rejects.toThrow('Recipe not found');
    });

    it('should validate updated fields', async () => {
      const created = await recipeService.createRecipe(validRecipeData);

      await expect(
        recipeService.updateRecipe(created._id.toString(), { name: 'AB' })
      ).rejects.toThrow();
    });

    it('should throw 400 error for invalid id format', async () => {
      await expect(recipeService.updateRecipe('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Invalid recipe ID'
      );
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      const created = await recipeService.createRecipe(validRecipeData);

      await recipeService.deleteRecipe(created._id.toString());

      const recipes = await Recipe.find();
      expect(recipes).toHaveLength(0);
    });

    it('should throw 404 error for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await expect(recipeService.deleteRecipe(fakeId)).rejects.toThrow('Recipe not found');
    });

    it('should throw 400 error for invalid id format', async () => {
      await expect(recipeService.deleteRecipe('invalid-id')).rejects.toThrow(
        'Invalid recipe ID'
      );
    });
  });
});

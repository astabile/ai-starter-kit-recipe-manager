import request from 'supertest';
import express, { Application } from 'express';
import recipeRoutes from '../../routes/recipe.routes';
import { errorHandler } from '../../middleware/errorHandler';

const app: Application = express();
app.use(express.json());
app.use('/api/recipes', recipeRoutes);
app.use(errorHandler);

describe('Recipe API Integration Tests', () => {
  const validRecipe = {
    name: 'Integration Test Recipe',
    ingredients: ['Test Ingredient 1', 'Test Ingredient 2'],
    instructions:
      'This is a detailed test recipe with sufficient instructions to meet the minimum character requirement for validation.',
    cuisine: 'Test Cuisine',
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 40,
    servings: 6,
  };

  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .send(validRecipe)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(validRecipe.name);
      expect(response.body.data._id).toBeDefined();
    });

    it('should return 400 for invalid recipe data', async () => {
      const invalidRecipe = {
        name: 'AB',
        ingredients: [],
        instructions: 'Too short',
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(invalidRecipe)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/recipes', () => {
    it('should return empty array when no recipes exist', async () => {
      const response = await request(app).get('/api/recipes').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all recipes', async () => {
      await request(app).post('/api/recipes').send(validRecipe);
      await request(app).post('/api/recipes').send({
        ...validRecipe,
        name: 'Second Recipe',
      });

      const response = await request(app).get('/api/recipes').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should return recipe by id', async () => {
      const createResponse = await request(app).post('/api/recipes').send(validRecipe);
      const recipeId = createResponse.body.data._id;

      const response = await request(app).get(`/api/recipes/${recipeId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(recipeId);
      expect(response.body.data.name).toBe(validRecipe.name);
    });

    it('should return 404 for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app).get(`/api/recipes/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Recipe not found');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/recipes/invalid-id').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid recipe ID');
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('should update recipe successfully', async () => {
      const createResponse = await request(app).post('/api/recipes').send(validRecipe);
      const recipeId = createResponse.body.data._id;

      const updateData = {
        name: 'Updated Recipe Name',
        difficulty: 'hard',
      };

      const response = await request(app)
        .put(`/api/recipes/${recipeId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Recipe Name');
      expect(response.body.data.difficulty).toBe('hard');
      expect(response.body.data.ingredients).toEqual(validRecipe.ingredients);
    });

    it('should return 404 for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/recipes/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Recipe not found');
    });

    it('should validate updated fields', async () => {
      const createResponse = await request(app).post('/api/recipes').send(validRecipe);
      const recipeId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/recipes/${recipeId}`)
        .send({ name: 'AB' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete recipe successfully', async () => {
      const createResponse = await request(app).post('/api/recipes').send(validRecipe);
      const recipeId = createResponse.body.data._id;

      const response = await request(app).delete(`/api/recipes/${recipeId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Recipe deleted successfully');

      await request(app).get(`/api/recipes/${recipeId}`).expect(404);
    });

    it('should return 404 for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app).delete(`/api/recipes/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Recipe not found');
    });
  });
});

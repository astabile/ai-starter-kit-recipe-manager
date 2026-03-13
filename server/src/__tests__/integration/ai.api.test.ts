import request from 'supertest';
import express, { Application } from 'express';
import aiRoutes from '../../routes/ai.routes';
import { errorHandler } from '../../middleware/errorHandler';
import * as aiService from '../../services/ai.service';

jest.mock('../../services/ai.service');

const app: Application = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);
app.use(errorHandler);

describe('AI API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validInput = {
    name: 'Test Recipe',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: 'Test instructions for the recipe.',
  };

  describe('POST /api/ai/classify', () => {
    it('should classify recipe successfully', async () => {
      const mockResult = {
        suggestedCuisine: 'Italian',
        suggestedDifficulty: 'easy' as const,
        reasoning: 'Italian ingredients and simple techniques',
      };

      (aiService.classifyRecipe as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/ai/classify')
        .send(validInput)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
      expect(aiService.classifyRecipe).toHaveBeenCalledWith(validInput);
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          ingredients: ['Ingredient 1'],
          instructions: 'Test instructions',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 when ingredients is missing', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          name: 'Test',
          instructions: 'Test instructions',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 when instructions is missing', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          name: 'Test',
          ingredients: ['Ingredient 1'],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 when ingredients is not an array', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          name: 'Test',
          ingredients: 'not an array',
          instructions: 'Test instructions',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('array');
    });

    it('should return 400 when ingredients is empty array', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          name: 'Test',
          ingredients: [],
          instructions: 'Test instructions',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('array');
    });

    it('should return 400 when instructions is too short', async () => {
      const response = await request(app)
        .post('/api/ai/classify')
        .send({
          name: 'Test',
          ingredients: ['Ingredient 1'],
          instructions: 'Short',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('10 characters');
    });

    it('should handle service errors', async () => {
      (aiService.classifyRecipe as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const response = await request(app)
        .post('/api/ai/classify')
        .send(validInput)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Service error');
    });
  });
});

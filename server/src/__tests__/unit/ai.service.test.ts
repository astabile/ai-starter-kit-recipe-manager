import * as aiService from '../../services/ai.service';
import OpenAI from 'openai';

jest.mock('openai');

const mockCreate = jest.fn();

beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-api-key';
});

beforeEach(() => {
  jest.clearAllMocks();
  (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    } as any;
  });
});

describe('AI Service', () => {
  const validInput = {
    name: 'Margherita Pizza',
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Basil'],
    instructions:
      'Preheat oven. Roll dough. Add sauce and cheese. Bake for 12 minutes. Top with basil.',
  };

  describe('classifyRecipe', () => {
    it('should classify recipe successfully', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                suggestedCuisine: 'Italian',
                suggestedDifficulty: 'easy',
                reasoning: 'Classic Italian pizza with simple preparation.',
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      const result = await aiService.classifyRecipe(validInput);

      expect(result).toBeDefined();
      expect(result.suggestedCuisine).toBe('Italian');
      expect(result.suggestedDifficulty).toBe('easy');
      expect(result.reasoning).toBeDefined();
    });

    it('should use correct OpenAI parameters', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                suggestedCuisine: 'Italian',
                suggestedDifficulty: 'easy',
                reasoning: 'Test',
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      await aiService.classifyRecipe(validInput);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          response_format: { type: 'json_object' },
        })
      );
    });

    it('should throw error when OpenAI returns no content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(aiService.classifyRecipe(validInput)).rejects.toThrow(
        'No response from OpenAI'
      );
    });

    it('should throw error for invalid JSON response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Invalid JSON',
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(aiService.classifyRecipe(validInput)).rejects.toThrow();
    });

    it('should throw error for incomplete classification response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                suggestedCuisine: 'Italian',
              }),
            },
          },
        ],
      };

      mockCreate.mockResolvedValue(mockResponse);

      await expect(aiService.classifyRecipe(validInput)).rejects.toThrow(
        'Invalid classification response format'
      );
    });

    it('should handle OpenAI API errors', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      await expect(aiService.classifyRecipe(validInput)).rejects.toThrow(
        'Classification failed'
      );
    });
  });
});

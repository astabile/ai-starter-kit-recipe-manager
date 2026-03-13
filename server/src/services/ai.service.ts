import OpenAI from 'openai';

let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export interface ClassificationInput {
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface ClassificationResult {
  suggestedCuisine: string;
  suggestedDifficulty: 'easy' | 'medium' | 'hard';
  reasoning: string;
}

const CUISINE_CATEGORIES = [
  'Italian',
  'Mexican',
  'Asian',
  'French',
  'American',
  'Mediterranean',
  'Indian',
  'Other',
];

export const classifyRecipe = async (
  input: ClassificationInput
): Promise<ClassificationResult> => {
  const { name, ingredients, instructions } = input;

  const prompt = `Analyze this recipe and classify it:

Recipe Name: ${name}

Ingredients:
${ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}

Instructions:
${instructions}

Based on this recipe, provide:
1. Cuisine type (choose from: ${CUISINE_CATEGORIES.join(', ')})
2. Difficulty level based on these criteria:
   - Easy: Simple techniques, common ingredients, < 30 min total time
   - Medium: Moderate techniques, 30-60 min total time
   - Hard: Advanced techniques, special equipment, > 60 min total time
3. Brief reasoning for your classification

Respond in JSON format:
{
  "suggestedCuisine": "cuisine type",
  "suggestedDifficulty": "easy|medium|hard",
  "reasoning": "brief explanation"
}`;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a culinary expert that classifies recipes by cuisine and difficulty. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const classification = JSON.parse(content) as ClassificationResult;

    if (
      !classification.suggestedCuisine ||
      !classification.suggestedDifficulty ||
      !classification.reasoning
    ) {
      throw new Error('Invalid classification response format');
    }

    return classification;
  } catch (error: any) {
    if (error.message?.includes('API key')) {
      const apiError: any = new Error('OpenAI API key not configured');
      apiError.statusCode = 500;
      throw apiError;
    }
    throw new Error(`Classification failed: ${error.message}`);
  }
};

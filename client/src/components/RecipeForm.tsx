import React, { useState } from 'react';
import type { Recipe, RecipeInput, AIClassification } from '../types/recipe';
import { recipeApi } from '../services/recipeApi';
import { AIButton } from './AIButton';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: RecipeInput) => Promise<void>;
  onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RecipeInput>({
    name: recipe?.name || '',
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions || '',
    cuisine: recipe?.cuisine || 'Other',
    difficulty: recipe?.difficulty || 'medium',
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    servings: recipe?.servings || 1,
    imageUrl: recipe?.imageUrl || '',
  });

  const [aiClassification, setAiClassification] = useState<AIClassification | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAIClassify = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      const classification = await recipeApi.classifyRecipe({
        name: formData.name,
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ''),
        instructions: formData.instructions,
      });
      setAiClassification(classification);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI classification failed');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAISuggestion = (field: 'cuisine' | 'difficulty', value: string) => {
    setFormData({ ...formData, [field]: value });
    setAiClassification(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          minLength={3}
          maxLength={200}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="e.g., Spaghetti Carbonara"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={`Ingredient ${index + 1}`}
            />
            {formData.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
        >
          + Add Ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          required
          minLength={50}
          maxLength={5000}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Detailed cooking instructions (minimum 50 characters)..."
        />
        <p className="text-sm text-gray-500 mt-1">{formData.instructions.length} / 5000 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <select
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="French">French</option>
            <option value="American">American</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
          <input
            type="number"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
            required
            min={0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min)</label>
          <input
            type="number"
            value={formData.cookTime}
            onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
            required
            min={0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
          <input
            type="number"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
            required
            min={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="border-t pt-6">
        <AIButton
          onClick={handleAIClassify}
          loading={aiLoading}
          disabled={!formData.name || formData.ingredients.filter((i) => i.trim()).length === 0 || !formData.instructions}
        />
        {aiError && (
          <p className="mt-2 text-sm text-red-600">{aiError}</p>
        )}
      </div>

      {aiClassification && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-purple-900">AI Suggestions</h3>
          <p className="text-sm text-gray-600">{aiClassification.reasoning}</p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Suggested Cuisine:</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-medium text-purple-700">{aiClassification.suggestedCuisine}</span>
                <button
                  type="button"
                  onClick={() => applyAISuggestion('cuisine', aiClassification.suggestedCuisine)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Apply
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Suggested Difficulty:</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-medium text-purple-700 capitalize">{aiClassification.suggestedDifficulty}</span>
                <button
                  type="button"
                  onClick={() => applyAISuggestion('difficulty', aiClassification.suggestedDifficulty)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {recipe ? 'Update Recipe' : 'Create Recipe'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

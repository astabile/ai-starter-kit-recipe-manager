import { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/recipeApi';
import type { Recipe, RecipeInput } from '../types/recipe';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeApi.getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const createRecipe = useCallback(async (data: RecipeInput): Promise<Recipe | null> => {
    try {
      setLoading(true);
      setError(null);
      const newRecipe = await recipeApi.createRecipe(data);
      setRecipes((prev) => [...prev, newRecipe]);
      return newRecipe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecipe = useCallback(
    async (id: string, data: Partial<RecipeInput>): Promise<Recipe | null> => {
      try {
        setLoading(true);
        setError(null);
        const updated = await recipeApi.updateRecipe(id, data);
        setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update recipe');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await recipeApi.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRecipes = useCallback(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes,
  };
};

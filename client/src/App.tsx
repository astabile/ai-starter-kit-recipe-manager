import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import { RecipeList } from './components/RecipeList';
import { RecipeForm } from './components/RecipeForm';
import type { Recipe, RecipeInput } from './types/recipe';

function App() {
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();

  const handleCreate = () => {
    setEditingRecipe(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: RecipeInput) => {
    if (editingRecipe) {
      await updateRecipe(editingRecipe._id, data);
    } else {
      await createRecipe(data);
    }
    setIsModalOpen(false);
    setEditingRecipe(undefined);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(id);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecipe(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🍳 Recipe Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your recipes with AI-powered classification
          </p>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            + Create New Recipe
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {loading && recipes.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
          </div>
        ) : (
          <RecipeList recipes={recipes} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}
              </h2>
            </div>
            <div className="p-6">
              <RecipeForm
                recipe={editingRecipe}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

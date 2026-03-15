import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RecipeForm } from '../../components/RecipeForm';
import { recipeApi } from '../../services/recipeApi';
import type { Recipe } from '../../types/recipe';

vi.mock('../../services/recipeApi');

const mockRecipe: Recipe = {
  _id: '1',
  name: 'Test Recipe',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: 'Test instructions with sufficient length for validation',
  cuisine: 'Italian',
  difficulty: 'medium',
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  imageUrl: 'https://example.com/image.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('RecipeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ingredients/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cuisine/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prep time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cook time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
  });

  it('populates form with recipe data when editing', () => {
    render(<RecipeForm recipe={mockRecipe} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ingredient 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ingredient 2')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Test instructions/)).toBeInTheDocument();
  });

  it('validates required name field', async () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const nameInput = screen.getByLabelText(/recipe name/i);
    expect(nameInput).toBeRequired();
    expect(nameInput).toHaveAttribute('minLength', '3');
    expect(nameInput).toHaveAttribute('maxLength', '200');
  });

  it('validates instructions length', () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const instructionsField = screen.getByLabelText(/instructions/i);
    expect(instructionsField).toBeRequired();
    expect(instructionsField).toHaveAttribute('minLength', '50');
    expect(instructionsField).toHaveAttribute('maxLength', '5000');
  });

  it('shows character count for instructions', () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByText(/0 \/ 5000 characters/)).toBeInTheDocument();
  });

  it('adds ingredient field when Add Ingredient is clicked', async () => {
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const initialInputs = screen.getAllByPlaceholderText(/Ingredient \d/);
    expect(initialInputs).toHaveLength(1);
    
    await user.click(screen.getByText('+ Add Ingredient'));
    
    const updatedInputs = screen.getAllByPlaceholderText(/Ingredient \d/);
    expect(updatedInputs).toHaveLength(2);
  });

  it('removes ingredient when remove button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<RecipeForm recipe={mockRecipe} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const initialInputs = screen.getAllByPlaceholderText(/Ingredient \d/);
    expect(initialInputs).toHaveLength(2);
    
    const removeButtons = screen.getAllByText('✕');
    await user.click(removeButtons[0]);
    
    const updatedInputs = screen.getAllByPlaceholderText(/Ingredient \d/);
    expect(updatedInputs).toHaveLength(1);
  });

  it('calls AI classification when button is clicked', async () => {
    const mockClassification = {
      suggestedCuisine: 'Italian',
      suggestedDifficulty: 'easy' as const,
      reasoning: 'Test reasoning',
    };
    
    vi.mocked(recipeApi.classifyRecipe).mockResolvedValue(mockClassification);
    
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/recipe name/i), 'Pizza');
    await user.type(screen.getByPlaceholderText(/Ingredient 1/), 'Dough');
    await user.type(screen.getByLabelText(/instructions/i), 'Make pizza with proper instructions length here for validation');
    
    await user.click(screen.getByText('Get AI Classification'));
    
    await waitFor(() => {
      expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText('Test reasoning')).toBeInTheDocument();
  });

  it('applies AI cuisine suggestion when Apply is clicked', async () => {
    const mockClassification = {
      suggestedCuisine: 'French',
      suggestedDifficulty: 'hard' as const,
      reasoning: 'Test',
    };
    
    vi.mocked(recipeApi.classifyRecipe).mockResolvedValue(mockClassification);
    
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/recipe name/i), 'Test');
    await user.type(screen.getByPlaceholderText(/Ingredient 1/), 'Test');
    await user.type(screen.getByLabelText(/instructions/i), 'Instructions with enough characters for validation to pass');
    
    await user.click(screen.getByText('Get AI Classification'));
    
    await waitFor(() => {
      expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
    });
    
    const applyButtons = screen.getAllByText('Apply');
    await user.click(applyButtons[0]);
    
    const cuisineSelect = screen.getByLabelText(/cuisine/i);
    expect(cuisineSelect).toHaveValue('French');
  });

  it('disables AI button when form is incomplete', () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    const aiButton = screen.getByText('Get AI Classification').closest('button');
    expect(aiButton).toBeDisabled();
  });

  it('calls onSubmit with form data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/recipe name/i), 'New Recipe');
    await user.type(screen.getByPlaceholderText(/Ingredient 1/), 'Flour');
    await user.type(screen.getByLabelText(/instructions/i), 'Mix ingredients and cook for delicious results with proper length');
    await user.type(screen.getByLabelText(/prep time/i), '10');
    await user.type(screen.getByLabelText(/cook time/i), '20');
    await user.type(screen.getByLabelText(/servings/i), '4');
    
    await user.click(screen.getByText(/create recipe/i));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={vi.fn()} onCancel={onCancel} />);
    
    await user.click(screen.getByText('Cancel'));
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Update Recipe button when editing', () => {
    render(<RecipeForm recipe={mockRecipe} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByText('Update Recipe')).toBeInTheDocument();
  });

  it('shows Create Recipe button when creating', () => {
    render(<RecipeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByText('Create Recipe')).toBeInTheDocument();
  });
});

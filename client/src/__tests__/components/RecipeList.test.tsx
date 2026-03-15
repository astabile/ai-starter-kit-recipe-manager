import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RecipeList } from '../../components/RecipeList';
import type { Recipe } from '../../types/recipe';

const mockRecipes: Recipe[] = [
  {
    _id: '1',
    name: 'Test Recipe 1',
    ingredients: ['Ingredient 1'],
    instructions: 'Test instructions that are long enough to meet validation',
    cuisine: 'Italian',
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Test Recipe 2',
    ingredients: ['Ingredient 2'],
    instructions: 'Another test with sufficient length for validation requirements',
    cuisine: 'Mexican',
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '3',
    name: 'Test Recipe 3',
    ingredients: ['Ingredient 3'],
    instructions: 'Hard recipe instructions meeting minimum character count needed',
    cuisine: 'French',
    difficulty: 'hard',
    prepTime: 30,
    cookTime: 60,
    servings: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('RecipeList', () => {
  it('renders empty state when no recipes', () => {
    render(<RecipeList recipes={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    expect(screen.getByText('No recipes yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first recipe!')).toBeInTheDocument();
  });

  it('renders all recipes', () => {
    render(<RecipeList recipes={mockRecipes} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 3')).toBeInTheDocument();
  });

  it('displays correct difficulty colors', () => {
    const { container } = render(<RecipeList recipes={mockRecipes} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    const easyBadge = container.querySelector('.bg-green-100');
    const mediumBadge = container.querySelector('.bg-yellow-100');
    const hardBadge = container.querySelector('.bg-red-100');
    
    expect(easyBadge).toBeInTheDocument();
    expect(mediumBadge).toBeInTheDocument();
    expect(hardBadge).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    
    render(<RecipeList recipes={[mockRecipes[0]]} onEdit={onEdit} onDelete={vi.fn()} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockRecipes[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    
    render(<RecipeList recipes={[mockRecipes[0]]} onEdit={vi.fn()} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('displays recipe details correctly', () => {
    render(<RecipeList recipes={[mockRecipes[0]]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText(/Prep: 10m/)).toBeInTheDocument();
    expect(screen.getByText(/Cook: 20m/)).toBeInTheDocument();
    expect(screen.getByText(/Total: 30m/)).toBeInTheDocument();
  });

  it('renders in grid layout', () => {
    const { container } = render(<RecipeList recipes={mockRecipes} onEdit={vi.fn()} onDelete={vi.fn()} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});

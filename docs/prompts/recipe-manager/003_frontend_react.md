# Frontend React Implementation

## Context
Building React frontend for recipe management with modern UI and AI-powered classification.

## Goal
Create production-quality React frontend with Tailwind CSS and AI features.

---

## The Prompt

### API Service Layer (`src/services/api.ts`)
Typed client: getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, classifyRecipe

### Custom Hook (`src/hooks/useRecipes.ts`)
State management: recipes[], loading, error, CRUD methods

### Components

**RecipeList** (`src/components/RecipeList.tsx`):
- Grid of recipe cards
- Show: name, cuisine badge, difficulty badge, prep/cook time
- Click to view details
- Delete button

**RecipeForm** (`src/components/RecipeForm.tsx`):
- Name, ingredients (array input), instructions
- Cuisine, difficulty, times, servings dropdowns
- "Get AI Classification" button (purple)
- Display AI suggestions with Apply buttons
- Form validation

**AIButton** (`src/components/AIButton.tsx`):
- Purple gradient, loading spinner, sparkle icon

**App Component** (`src/App.tsx`):
- useRecipes() hook
- Modal for create/edit
- Error/loading states

### Design
- Orange/green theme (food colors)
- Difficulty badges: easy=green, medium=yellow, hard=red
- Responsive design (Tailwind)

---

## Key Takeaway
Clean component architecture: Components → Hooks → Services.
# Backend CRUD Implementation

## Context
Building REST API for recipe management with proper validation and error handling using Express.js and MongoDB.

## Goal
Create complete backend CRUD API for recipes following Clean Architecture.

---

## The Prompt

Create recipe management backend API:

**Recipe Model** (`src/models/Recipe.ts`):
- name (string, required, 3-200 chars)
- ingredients (array of strings, required, min 1 item)
- instructions (string, required, 50-5000 chars)
- cuisine (string, default 'Other')
- difficulty (enum: easy, medium, hard, default 'medium')
- prepTime (number, minutes, required)
- cookTime (number, minutes, required)
- servings (number, required, min 1)
- imageUrl (string, optional)
- createdAt, updatedAt (timestamps)

**Service Layer** (`src/services/recipeService.ts`):
- getAllRecipes()
- getRecipeById(id)
- createRecipe(data)
- updateRecipe(id, data)
- deleteRecipe(id)

**Controller** (`src/controllers/recipeController.ts`):
- HTTP handlers with proper status codes
- JSON responses: {success, data?, error?}

**Routes** (`src/routes/recipeRoutes.ts`):
- GET /api/recipes
- GET /api/recipes/:id
- POST /api/recipes
- PUT /api/recipes/:id
- DELETE /api/recipes/:id

---

## Key Takeaway
Clean Architecture with validation at model level ensures data consistency.
# Testing Implementation

## Context
Comprehensive testing validates Recipe Manager works correctly in all scenarios.

## Goal
Implement Jest (backend) and Vitest (frontend) with full test coverage.

---

## The Prompt

### Backend Testing

**recipeService.test.ts:**
- getAllRecipes (empty, sorted, structure)
- getRecipeById (found, not found, invalid ID)
- createRecipe (valid, missing fields, validation)
- updateRecipe (partial, not found, invalid data)
- deleteRecipe (success, not found)

**aiService.test.ts:**
- Mock OpenAI
- classifyRecipe (valid response, error handling)
- Rate limits, auth errors, invalid JSON

**recipeController.test.ts:**
- Supertest for all endpoints
- Status codes (200, 201, 204, 400, 404, 500)
- Response structure validation

### Frontend Testing

**RecipeList.test.tsx:**
- Renders recipes, empty state
- Difficulty colors correct
- Click handlers work

**RecipeForm.test.tsx:**
- Form validation (name, ingredients, instructions)
- AI classification flow
- Apply suggestions buttons

**AIButton.test.tsx:**
- Loading states, disabled states

### Configuration
- Jest with mongodb-memory-server
- Vitest with jsdom
- Mock axios and OpenAI
- 70% coverage threshold

---

## Key Takeaway
Test error cases that AI skips. Testing proves you understand the code.
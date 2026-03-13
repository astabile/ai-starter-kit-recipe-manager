# Recipe CRUD API Design

**Date:** March 13, 2026  
**Author:** AI Agent  
**Status:** Design Phase

## Overview

Design and implement a complete RESTful CRUD API for recipe management using Express.js, TypeScript, and MongoDB with Mongoose. The API follows Clean Architecture principles with clear separation between models, services, and controllers.

## Goals

1. Create a production-ready recipe management API
2. Implement proper validation at the model level
3. Follow RESTful conventions
4. Maintain type safety with TypeScript
5. Provide consistent error handling and response formats

## Architecture

### Clean Architecture - Three Layers

```
┌─────────────────────────────────────────┐
│         HTTP Request                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Controller Layer (recipe.controller.ts)│
│  - HTTP request/response handling       │
│  - Status code management               │
│  - Response formatting                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Service Layer (recipe.service.ts)      │
│  - Business logic                       │
│  - Database operations                  │
│  - Error handling                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Model Layer (recipe.model.ts)          │
│  - Mongoose schema                      │
│  - Data validation                      │
│  - Database interface                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         MongoDB Database                │
└─────────────────────────────────────────┘
```

## Data Model

### Recipe Schema

**File:** `src/models/recipe.model.ts`

**Fields:**

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| name | String | Required, 3-200 chars | - |
| ingredients | String[] | Required, min 1 item | - |
| instructions | String | Required, 50-5000 chars | - |
| cuisine | String | - | 'Other' |
| difficulty | Enum | 'easy', 'medium', 'hard' | 'medium' |
| prepTime | Number | Required, minutes | - |
| cookTime | Number | Required, minutes | - |
| servings | Number | Required, min 1 | - |
| imageUrl | String | Optional | - |
| createdAt | Date | Auto-generated | - |
| updatedAt | Date | Auto-generated | - |

**TypeScript Interface:**

```typescript
export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Strategy:**

All validation happens at the Mongoose schema level using built-in validators:
- `required`: For mandatory fields
- `minlength`/`maxlength`: For string length constraints
- `min`: For numeric minimums
- `enum`: For difficulty field
- `validate`: For array minimum length

This ensures data consistency at the database level and provides clear error messages.

## Service Layer

**File:** `src/services/recipe.service.ts`

**Purpose:** Encapsulate business logic and database operations.

**Functions:**

### `getAllRecipes(): Promise<IRecipe[]>`
- Fetches all recipes from database
- Returns array of recipe documents
- Throws error if database operation fails

### `getRecipeById(id: string): Promise<IRecipe>`
- Fetches single recipe by MongoDB ObjectId
- Returns recipe document
- Throws error if recipe not found
- Throws error if id is invalid

### `createRecipe(data: RecipeInput): Promise<IRecipe>`
- Creates new recipe in database
- Validates data through Mongoose schema
- Returns created recipe document
- Throws validation error if data is invalid

### `updateRecipe(id: string, data: Partial<RecipeInput>): Promise<IRecipe>`
- Updates existing recipe by id
- Allows partial updates
- Returns updated recipe document
- Throws error if recipe not found
- Throws validation error if data is invalid

### `deleteRecipe(id: string): Promise<void>`
- Deletes recipe by id
- Returns void on success
- Throws error if recipe not found

**Error Handling:**
- Service functions throw descriptive errors
- Controllers catch these errors and set appropriate HTTP status codes
- Existing error middleware formats error responses

## Controller Layer

**File:** `src/controllers/recipe.controller.ts`

**Purpose:** Handle HTTP requests/responses and call service functions.

**Response Format:**

All responses follow a consistent structure:

```typescript
// Success Response
{
  success: true,
  data: Recipe | Recipe[]
}

// Error Response
{
  success: false,
  error: string
}
```

**Controllers:**

### `getAllRecipes(req, res, next)`
- **Method:** GET
- **Status:** 200 OK
- **Response:** `{ success: true, data: Recipe[] }`
- **Error:** Caught by error middleware

### `getRecipeById(req, res, next)`
- **Method:** GET
- **Params:** `id` (MongoDB ObjectId)
- **Status:** 200 OK / 404 Not Found
- **Response:** `{ success: true, data: Recipe }`
- **Error:** Sets 404 status if not found

### `createRecipe(req, res, next)`
- **Method:** POST
- **Body:** Recipe data
- **Status:** 201 Created / 400 Bad Request
- **Response:** `{ success: true, data: Recipe }`
- **Error:** Sets 400 status for validation errors

### `updateRecipe(req, res, next)`
- **Method:** PUT
- **Params:** `id`
- **Body:** Partial recipe data
- **Status:** 200 OK / 404 Not Found / 400 Bad Request
- **Response:** `{ success: true, data: Recipe }`
- **Error:** Sets appropriate status code

### `deleteRecipe(req, res, next)`
- **Method:** DELETE
- **Params:** `id`
- **Status:** 200 OK / 404 Not Found
- **Response:** `{ success: true, data: { message: "Recipe deleted" } }`
- **Error:** Sets 404 status if not found

**HTTP Status Codes:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors, invalid ObjectId
- `404 Not Found` - Recipe not found
- `500 Internal Server Error` - Server errors

## Routes

**File:** `src/routes/recipe.routes.ts`

**RESTful Endpoints:**

```typescript
import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller';

const router = Router();

router.route('/').get(getAllRecipes).post(createRecipe);

router.route('/:id').get(getRecipeById).put(updateRecipe).delete(deleteRecipe);

export default router;
```

**Routes:**
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get recipe by ID
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

**Integration:**

Routes will be mounted in `src/index.ts`:

```typescript
import recipeRoutes from './routes/recipe.routes';

app.use('/api/recipes', recipeRoutes);
```

## Error Handling

**Existing Middleware:** `src/middleware/errorHandler.ts`

The existing error handler will be enhanced to handle:

1. **Mongoose Validation Errors** → 400 Bad Request
2. **Mongoose Cast Errors** (invalid ObjectId) → 400 Bad Request
3. **Not Found Errors** → 404 Not Found
4. **Generic Errors** → 500 Internal Server Error

**Error Flow:**

```
Service throws error
       ↓
Controller catches error
       ↓
Sets appropriate status code
       ↓
Calls next(error)
       ↓
Error middleware formats response
```

## Type Safety

**TypeScript Types:**

```typescript
// Model interface (extends Mongoose Document)
export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Input type for creating/updating recipes
export interface RecipeInput {
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}
```

**Controller Types:**

All controllers use proper Express types:
```typescript
import { Request, Response, NextFunction } from 'express';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Implementation
};
```

## Testing Considerations

While not implemented in this phase, the architecture supports easy testing:

1. **Unit Tests:**
   - Service functions can be tested independently
   - Mock Mongoose model for isolated testing

2. **Integration Tests:**
   - Test controllers with supertest
   - Use in-memory MongoDB for database tests

3. **E2E Tests:**
   - Test complete API workflows
   - Verify response formats and status codes

## Security Considerations

1. **Input Validation:** Mongoose schema validation prevents malformed data
2. **NoSQL Injection:** Mongoose escapes queries automatically
3. **CORS:** Already configured in main app
4. **Helmet:** Security headers already configured
5. **Error Messages:** Production mode hides stack traces

## Performance Considerations

1. **Lean Queries:** Use `.lean()` when Mongoose document methods not needed
2. **Field Selection:** Select only needed fields with `.select()`
3. **Pagination:** Can be added later with skip/limit
4. **Indexing:** Add indexes on frequently queried fields (name, cuisine)

## Future Enhancements

Not included in this implementation but can be added later:

1. **Pagination:** Add limit, skip, and total count
2. **Filtering:** Filter by cuisine, difficulty
3. **Sorting:** Sort by name, prepTime, cookTime
4. **Search:** Text search on name and ingredients
5. **Image Upload:** Handle actual image uploads (currently just URL)
6. **User Association:** Link recipes to users
7. **Ratings/Reviews:** Add rating system
8. **Tags:** Add tags for categorization

## Success Criteria

- [ ] Recipe model with proper validation
- [ ] All 5 CRUD operations working
- [ ] Consistent response format across all endpoints
- [ ] Proper HTTP status codes
- [ ] Type-safe implementation
- [ ] Error handling for all edge cases
- [ ] Clean Architecture separation maintained
- [ ] Code follows project .cursorrules
- [ ] Routes integrated into main app

## Implementation Order

1. **Model Layer** - Create Mongoose schema with validation
2. **Service Layer** - Implement business logic functions
3. **Controller Layer** - Create HTTP handlers
4. **Routes** - Define RESTful endpoints
5. **Integration** - Mount routes in main app
6. **Testing** - Manual testing with Postman/curl
7. **Documentation** - Update README with API endpoints

## Files to Create/Modify

**New Files:**
- `src/models/recipe.model.ts`
- `src/services/recipe.service.ts`
- `src/controllers/recipe.controller.ts`
- `src/routes/recipe.routes.ts`

**Modified Files:**
- `src/index.ts` - Add recipe routes

**Updated Files:**
- `.skills/db-seed/SKILL.md` - Already updated to match schema

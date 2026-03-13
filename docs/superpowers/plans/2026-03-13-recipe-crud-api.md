# Recipe CRUD API Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete RESTful CRUD API for recipe management with Clean Architecture (model/service/controller layers).

**Architecture:** Three-layer architecture with Mongoose model handling validation, service layer for business logic, and controller layer for HTTP handling. All responses follow consistent JSON format with proper status codes.

**Tech Stack:** TypeScript, Express.js, MongoDB, Mongoose

---

## File Structure

**New Files:**
- `server/src/models/recipe.model.ts` - Mongoose schema with validation
- `server/src/services/recipe.service.ts` - Business logic layer
- `server/src/controllers/recipe.controller.ts` - HTTP request handlers
- `server/src/routes/recipe.routes.ts` - RESTful route definitions

**Modified Files:**
- `server/src/index.ts` - Mount recipe routes

---

## Task 1: Create Recipe Model with Validation

**Files:**
- Create: `server/src/models/recipe.model.ts`

- [ ] **Step 1: Create Recipe model with Mongoose schema**

```typescript
import { Schema, model, Document } from 'mongoose';

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

const recipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [3, 'Recipe name must be at least 3 characters'],
      maxlength: [200, 'Recipe name must not exceed 200 characters'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (arr: string[]) {
          return arr && arr.length > 0;
        },
        message: 'At least one ingredient is required',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      minlength: [50, 'Instructions must be at least 50 characters'],
      maxlength: [5000, 'Instructions must not exceed 5000 characters'],
    },
    cuisine: {
      type: String,
      default: 'Other',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard',
      },
      default: 'medium',
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
```

- [ ] **Step 2: Verify file was created**

Run: `ls -la server/src/models/recipe.model.ts`
Expected: File exists

- [ ] **Step 3: Check TypeScript compilation**

Run: `npm run build --workspace=server`
Expected: No errors, file compiles successfully

---

## Task 2: Create Service Layer

**Files:**
- Create: `server/src/services/recipe.service.ts`

- [ ] **Step 1: Create service with all CRUD operations**

```typescript
import { Recipe, IRecipe } from '../models/recipe.model';

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

export const getAllRecipes = async (): Promise<IRecipe[]> => {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    throw new Error(`Error fetching recipes: ${error}`);
  }
};

export const getRecipeById = async (id: string): Promise<IRecipe> => {
  try {
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
    
    return recipe;
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    throw error;
  }
};

export const createRecipe = async (data: RecipeInput): Promise<IRecipe> => {
  try {
    const recipe = new Recipe(data);
    await recipe.save();
    return recipe;
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    throw error;
  }
};

export const updateRecipe = async (
  id: string,
  data: Partial<RecipeInput>
): Promise<IRecipe> => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
    
    return recipe;
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    throw error;
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndDelete(id);
    
    if (!recipe) {
      const error: any = new Error('Recipe not found');
      error.statusCode = 404;
      throw error;
    }
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      const validationError: any = new Error('Invalid recipe ID');
      validationError.statusCode = 400;
      throw validationError;
    }
    throw error;
  }
};
```

- [ ] **Step 2: Verify file was created**

Run: `ls -la server/src/services/recipe.service.ts`
Expected: File exists

- [ ] **Step 3: Check TypeScript compilation**

Run: `npm run build --workspace=server`
Expected: No errors, service compiles with model import

---

## Task 3: Create Controller Layer

**Files:**
- Create: `server/src/controllers/recipe.controller.ts`

- [ ] **Step 1: Create controllers for all CRUD operations**

```typescript
import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipe.service';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const recipe = await recipeService.updateRecipe(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await recipeService.deleteRecipe(req.params.id);
    res.status(200).json({
      success: true,
      data: { message: 'Recipe deleted successfully' },
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
```

- [ ] **Step 2: Verify file was created**

Run: `ls -la server/src/controllers/recipe.controller.ts`
Expected: File exists

- [ ] **Step 3: Check TypeScript compilation**

Run: `npm run build --workspace=server`
Expected: No errors, controller compiles with service import

---

## Task 4: Create Routes

**Files:**
- Create: `server/src/routes/recipe.routes.ts`

- [ ] **Step 1: Create RESTful routes**

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

- [ ] **Step 2: Verify file was created**

Run: `ls -la server/src/routes/recipe.routes.ts`
Expected: File exists

- [ ] **Step 3: Check TypeScript compilation**

Run: `npm run build --workspace=server`
Expected: No errors, routes compile with controller imports

---

## Task 5: Integrate Routes into Main App

**Files:**
- Modify: `server/src/index.ts`

- [ ] **Step 1: Import and mount recipe routes**

Add import at top of file (after existing imports):
```typescript
import recipeRoutes from './routes/recipe.routes';
```

Add route mounting (after existing health routes, before error handlers):
```typescript
app.use('/api/recipes', recipeRoutes);
```

Complete modified section should look like:
```typescript
app.use('/api/health', healthRoutes);
app.use('/api/recipes', recipeRoutes);

app.use(notFound);
app.use(errorHandler);
```

- [ ] **Step 2: Verify changes**

Run: `cat server/src/index.ts | grep -A2 "'/api/recipes'"`
Expected: Shows the route mounting

- [ ] **Step 3: Build and verify compilation**

Run: `npm run build --workspace=server`
Expected: No errors, complete build successful

---

## Task 6: Update Error Handler for Better Mongoose Error Messages

**Files:**
- Modify: `server/src/middleware/errorHandler.ts`

- [ ] **Step 1: Enhance error handler to format Mongoose validation errors**

Replace the existing errorHandler function with:

```typescript
import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: boolean;
  error: string;
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e: any) => e.message);
    message = messages.join(', ');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  const response: ErrorResponse = {
    success: false,
    error: message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

- [ ] **Step 2: Build and verify**

Run: `npm run build --workspace=server`
Expected: No errors, enhanced error handler compiles

---

## Task 7: Test the API

**Files:**
- None (manual testing)

- [ ] **Step 1: Start MongoDB**

Run: `docker-compose up -d`
Expected: MongoDB container running

- [ ] **Step 2: Start the server**

Run: `npm run dev --workspace=server`
Expected: Server starts on port 5001, MongoDB connected

- [ ] **Step 3: Test GET all recipes (empty)**

Run: `curl http://localhost:5001/api/recipes`
Expected: `{"success":true,"data":[]}`

- [ ] **Step 4: Test POST create recipe**

Run:
```bash
curl -X POST http://localhost:5001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Recipe",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": "This is a test recipe with at least 50 characters in the instructions to pass validation.",
    "cuisine": "Test Cuisine",
    "difficulty": "easy",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 4
  }'
```
Expected: Status 201, returns created recipe with `_id`, `createdAt`, `updatedAt`

- [ ] **Step 5: Test GET all recipes (with data)**

Run: `curl http://localhost:5001/api/recipes`
Expected: `{"success":true,"data":[{...recipe...}]}`

- [ ] **Step 6: Test GET recipe by ID**

Run: `curl http://localhost:5001/api/recipes/<ID_FROM_PREVIOUS_STEP>`
Expected: `{"success":true,"data":{...recipe...}}`

- [ ] **Step 7: Test PUT update recipe**

Run:
```bash
curl -X PUT http://localhost:5001/api/recipes/<ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Recipe Name",
    "difficulty": "hard"
  }'
```
Expected: Status 200, returns updated recipe

- [ ] **Step 8: Test DELETE recipe**

Run: `curl -X DELETE http://localhost:5001/api/recipes/<ID>`
Expected: `{"success":true,"data":{"message":"Recipe deleted successfully"}}`

- [ ] **Step 9: Test error cases - invalid ID**

Run: `curl http://localhost:5001/api/recipes/invalid-id`
Expected: Status 400, `{"success":false,"error":"Invalid ID format"}`

- [ ] **Step 10: Test error cases - validation failure**

Run:
```bash
curl -X POST http://localhost:5001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AB",
    "ingredients": [],
    "instructions": "Too short",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 0
  }'
```
Expected: Status 400, validation error messages

- [ ] **Step 11: Test error cases - recipe not found**

Run: `curl http://localhost:5001/api/recipes/507f1f77bcf86cd799439011`
Expected: Status 404, `{"success":false,"error":"Recipe not found"}`

---

## Task 8: Update Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add API endpoints documentation**

Add this section after the "Running the Application" section:

```markdown
## 📡 API Endpoints

### Recipe Management

#### Get All Recipes
```http
GET /api/recipes
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "...",
      "cuisine": "Italian",
      "difficulty": "medium",
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "imageUrl": "https://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Recipe by ID
```http
GET /api/recipes/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Recipe Name",
    ...
  }
}
```

#### Create Recipe
```http
POST /api/recipes
Content-Type: application/json

{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": "Detailed instructions (50-5000 chars)...",
  "cuisine": "Italian",
  "difficulty": "medium",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "imageUrl": "https://..."
}
```

Response (Status 201):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    ...
  }
}
```

#### Update Recipe
```http
PUT /api/recipes/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "difficulty": "hard"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    ...
  }
}
```

#### Delete Recipe
```http
DELETE /api/recipes/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "Recipe deleted successfully"
  }
}
```

### Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors, invalid ID
- `404 Not Found` - Recipe not found
- `500 Internal Server Error` - Server errors
```

- [ ] **Step 2: Verify documentation was added**

Run: `grep -A5 "## 📡 API Endpoints" README.md`
Expected: Shows the API endpoints section

---

## Completion Checklist

After completing all tasks:

- [ ] All files created successfully
- [ ] TypeScript compiles without errors
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] All CRUD operations tested manually
- [ ] Error handling works correctly
- [ ] Documentation updated
- [ ] Ready for commit

---

## Notes

**TDD Consideration:** This implementation focuses on getting the API working first. For true TDD, we would write tests before implementation. Consider adding tests using the `test-backend` skill after this implementation is complete.

**Next Steps:**
1. Add unit tests for service layer
2. Add integration tests for API endpoints
3. Add pagination and filtering
4. Add authentication/authorization
5. Implement database seeding with sample recipes

**Reference Skills:**
- `@test-backend` - For adding comprehensive backend tests
- `@db-seed` - For seeding the database with sample recipes

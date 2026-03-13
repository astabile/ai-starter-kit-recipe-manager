---
name: test-backend
description: Run comprehensive backend testing workflow including unit tests, integration tests, and API endpoint testing for the MERN stack server
---

# Backend Testing Workflow

This skill guides you through testing the backend server, including setting up test infrastructure, writing tests, and running the test suite.

## When to Use This Skill

Use this skill when:
- You need to **test backend API endpoints**
- You want to **run backend tests**
- You're **writing new backend tests**
- You need to **verify backend functionality**
- You're debugging a **backend test failure**
- You want to **check test coverage**

## Prerequisites

- Node.js and npm installed
- Backend dependencies installed (`npm install` in `/server`)
- MongoDB running (for integration tests)

## Testing Stack

- **Test Framework**: Jest
- **Assertion Library**: Jest matchers
- **Mocking**: Jest mocks
- **HTTP Testing**: Supertest (for API endpoint testing)
- **Database**: In-memory MongoDB or test database

## Workflow Steps

### 1. Install Testing Dependencies

```bash
cd server
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

### 2. Configure Jest

Create `server/jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 3. Add Test Scripts

Update `server/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

### 4. Create Test Directory Structure

```bash
mkdir -p src/__tests__/{unit,integration,e2e}
```

Structure:
```
server/src/__tests__/
├── unit/              # Unit tests for utilities, helpers
├── integration/       # Integration tests for controllers, services
└── e2e/              # End-to-end API tests
```

### 5. Write Unit Tests

Example: Testing a utility function

```typescript
// src/utils/validation.ts
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// src/__tests__/unit/validation.test.ts
import { isValidEmail } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });
});
```

### 6. Write Integration Tests

Example: Testing a controller

```typescript
// src/__tests__/integration/recipe.controller.test.ts
import request from 'supertest';
import express from 'express';
import { connectDB } from '../../config/database';
import recipeRoutes from '../../routes/recipe.routes';
import { Recipe } from '../../models/recipe.model';

const app = express();
app.use(express.json());
app.use('/api/recipes', recipeRoutes);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await Recipe.deleteMany({});
  await mongoose.connection.close();
});

describe('Recipe Controller', () => {
  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      const newRecipe = {
        title: 'Test Recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Step 1', 'Step 2'],
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Recipe');
    });

    it('should return 400 for invalid data', async () => {
      const invalidRecipe = {
        title: '',
        ingredients: [],
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(invalidRecipe)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/recipes', () => {
    beforeEach(async () => {
      await Recipe.create({
        title: 'Recipe 1',
        ingredients: ['Ingredient 1'],
        instructions: ['Step 1'],
      });
    });

    it('should return all recipes', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
```

### 7. Write E2E Tests

Example: Full API workflow test

```typescript
// src/__tests__/e2e/recipe.e2e.test.ts
import request from 'supertest';
import app from '../../index';

describe('Recipe E2E Tests', () => {
  let recipeId: string;

  it('should complete full recipe lifecycle', async () => {
    // Create recipe
    const createResponse = await request(app)
      .post('/api/recipes')
      .send({
        title: 'E2E Test Recipe',
        ingredients: ['Test Ingredient'],
        instructions: ['Test Step'],
      })
      .expect(201);

    recipeId = createResponse.body.data._id;
    expect(recipeId).toBeDefined();

    // Get recipe
    const getResponse = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .expect(200);

    expect(getResponse.body.data.title).toBe('E2E Test Recipe');

    // Update recipe
    const updateResponse = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send({
        title: 'Updated Recipe',
        ingredients: ['Updated Ingredient'],
        instructions: ['Updated Step'],
      })
      .expect(200);

    expect(updateResponse.body.data.title).toBe('Updated Recipe');

    // Delete recipe
    await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .expect(200);

    // Verify deletion
    await request(app)
      .get(`/api/recipes/${recipeId}`)
      .expect(404);
  });
});
```

### 8. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- recipe.controller.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Recipe"
```

### 9. View Coverage Report

After running `npm run test:coverage`:

```bash
# Open coverage report
open coverage/lcov-report/index.html
```

## Testing Best Practices

### 1. Test Organization
- **One test file per module**: `recipe.controller.test.ts` for `recipe.controller.ts`
- **Clear describe blocks**: Group related tests
- **Descriptive test names**: Use "should" statements

### 2. Test Independence
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Don't rely on test execution order

### 3. Mocking
```typescript
// Mock external dependencies
jest.mock('../../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

// Mock database calls
jest.spyOn(Recipe, 'find').mockResolvedValue([mockRecipe]);
```

### 4. Async Testing
```typescript
// Use async/await
it('should fetch recipes', async () => {
  const recipes = await getRecipes();
  expect(recipes).toBeDefined();
});

// Or use done callback
it('should fetch recipes', (done) => {
  getRecipes().then((recipes) => {
    expect(recipes).toBeDefined();
    done();
  });
});
```

### 5. Error Testing
```typescript
it('should throw error for invalid input', async () => {
  await expect(createRecipe({ title: '' })).rejects.toThrow(
    'Title is required'
  );
});
```

## Common Test Patterns

### Testing Middleware
```typescript
describe('Error Handler Middleware', () => {
  it('should return 500 for server errors', () => {
    const error = new Error('Test error');
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Test error',
    });
  });
});
```

### Testing Database Models
```typescript
describe('Recipe Model', () => {
  it('should create a valid recipe', async () => {
    const recipe = new Recipe({
      title: 'Test Recipe',
      ingredients: ['Ingredient 1'],
      instructions: ['Step 1'],
    });

    const savedRecipe = await recipe.save();
    expect(savedRecipe._id).toBeDefined();
    expect(savedRecipe.title).toBe('Test Recipe');
  });

  it('should require title field', async () => {
    const recipe = new Recipe({
      ingredients: ['Ingredient 1'],
      instructions: ['Step 1'],
    });

    await expect(recipe.save()).rejects.toThrow();
  });
});
```

## Troubleshooting

### MongoDB Connection Issues
```typescript
// Use in-memory MongoDB for tests
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
```

### Port Conflicts
```typescript
// Use random port for test server
const testPort = Math.floor(Math.random() * 10000) + 10000;
app.listen(testPort);
```

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
      - run: npm install
        working-directory: ./server
      - run: npm test
        working-directory: ./server
      - run: npm run test:coverage
        working-directory: ./server
```

## Success Criteria

✅ All tests pass
✅ Coverage meets threshold (80%)
✅ No console errors or warnings
✅ Tests run in CI/CD pipeline
✅ Test execution time is reasonable (< 30s for unit tests)

## Next Steps

After setting up backend tests:
1. Add tests for new features before implementation (TDD)
2. Run tests before committing code
3. Review coverage reports regularly
4. Add E2E tests for critical user flows
5. Set up continuous integration

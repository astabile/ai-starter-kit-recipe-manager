---
name: db-seed
description: Seed MongoDB database with sample recipe data for development, testing, and demo purposes
---

# Database Seeding Workflow

This skill guides you through creating and running database seed scripts to populate MongoDB with sample recipe data.

## When to Use This Skill

Use this skill when:
- You need **sample data for development**
- You want to **populate a test database**
- You're **setting up a demo environment**
- You need to **reset the database** to a known state
- You're **testing API endpoints** with realistic data
- You want to **demonstrate application features**

## Prerequisites

- MongoDB running (local or Docker)
- Backend server configured
- Mongoose models defined
- Environment variables set up

## Workflow Steps

### 1. Create Seed Data Structure

Create `server/src/seeds/data/recipes.json`:

```json
[
  {
    "title": "Classic Chocolate Chip Cookies",
    "description": "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
    "ingredients": [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    "instructions": [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Beat butter and sugars until creamy",
      "Add eggs and vanilla, beat well",
      "Gradually blend in flour mixture",
      "Stir in chocolate chips",
      "Drop rounded tablespoons onto ungreased cookie sheets",
      "Bake 9-11 minutes or until golden brown",
      "Cool on baking sheet for 2 minutes",
      "Remove to wire rack to cool completely"
    ],
    "prepTime": 15,
    "cookTime": 11,
    "servings": 48,
    "difficulty": "Easy",
    "category": "Dessert",
    "cuisine": "American",
    "tags": ["cookies", "dessert", "chocolate", "baking"]
  },
  {
    "title": "Spaghetti Carbonara",
    "description": "Authentic Italian pasta dish with eggs, cheese, and pancetta.",
    "ingredients": [
      "400g spaghetti",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "Black pepper to taste",
      "Salt for pasta water"
    ],
    "instructions": [
      "Bring large pot of salted water to boil",
      "Cook spaghetti according to package directions",
      "While pasta cooks, fry pancetta until crispy",
      "Beat eggs and mix with grated cheese",
      "Drain pasta, reserving 1 cup pasta water",
      "Remove pan from heat, add pasta to pancetta",
      "Quickly mix in egg mixture, stirring constantly",
      "Add pasta water to achieve creamy consistency",
      "Season with black pepper",
      "Serve immediately"
    ],
    "prepTime": 10,
    "cookTime": 15,
    "servings": 4,
    "difficulty": "Medium",
    "category": "Main Course",
    "cuisine": "Italian",
    "tags": ["pasta", "italian", "quick", "dinner"]
  },
  {
    "title": "Caesar Salad",
    "description": "Classic Caesar salad with homemade dressing and croutons.",
    "ingredients": [
      "2 romaine lettuce heads",
      "1/2 cup Caesar dressing",
      "1/2 cup Parmesan cheese, shaved",
      "1 cup croutons",
      "2 anchovy fillets (optional)",
      "1 lemon, juiced",
      "2 garlic cloves, minced",
      "1 tsp Dijon mustard",
      "2 tsp Worcestershire sauce",
      "1/2 cup olive oil"
    ],
    "instructions": [
      "Wash and dry lettuce, tear into pieces",
      "Make dressing: blend garlic, anchovies, lemon juice, Dijon, and Worcestershire",
      "Slowly drizzle in olive oil while blending",
      "Toss lettuce with dressing",
      "Top with Parmesan and croutons",
      "Serve immediately"
    ],
    "prepTime": 15,
    "cookTime": 0,
    "servings": 4,
    "difficulty": "Easy",
    "category": "Salad",
    "cuisine": "American",
    "tags": ["salad", "vegetarian", "quick", "healthy"]
  }
]
```

### 2. Create Seed Script

Create `server/src/seeds/seedRecipes.ts`:

```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Recipe } from '../models/recipe.model';
import recipesData from './data/recipes.json';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-manager';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Recipe.deleteMany({});
    console.log('✓ Cleared existing recipes');

    // Insert seed data
    const recipes = await Recipe.insertMany(recipesData);
    console.log(`✓ Inserted ${recipes.length} recipes`);

    // Display summary
    console.log('\nSeeded Recipes:');
    recipes.forEach((recipe, index) => {
      console.log(`  ${index + 1}. ${recipe.title} (${recipe.category})`);
    });

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
};

// Run seed script
seedDatabase();
```

### 3. Add Seed Script to Package.json

Update `server/package.json`:

```json
{
  "scripts": {
    "seed": "ts-node src/seeds/seedRecipes.ts",
    "seed:users": "ts-node src/seeds/seedUsers.ts",
    "seed:all": "npm run seed && npm run seed:users",
    "db:reset": "npm run seed:all"
  }
}
```

### 4. Create Advanced Seed Script with Options

Create `server/src/seeds/index.ts`:

```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Recipe } from '../models/recipe.model';
import recipesData from './data/recipes.json';

dotenv.config();

interface SeedOptions {
  clear?: boolean;
  count?: number;
  category?: string;
}

class DatabaseSeeder {
  private mongoURI: string;

  constructor() {
    this.mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-manager';
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.mongoURI);
    console.log('✓ Connected to MongoDB');
  }

  async disconnect(): Promise<void> {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }

  async clearRecipes(): Promise<void> {
    const result = await Recipe.deleteMany({});
    console.log(`✓ Cleared ${result.deletedCount} existing recipes`);
  }

  async seedRecipes(options: SeedOptions = {}): Promise<void> {
    const { clear = true, count, category } = options;

    if (clear) {
      await this.clearRecipes();
    }

    let dataToSeed = recipesData;

    // Filter by category if specified
    if (category) {
      dataToSeed = recipesData.filter(
        (recipe: any) => recipe.category.toLowerCase() === category.toLowerCase()
      );
      console.log(`✓ Filtering recipes by category: ${category}`);
    }

    // Limit count if specified
    if (count) {
      dataToSeed = dataToSeed.slice(0, count);
      console.log(`✓ Limiting to ${count} recipes`);
    }

    const recipes = await Recipe.insertMany(dataToSeed);
    console.log(`✓ Inserted ${recipes.length} recipes`);

    // Display summary by category
    const summary = recipes.reduce((acc: any, recipe: any) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\nRecipes by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count}`);
    });
  }

  async getStats(): Promise<void> {
    const totalRecipes = await Recipe.countDocuments();
    const categories = await Recipe.distinct('category');
    const cuisines = await Recipe.distinct('cuisine');

    console.log('\nDatabase Statistics:');
    console.log(`  Total Recipes: ${totalRecipes}`);
    console.log(`  Categories: ${categories.join(', ')}`);
    console.log(`  Cuisines: ${cuisines.join(', ')}`);
  }
}

// CLI interface
const runSeeder = async () => {
  const seeder = new DatabaseSeeder();

  try {
    await seeder.connect();

    // Parse command line arguments
    const args = process.argv.slice(2);
    const options: SeedOptions = {
      clear: !args.includes('--no-clear'),
      count: args.includes('--count')
        ? parseInt(args[args.indexOf('--count') + 1])
        : undefined,
      category: args.includes('--category') 
        ? args[args.indexOf('--category') + 1]
        : undefined,
    };

    await seeder.seedRecipes(options);
    await seeder.getStats();

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await seeder.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  runSeeder();
}

export { DatabaseSeeder };
```

### 5. Run Seed Scripts

```bash
# Basic seeding (clears and seeds all data)
npm run seed

# Seed without clearing existing data
npm run seed -- --no-clear

# Seed only specific number of recipes
npm run seed -- --count 5

# Seed only specific category
npm run seed -- --category Dessert

# Combine options
npm run seed -- --count 10 --category "Main Course" --no-clear
```

### 6. Create Seed Data Generators

Create `server/src/seeds/generators/recipeGenerator.ts`:

```typescript
import { faker } from '@faker-js/faker';

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  cuisine: string;
  tags: string[];
}

export const generateRecipe = (): GeneratedRecipe => {
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'];
  const cuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'French', 'Japanese'];
  const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = ['Easy', 'Medium', 'Hard'];

  return {
    title: faker.food.dish(),
    description: faker.food.description(),
    ingredients: Array.from({ length: faker.number.int({ min: 4, max: 12 }) }, () =>
      `${faker.number.int({ min: 1, max: 3 })} ${faker.helpers.arrayElement(['cup', 'tbsp', 'tsp', 'oz', 'lb'])} ${faker.food.ingredient()}`
    ),
    instructions: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, (_, i) =>
      `Step ${i + 1}: ${faker.lorem.sentence()}`
    ),
    prepTime: faker.number.int({ min: 5, max: 60 }),
    cookTime: faker.number.int({ min: 10, max: 120 }),
    servings: faker.number.int({ min: 1, max: 12 }),
    difficulty: faker.helpers.arrayElement(difficulties),
    category: faker.helpers.arrayElement(categories),
    cuisine: faker.helpers.arrayElement(cuisines),
    tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
      faker.helpers.arrayElement(['quick', 'healthy', 'vegan', 'gluten-free', 'spicy', 'comfort-food'])
    ),
  };
};

export const generateRecipes = (count: number): GeneratedRecipe[] => {
  return Array.from({ length: count }, () => generateRecipe());
};
```

Install faker:
```bash
npm install -D @faker-js/faker
```

### 7. Create Dynamic Seed Script

Create `server/src/seeds/seedDynamic.ts`:

```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Recipe } from '../models/recipe.model';
import { generateRecipes } from './generators/recipeGenerator';

dotenv.config();

const seedDynamicData = async (count: number = 50) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-manager');
    console.log('✓ Connected to MongoDB');

    await Recipe.deleteMany({});
    console.log('✓ Cleared existing recipes');

    const recipes = generateRecipes(count);
    const inserted = await Recipe.insertMany(recipes);
    console.log(`✓ Generated and inserted ${inserted.length} recipes`);

    const stats = await Recipe.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('\nRecipes by category:');
    stats.forEach(({ _id, count }) => {
      console.log(`  - ${_id}: ${count}`);
    });

    console.log('\n✓ Dynamic seeding completed!');
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const count = parseInt(process.argv[2]) || 50;
seedDynamicData(count);
```

Add to package.json:
```json
{
  "scripts": {
    "seed:dynamic": "ts-node src/seeds/seedDynamic.ts"
  }
}
```

Run with:
```bash
# Generate 50 recipes (default)
npm run seed:dynamic

# Generate specific number
npm run seed:dynamic 100
```

### 8. Create Test Database Seeder

Create `server/src/seeds/seedTest.ts`:

```typescript
import mongoose from 'mongoose';
import { Recipe } from '../models/recipe.model';

export const seedTestDatabase = async () => {
  const testRecipes = [
    {
      title: 'Test Recipe 1',
      ingredients: ['Test Ingredient 1'],
      instructions: ['Test Step 1'],
      category: 'Test Category',
    },
    {
      title: 'Test Recipe 2',
      ingredients: ['Test Ingredient 2'],
      instructions: ['Test Step 2'],
      category: 'Test Category',
    },
  ];

  await Recipe.deleteMany({});
  return await Recipe.insertMany(testRecipes);
};

// Use in tests
export const cleanDatabase = async () => {
  await Recipe.deleteMany({});
};
```

Use in tests:
```typescript
import { seedTestDatabase, cleanDatabase } from '../seeds/seedTest';

beforeEach(async () => {
  await seedTestDatabase();
});

afterEach(async () => {
  await cleanDatabase();
});
```

## Seeding Best Practices

### 1. Idempotent Seeds
```typescript
// ✅ GOOD: Clear before seeding
await Recipe.deleteMany({});
await Recipe.insertMany(data);

// ❌ BAD: Duplicate data on multiple runs
await Recipe.insertMany(data); // without clearing
```

### 2. Error Handling
```typescript
try {
  await Recipe.insertMany(data);
} catch (error) {
  if (error.code === 11000) {
    console.error('Duplicate key error');
  }
  throw error;
}
```

### 3. Validation
```typescript
const recipe = new Recipe(data);
await recipe.validate(); // Validate before inserting
await recipe.save();
```

### 4. Transactions
```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Recipe.insertMany(data, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Troubleshooting

### Connection Issues
```typescript
mongoose.set('debug', true); // Enable debug mode
```

### Validation Errors
```typescript
// Check model validation
const recipe = new Recipe(data);
const validationError = recipe.validateSync();
if (validationError) {
  console.error(validationError.errors);
}
```

### Duplicate Keys
```typescript
// Add unique constraint handling
try {
  await Recipe.insertMany(data);
} catch (error) {
  if (error.code === 11000) {
    console.log('Skipping duplicates...');
    // Insert one by one, skipping duplicates
  }
}
```

## Success Criteria

✅ Database connected successfully
✅ Existing data cleared (if specified)
✅ Seed data inserted without errors
✅ Data validates against schema
✅ Summary statistics displayed
✅ Database connection closed properly

## Next Steps

After seeding:
1. Verify data in MongoDB Compass
2. Test API endpoints with seeded data
3. Create additional seed scripts for other collections
4. Add seed data to CI/CD pipeline
5. Document seed data structure

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
      console.log(`  ${index + 1}. ${recipe.name} (${recipe.cuisine}, ${recipe.difficulty})`);
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

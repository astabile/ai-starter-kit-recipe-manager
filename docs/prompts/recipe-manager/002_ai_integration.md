# AI Integration for Recipe Classification

## Context
AI can analyze recipes to automatically classify cuisine type and difficulty level, improving organization.

## Goal
Integrate OpenAI to provide intelligent recipe classification with error handling.

---

## The Prompt

Create AI service for recipe classification:

**AI Service** (`src/services/aiService.ts`):
- classifyRecipe(name, ingredients, instructions) method
- Uses GPT-4o-mini model
- Temperature: 0.3
- Returns JSON: {suggestedCuisine, suggestedDifficulty, reasoning}

**AI analyzes:**
- Ingredients (common in which cuisine?)
- Cooking techniques (complexity level?)
- Time estimates (quick = easy, long = hard?)

**Cuisine categories:**
Italian, Mexican, Asian, French, American, Mediterranean, Indian, Other

**Difficulty assessment:**
- Easy: Simple techniques, common ingredients, < 30 min total
- Medium: Moderate techniques, 30-60 min
- Hard: Advanced techniques, special equipment, > 60 min

**AI Controller** (`src/controllers/aiController.ts`):
- POST /api/ai/classify
- Validates input (name, ingredients, instructions required)
- Returns suggestions

**Update main server:**
Add AI routes: app.use('/api/ai', aiRoutes)

---

## Key Takeaway
AI classification helps users organize recipes without manual categorization.
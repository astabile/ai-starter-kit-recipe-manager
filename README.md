# Recipe Manager - MERN Stack Application

A production-ready recipe management application built with MongoDB, Express, React, and Node.js (MERN stack) with TypeScript support.

## 🚀 Features

- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Modern Tooling**: ESLint, Prettier, Hot Reload
- **API Client**: Axios with request/response interceptors
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Compression middleware
- **Routing**: React Router for client-side navigation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v22.x or higher recommended)
- npm (v10.x or higher)
- Docker and Docker Compose (for MongoDB)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/astabile/ai-starter-kit-recipe-manager.git
   cd ai-starter-kit-recipe-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Backend (.env in `/server`):
   ```bash
   cp server/.env.example server/.env
   ```
   
   Frontend (.env in `/client`):
   ```bash
   cp client/.env.example client/.env
   ```

4. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

## 🏃 Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- Frontend development server on `http://localhost:3000`
- Backend API server on `http://localhost:5001`
- MongoDB on `mongodb://localhost:27017`

### Run Frontend Only

```bash
npm run dev:client
```

### Run Backend Only

```bash
npm run dev:server
```

## 📁 Project Structure

```
recipe-manager/
├── .skills/                      # Project-specific AI skills
│   ├── test-backend/            # Backend testing workflow
│   ├── deploy-docker/           # Docker deployment guide
│   └── db-seed/                 # Database seeding workflow
│
├── client/                       # React frontend
│   ├── src/
│   │   ├── __tests__/           # Vitest component tests
│   │   │   ├── components/      # Component test files
│   │   │   └── setup.ts         # Test configuration
│   │   ├── components/          # React components
│   │   │   ├── AIButton.tsx     # AI classification button
│   │   │   ├── RecipeCard.tsx   # Recipe card display
│   │   │   ├── RecipeForm.tsx   # Create/edit form
│   │   │   └── RecipeList.tsx   # Recipe grid layout
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useRecipes.ts    # Recipe state management
│   │   ├── services/            # API service layer
│   │   │   ├── api.ts           # Base axios client
│   │   │   └── recipeApi.ts     # Typed recipe API client
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── recipe.ts        # Recipe type definitions
│   │   ├── App.tsx              # Main app component
│   │   └── index.css            # Tailwind CSS imports
│   ├── .env.example             # Environment variables template
│   ├── vitest.config.ts         # Vitest configuration
│   └── package.json
│
├── server/                       # Node.js backend
│   ├── src/
│   │   ├── __tests__/           # Jest test suites
│   │   │   ├── unit/            # Unit tests
│   │   │   │   ├── recipe.service.test.ts
│   │   │   │   └── ai.service.test.ts
│   │   │   ├── integration/     # Integration tests
│   │   │   │   ├── recipe.api.test.ts
│   │   │   │   └── ai.api.test.ts
│   │   │   └── setup.ts         # Test configuration
│   │   ├── config/              # App configuration
│   │   │   └── database.ts      # MongoDB connection
│   │   ├── controllers/         # Request handlers
│   │   │   ├── recipe.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── middleware/          # Express middleware
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── models/              # Mongoose schemas
│   │   │   └── recipe.model.ts  # Recipe schema
│   │   ├── routes/              # API routes
│   │   │   ├── health.routes.ts
│   │   │   ├── recipe.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── seeds/               # Database seeding
│   │   │   ├── data/            # Seed data files
│   │   │   │   └── recipes.json
│   │   │   └── seedRecipes.ts   # Seed script
│   │   ├── services/            # Business logic
│   │   │   ├── recipe.service.ts
│   │   │   └── ai.service.ts    # OpenAI integration
│   │   └── index.ts             # Server entry point
│   ├── .env.example             # Environment variables template
│   ├── jest.config.js           # Jest configuration
│   └── package.json
│
├── docs/                         # Documentation
│   ├── prompts/                 # Implementation prompts
│   │   ├── starter-kit/         # Project setup prompts
│   │   └── recipe-manager/      # Feature prompts
│   ├── superpowers/             # Design & planning docs
│   │   ├── specs/               # Design specifications
│   │   └── plans/               # Implementation plans
│   └── ai-skills-cheatsheet.md  # Skill usage reference
│
├── llms.txt                      # AI context file
├── AGENTS.md                     # Development workflow guide
├── .cursorrules                  # Coding standards
├── docker-compose.yml            # MongoDB container config
├── package.json                  # Root workspace configuration
└── README.md                     # This file
```

## 📚 Implementation Prompts

This project was built using a systematic prompt-driven approach. All prompts used to build each feature are documented in the `/docs/prompts/` directory:

### Starter Kit Prompts
- **[001: MERN Project Setup](./docs/prompts/starter-kit/001_project_setup.md)** - Initial MERN stack configuration with TypeScript, ESLint, Prettier, and Docker
- **[002: AI Ecosystem Setup](./docs/prompts/starter-kit/002_ai_ecosystem_setup.md)** - llms.txt, AGENTS.md, .cursorrules, and custom skills for AI-assisted development
- **[003: Global Skills Installation](./docs/prompts/starter-kit/003_global_skills_installation.md)** - Superpowers and wshobson-agents skill collections

### Recipe Manager Prompts
- **[001: Backend CRUD Implementation](./docs/prompts/recipe-manager/001_backend_crud.md)** - Recipe model, service layer, controllers, and RESTful routes with Mongoose validation
- **[002: AI Integration](./docs/prompts/recipe-manager/002_ai_integration.md)** - OpenAI GPT-4o-mini integration for automatic recipe classification
- **[003: Frontend React Implementation](./docs/prompts/recipe-manager/003_frontend_react.md)** - React components, hooks, and Tailwind CSS UI with AI features
- **[004: Testing Implementation](./docs/prompts/recipe-manager/004_testing_implementation.md)** - Comprehensive Jest (backend) and Vitest (frontend) test suites

Each prompt includes context, goals, detailed specifications, and key takeaways. These serve as both documentation and a guide for understanding the implementation decisions.

## 🔧 Available Scripts

### Root Level

- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:client` - Run frontend only
- `npm run dev:server` - Run backend only
- `npm run build` - Build both frontend and backend
- `npm run lint` - Run ESLint on both projects
- `npm run format` - Run Prettier on both projects

### Backend (in `/server`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

### Frontend (in `/client`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check server status

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
      "instructions": "Detailed cooking instructions...",
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
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": "Detailed cooking instructions...",
    "cuisine": "Italian",
    "difficulty": "medium",
    "prepTime": 15,
    "cookTime": 30,
    "servings": 4,
    "imageUrl": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
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

**Required fields:**
- `name` (3-200 characters)
- `ingredients` (array, minimum 1 item)
- `instructions` (50-5000 characters)
- `prepTime` (number, minutes)
- `cookTime` (number, minutes)
- `servings` (number, minimum 1)

**Optional fields:**
- `cuisine` (default: "Other")
- `difficulty` ("easy", "medium", or "hard", default: "medium")
- `imageUrl`

Response (Status 201):
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

#### Update Recipe
```http
PUT /api/recipes/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "difficulty": "hard"
}
```

**Note:** All fields are optional for updates (partial update supported).

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Updated Name",
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
  "error": "Error message describing what went wrong"
}
```

**Status Codes:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors, invalid ID format
- `404 Not Found` - Recipe not found
- `500 Internal Server Error` - Server errors

### AI Classification

#### Classify Recipe
```http
POST /api/ai/classify
Content-Type: application/json

{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": "Cooking instructions..."
}
```

**Required fields:**
- `name` (string)
- `ingredients` (array of strings, minimum 1)
- `instructions` (string, minimum 10 characters)

Response:
```json
{
  "success": true,
  "data": {
    "suggestedCuisine": "Italian",
    "suggestedDifficulty": "easy",
    "reasoning": "The recipe features traditional Italian ingredients and techniques..."
  }
}
```

**Cuisine Categories:**
Italian, Mexican, Asian, French, American, Mediterranean, Indian, Other

**Difficulty Assessment:**
- **Easy**: Simple techniques, common ingredients, < 30 min total
- **Medium**: Moderate techniques, 30-60 min total
- **Hard**: Advanced techniques, special equipment, > 60 min total

**AI Model:** GPT-4o-mini with temperature 0.3 for consistent classifications

## 🔒 Environment Variables

### Backend (`/server/.env`)

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-manager
OPENAI_API_KEY=your-openai-api-key-here
```

### Frontend (`/client/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

## 🐳 Docker Commands

Start MongoDB:
```bash
docker-compose up -d
```

Stop MongoDB:
```bash
docker-compose down
```

View MongoDB logs:
```bash
docker-compose logs -f mongodb
```

## 🧪 Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Both frontend and backend share consistent ESLint and Prettier configurations.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

Alejandro Stabile

## 🙏 Acknowledgments

- MERN Stack
- Vite
- Tailwind CSS
- TypeScript

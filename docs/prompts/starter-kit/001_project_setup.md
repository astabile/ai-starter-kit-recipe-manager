# 001: MERN Project Setup

## Context

Setting up a well-structured MERN (MongoDB, Express, React, Node.js) project from scratch requires careful consideration of directory organization, dependency management, and development workflow. A solid foundation enables faster development, easier maintenance, and smoother collaboration.

## Goal

Create a production-ready MERN stack project with proper separation of concerns, modern tooling, TypeScript support, and best practices for both frontend and backend development.

## The Prompt

```
Create a new MERN stack project with the following structure:

**Backend (Node.js + Express + MongoDB):**
- Initialize a Node.js project in /server
- Use TypeScript for type safety
- Set up Express with proper middleware (cors, helmet, compression)
- Configure MongoDB connection with Mongoose
- Create folder structure: routes/, controllers/, models/, middleware/, utils/
- Add environment variable management with dotenv
- Include error handling middleware
- Set up ESLint and Prettier for code quality
- Create a basic health check endpoint

**Frontend (React):**
- Initialize a React project in /client using Vite
- Use TypeScript for type safety
- Set up Tailwind CSS for styling
- Configure React Router for navigation
- Create folder structure: components/, pages/, hooks/, services/, utils/, types/
- Add Axios for API calls with interceptors
- Set up ESLint and Prettier matching backend config
- Create environment configuration for API URL

**Root Level:**
- Add a root package.json with workspace management
- Include concurrent script to run both frontend and backend
- Create comprehensive .gitignore
- Add README.md with setup instructions
- Include docker-compose.yml for local MongoDB

**Development Setup:**
- Frontend runs on port 3000
- Backend runs on port 5001
- MongoDB runs on port 27017
- Hot reload enabled for both environments
```

## Key Takeaway

A well-organized MERN project with clear separation between frontend and backend, TypeScript for type safety, and proper tooling configuration creates a strong foundation that accelerates development and reduces technical debt.

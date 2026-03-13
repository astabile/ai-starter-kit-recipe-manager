# AI Agent Guide - Recipe Manager

## Project Context

### Domain
This is a **Recipe Management Application** built with the MERN stack. The application allows users to manage recipes with a clean, modern interface and robust backend API.

### Goals
- Provide a production-ready foundation for recipe management
- Demonstrate MERN stack best practices with TypeScript
- Enable fast, type-safe development with excellent DX
- Maintain code quality through automated tooling

### Tech Stack
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Development**: Hot reload, ESLint, Prettier

## Development Workflow

### Branching Strategy

```
main
  └── feature/recipe-crud
  └── feature/user-auth
  └── bugfix/error-handling
  └── hotfix/production-issue
```

**Branch Naming:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Production hotfixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

**Workflow:**
1. Create feature branch from `main`
2. Make atomic commits with clear messages
3. Push and create Pull Request
4. Code review and approval
5. Merge to `main` (squash or rebase)

### Commit Conventions

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or tooling changes

**Examples:**
```bash
feat(api): add recipe CRUD endpoints
fix(frontend): resolve Tailwind CSS build issue
docs(readme): update installation instructions
test(backend): add unit tests for recipe controller
refactor(database): optimize MongoDB queries
```

**Commit Best Practices:**
- Use present tense ("add" not "added")
- Keep subject line under 72 characters
- Capitalize subject line
- No period at end of subject
- Separate subject from body with blank line
- Use body to explain what and why vs. how

## Testing Approach

### Backend Testing
**Framework**: Jest (to be added)

**Test Types:**
- **Unit Tests**: Individual functions, utilities
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Full request/response cycles

**Structure:**
```
server/src/__tests__/
├── unit/
│   ├── utils.test.ts
│   └── models.test.ts
├── integration/
│   ├── routes.test.ts
│   └── controllers.test.ts
└── e2e/
    └── api.test.ts
```

**Coverage Goals:**
- Minimum 80% code coverage
- 100% coverage for critical paths (auth, payment, etc.)

### Frontend Testing
**Framework**: Vitest + React Testing Library (to be added)

**Test Types:**
- **Unit Tests**: Hooks, utilities, components
- **Integration Tests**: Page components, forms
- **E2E Tests**: Playwright for user workflows

**Structure:**
```
client/src/__tests__/
├── components/
├── hooks/
├── utils/
└── e2e/
```

**Testing Best Practices:**
- Test behavior, not implementation
- Use data-testid for E2E selectors
- Mock external dependencies
- Keep tests fast and isolated

## Code Review Expectations

### Before Requesting Review

✅ **Checklist:**
- [ ] Code builds without errors
- [ ] Linter passes (`npm run lint`)
- [ ] Formatter applied (`npm run format`)
- [ ] Tests pass (when implemented)
- [ ] No console errors or warnings
- [ ] Environment variables documented
- [ ] README updated if needed

### Review Criteria

**Code Quality:**
- TypeScript types properly defined (no `any`)
- Functions are pure when possible
- Single Responsibility Principle followed
- DRY principle applied
- Error handling implemented

**Architecture:**
- Follows project structure conventions
- Proper separation of concerns
- Reusable components/utilities extracted
- No tight coupling

**Performance:**
- No unnecessary re-renders (React)
- Database queries optimized
- Large lists virtualized if needed
- Images optimized

**Security:**
- No sensitive data in client code
- Input validation on backend
- SQL/NoSQL injection prevented
- XSS vulnerabilities addressed

**Documentation:**
- Complex logic commented
- API endpoints documented
- TypeScript types self-documenting
- Breaking changes noted

### Review Response Time
- Small PRs (< 100 lines): 24 hours
- Medium PRs (100-500 lines): 48 hours
- Large PRs (> 500 lines): Consider breaking up

## Deployment Process

### Environments

1. **Development** (`localhost`)
   - MongoDB via Docker
   - Hot reload enabled
   - Full error stack traces

2. **Staging** (to be configured)
   - Cloud MongoDB instance
   - Production-like environment
   - Limited error details

3. **Production** (to be configured)
   - Managed MongoDB service
   - Optimized builds
   - Error logging only

### Deployment Steps

**Backend Deployment:**
```bash
# 1. Build TypeScript
npm run build --workspace=server

# 2. Set environment variables
# - PORT
# - NODE_ENV=production
# - MONGODB_URI

# 3. Start server
npm start --workspace=server
```

**Frontend Deployment:**
```bash
# 1. Build for production
npm run build --workspace=client

# 2. Serve static files
# Deploy dist/ to CDN or static hosting
```

**Docker Deployment:**
```bash
# Build images
docker build -t recipe-manager-api ./server
docker build -t recipe-manager-client ./client

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run (if any)
- [ ] Build succeeds without warnings
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place

### Rollback Procedure

If deployment fails:
1. Revert to previous Docker image/commit
2. Restore database from backup if needed
3. Update DNS/routing if necessary
4. Post incident report

## Key Documentation

### Project Files
- **[README.md](./README.md)** - Setup and usage instructions
- **[llms.txt](./llms.txt)** - Project overview for AI agents
- **[.cursorrules](./.cursorrules)** - Coding standards
- **[docker-compose.yml](./docker-compose.yml)** - Local MongoDB setup

### Backend
- **Entry Point**: `server/src/index.ts`
- **Database Config**: `server/src/config/database.ts`
- **API Routes**: `server/src/routes/`
- **Models**: `server/src/models/`

### Frontend
- **Entry Point**: `client/src/main.tsx`
- **API Client**: `client/src/services/api.ts`
- **Components**: `client/src/components/`
- **Pages**: `client/src/pages/`

### Configuration Files
- **Backend TypeScript**: `server/tsconfig.json`
- **Frontend TypeScript**: `client/tsconfig.json`, `client/tsconfig.app.json`
- **Backend ESLint**: `server/.eslintrc.json`
- **Frontend ESLint**: `client/.eslintrc.json`
- **Prettier**: `server/.prettierrc`, `client/.prettierrc`

## Agent Guidelines

### When Writing Code

1. **Always use TypeScript** - No `any` types unless absolutely necessary
2. **Follow existing patterns** - Match the style in surrounding code
3. **Write tests** - At minimum, unit tests for new functions
4. **Handle errors** - Use try/catch and proper error responses
5. **Document complex logic** - Add comments for non-obvious code
6. **Keep it DRY** - Extract reusable logic into utilities/hooks
7. **Performance matters** - Consider React re-renders and DB query efficiency

### When Refactoring

1. **Make incremental changes** - Small, focused commits
2. **Maintain backward compatibility** - Unless explicitly breaking
3. **Update tests** - Ensure existing tests still pass
4. **Document breaking changes** - Clearly note in PR description

### When Debugging

1. **Check the logs** - Server console and browser console
2. **Verify environment variables** - Especially API URLs
3. **Test API endpoints** - Use health check first
4. **Check database connection** - Verify MongoDB is running
5. **Review network requests** - Browser DevTools Network tab

### Communication

- **Ask for clarification** - Don't assume requirements
- **Explain trade-offs** - When multiple approaches exist
- **Surface blockers early** - Don't wait until the deadline
- **Share context** - Help others understand your decisions

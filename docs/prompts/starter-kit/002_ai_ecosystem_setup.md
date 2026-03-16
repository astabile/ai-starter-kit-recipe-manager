# 002: AI Ecosystem Setup

## Context

Modern AI-assisted development requires proper configuration of AI tools and documentation to provide context, establish coding standards, and enable intelligent code assistance. Files like `llms.txt`, `AGENTS.md`, `.cursorrules`, and custom skills guide AI agents to understand your project better and follow your preferred patterns.

## Goal

Configure a comprehensive AI ecosystem for your project that provides clear context, establishes coding standards, defines workflows, and creates reusable automation through custom skills.

## The Prompt

```
Set up the AI development ecosystem for my project:

**1. Create llms.txt in project root:**
- Project overview and purpose
- Technology stack details (MERN + TypeScript)
- Key architectural decisions
- Important conventions (naming, folder structure)
- Links to main entry points

**2. Create AGENTS.md in project root:**
- Project context and domain
- Development workflow (branching strategy, commit conventions)
- Testing approach (unit, integration, E2E)
- Code review expectations
- Deployment process
- Links to key documentation

**3. Create .cursorrules in project root:**
- TypeScript strict mode preferences
- React component patterns (functional components, hooks)
- API design standards (RESTful conventions)
- Error handling patterns
- Testing requirements
- Code style preferences (ESLint/Prettier alignment)
- Import organization rules

**4. Create project-specific skills in .skills/:**
- Create skill for backend testing workflow (test-backend)
- Create skill for Docker deployment (deploy-docker)
- Create skill for database seeding (db-seed)
- Each skill should follow SKILL.md format with clear trigger conditions

**Requirements:**
- All documentation should be concise but comprehensive
- Use markdown with clear sections
- Include examples where helpful
- Make it easy for AI agents to understand project context quickly
```

## Key Takeaway

A well-configured AI ecosystem (llms.txt, AGENTS.md, .cursorrules, and custom skills) dramatically improves AI agent effectiveness by providing project context, establishing standards, and automating common development tasks.

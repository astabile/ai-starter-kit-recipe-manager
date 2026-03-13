# AI Skills Cheatsheet - Recipe Manager Project

Quick reference for using global and project-specific skills in Cursor.

## 📦 Installed Skill Collections

### ✨ Superpowers (Core Development Workflows)
Location: `~/.cursor/skills/superpowers/`

### 🔧 wshobson-agents (Specialized Plugins)
Location: `~/.cursor/skills/wshobson-agents/`

### 🎯 Project Skills (Recipe Manager Specific)
Location: `.skills/`

---

## 🚀 Most-Used Superpowers Skills

### 1. **Brainstorming** 
**When to use:** Before creating any new feature or making significant changes

**Trigger phrases:**
- "Let's brainstorm how to build [feature]"
- "Help me design [feature]"
- "I want to create [feature]"

**What it does:**
- Explores requirements through questions
- Proposes multiple approaches with trade-offs
- Creates design document
- Reviews spec before implementation

---

### 2. **Test-Driven Development (TDD)**
**When to use:** Before implementing any feature or bugfix

**Trigger phrases:**
- "Use TDD to implement [feature]"
- "Write tests first for [feature]"
- "Test-driven approach for [feature]"

**What it does:**
- Writes failing tests first
- Implements minimal code to pass
- Refactors with confidence
- Ensures code coverage

---

### 3. **Systematic Debugging**
**When to use:** When encountering bugs or unexpected behavior

**Trigger phrases:**
- "Debug [issue] systematically"
- "Help me debug [error]"
- "Investigate why [behavior]"

**What it does:**
- Gathers evidence methodically
- Forms hypotheses
- Tests hypotheses systematically
- Identifies root cause
- Proposes fix with verification

---

### 4. **Writing Plans**
**When to use:** After brainstorming, before implementation

**Trigger phrases:**
- "Create an implementation plan for [feature]"
- "Write a plan for [task]"
- "Break down [feature] into tasks"

**What it does:**
- Creates detailed implementation plan
- Breaks work into phases
- Identifies dependencies
- Sets verification criteria
- Saves plan to `docs/superpowers/plans/`

---

### 5. **Executing Plans**
**When to use:** To implement a previously written plan

**Trigger phrases:**
- "Execute the plan for [feature]"
- "Implement the plan at [path]"

**What it does:**
- Reads implementation plan
- Executes each phase systematically
- Verifies completion criteria
- Updates plan status

---

### 6. **Requesting Code Review**
**When to use:** After completing a feature, before merging

**Trigger phrases:**
- "Request code review for [feature]"
- "Review my changes"
- "Check this code for issues"

**What it does:**
- Comprehensive code review
- Checks for bugs, security issues
- Validates tests and coverage
- Suggests improvements
- Provides actionable feedback

---

### 7. **Verification Before Completion**
**When to use:** Before claiming work is complete

**Trigger phrases:**
- "Verify [feature] is complete"
- "Check if tests pass"
- "Confirm everything works"

**What it does:**
- Runs verification commands
- Checks test output
- Confirms no errors
- Evidence-based validation
- Never makes claims without proof

---

### 8. **Git Worktrees**
**When to use:** When working on isolated features

**Trigger phrases:**
- "Create a worktree for [feature]"
- "Set up isolated workspace for [task]"

**What it does:**
- Creates git worktree
- Isolates work from main directory
- Manages multiple branches simultaneously

---

### 9. **Dispatching Parallel Agents**
**When to use:** For independent tasks that can run concurrently

**Trigger phrases:**
- "Use parallel agents to [tasks]"
- "Work on these tasks in parallel"

**What it does:**
- Launches multiple agents
- Coordinates parallel work
- Merges results
- Optimizes for speed

---

### 10. **Receiving Code Review**
**When to use:** When you receive review feedback

**Trigger phrases:**
- "I received this code review: [feedback]"
- "Help me address review comments"

**What it does:**
- Analyzes review feedback
- Verifies technical accuracy
- Implements valid suggestions
- Questions unclear feedback

---

## 🔧 Most-Used wshobson-agents Plugins

### Python Development

#### **python-testing-patterns**
**Trigger:** "Write pytest tests for [code]"
- pytest fixtures and patterns
- Mocking strategies
- Test organization

#### **python-type-safety**
**Trigger:** "Add type hints to [code]"
- Type annotations
- Generics and protocols
- mypy configuration

#### **python-error-handling**
**Trigger:** "Implement error handling for [code]"
- Exception hierarchies
- Input validation
- Partial failure handling

---

### Backend Development

#### **api-design-principles**
**Trigger:** "Design REST API for [resource]"
- RESTful conventions
- GraphQL patterns
- API versioning

#### **architecture-patterns**
**Trigger:** "Apply clean architecture to [module]"
- Clean Architecture
- Hexagonal Architecture
- Domain-Driven Design

#### **microservices-patterns**
**Trigger:** "Design microservices for [system]"
- Service boundaries
- Event-driven communication
- Resilience patterns

---

### Frontend Development

#### **nextjs-app-router-patterns**
**Trigger:** "Set up Next.js App Router for [feature]"
- Server Components
- Streaming and parallel routes
- Data fetching patterns

#### **react-state-management**
**Trigger:** "Implement state management with [library]"
- Redux Toolkit
- Zustand patterns
- React Query

#### **tailwind-design-system**
**Trigger:** "Create design system with Tailwind"
- Design tokens
- Component libraries
- Theme configuration

---

### Kubernetes & DevOps

#### **k8s-manifest-generator**
**Trigger:** "Create Kubernetes manifests for [app]"
- Deployments and Services
- ConfigMaps and Secrets
- Production-grade configs

#### **helm-chart-scaffolding**
**Trigger:** "Create Helm chart for [app]"
- Chart structure
- Values and templates
- Best practices

#### **gitops-workflow**
**Trigger:** "Set up GitOps with ArgoCD"
- ArgoCD configuration
- Flux patterns
- Declarative deployments

---

### Security

#### **stride-analysis-patterns**
**Trigger:** "Perform STRIDE analysis on [system]"
- Threat modeling
- Security assessment
- Mitigation strategies

#### **sast-configuration**
**Trigger:** "Set up SAST scanning for [project]"
- Static analysis tools
- Security scanning automation
- Vulnerability detection

---

### Observability

#### **prometheus-configuration**
**Trigger:** "Set up Prometheus monitoring"
- Metrics collection
- Alerting rules
- Service monitoring

#### **grafana-dashboards**
**Trigger:** "Create Grafana dashboard for [metrics]"
- Dashboard design
- Visualization best practices
- Real-time monitoring

#### **distributed-tracing**
**Trigger:** "Implement distributed tracing with Jaeger"
- Tracing setup
- Request flow analysis
- Performance debugging

---

### LLM Development

#### **rag-implementation**
**Trigger:** "Build RAG system for [use case]"
- Vector databases
- Retrieval strategies
- LangChain integration

#### **prompt-engineering-patterns**
**Trigger:** "Optimize prompts for [task]"
- Advanced prompt techniques
- Few-shot learning
- Chain-of-thought prompting

#### **langchain-architecture**
**Trigger:** "Design LangChain application for [feature]"
- Agent design
- Memory patterns
- Tool integration

---

## 🎯 Project-Specific Skills

These skills are specific to this Recipe Manager project:

### **test-backend**
**Trigger:** "Test the backend" or "Run backend tests"
- Jest setup and configuration
- Unit and integration tests
- API endpoint testing
- Test coverage reporting

### **deploy-docker**
**Trigger:** "Deploy with Docker" or "Create Docker deployment"
- Dockerfile creation
- Docker Compose setup
- Production deployment
- Container optimization

### **db-seed**
**Trigger:** "Seed the database" or "Generate sample data"
- MongoDB seeding
- Sample recipe data
- Dynamic data generation
- Test database setup

---

## 💡 Pro Tips

### Combining Skills
You can chain skills together:

```
1. "Use brainstorming to design a recipe rating system"
   → Creates design doc

2. "Write a plan to implement the rating system"
   → Creates implementation plan

3. "Execute the plan using TDD"
   → Implements with tests first

4. "Request code review"
   → Reviews implementation

5. "Verify the rating system is complete"
   → Confirms everything works
```

### Skill Selection
The AI automatically selects appropriate skills based on your request. You can also explicitly request a skill:

```
"Use the python-testing-patterns skill to test this function"
"Apply the api-design-principles skill to design this endpoint"
```

### When to Use Which Skill

**Starting a new feature:**
1. Brainstorming → Design
2. Writing Plans → Implementation plan
3. Test-Driven Development → Implementation
4. Verification → Confirm completion
5. Requesting Code Review → Quality check

**Fixing a bug:**
1. Systematic Debugging → Root cause
2. Test-Driven Development → Fix with tests
3. Verification → Confirm fix works

**Refactoring code:**
1. Brainstorming → Refactoring approach
2. Writing Plans → Refactoring plan
3. Execute with tests → Safe refactoring
4. Requesting Code Review → Validate changes

---

## 📚 Updating Skills

Keep skills up to date:

```bash
# Update Superpowers
cd ~/.cursor/skills/superpowers && git pull

# Update wshobson-agents
cd ~/.cursor/skills/wshobson-agents && git pull
```

Update frequency: Weekly or monthly

---

## 🔍 Finding More Skills

### List all available skills:
```bash
# Superpowers skills
ls ~/.cursor/skills/superpowers/skills/

# wshobson-agents plugins
ls ~/.cursor/skills/wshobson-agents/plugins/

# Project skills
ls .skills/
```

### Read skill documentation:
```bash
# Read a specific skill
cat ~/.cursor/skills/superpowers/skills/brainstorming/SKILL.md
cat ~/.cursor/skills/wshobson-agents/plugins/python-development/skills/python-testing-patterns/SKILL.md
cat .skills/test-backend/SKILL.md
```

### In Cursor:
Start a new chat and ask:
- "What skills do you have available?"
- "List all Python-related skills"
- "What skills can help with testing?"

---

## 📝 Creating Custom Skills

To create project-specific skills:

1. Create skill directory:
   ```bash
   mkdir -p .skills/my-skill
   ```

2. Create SKILL.md:
   ```markdown
   ---
   name: my-skill
   description: What this skill does
   ---
   
   # My Skill
   
   ## When to Use
   Use when...
   
   ## Steps
   1. Step 1
   2. Step 2
   ```

3. Use the skill:
   ```
   "Use my-skill to [task]"
   ```

---

## 🎓 Learning Resources

- **Superpowers Docs**: Check `~/.cursor/skills/superpowers/README.md`
- **wshobson-agents Docs**: Check `~/.cursor/skills/wshobson-agents/README.md`
- **Skill Templates**: See `~/.cursor/skills/superpowers/skills/writing-skills/`

---

## 🆘 Troubleshooting

### Skills not appearing?
1. Restart Cursor
2. Reload window (Cmd/Ctrl + Shift + P → "Reload Window")
3. Check installation:
   ```bash
   ls ~/.cursor/skills/
   ```

### Skill not working as expected?
1. Read the skill's SKILL.md file
2. Check trigger conditions
3. Update the skill repository
4. Report issues to skill repository

### Want to disable a skill?
1. Navigate to skill directory
2. Rename SKILL.md to SKILL.md.disabled

---

**Last Updated:** March 13, 2026

**Skill Collections:**
- ✅ Superpowers (v1.x) - Core workflows
- ✅ wshobson-agents (latest) - Specialized plugins  
- ✅ Project Skills - Recipe Manager specific

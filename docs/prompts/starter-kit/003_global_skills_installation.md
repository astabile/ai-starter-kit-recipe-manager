# 003: Global Skills Installation

## Context

Global skills provide reusable capabilities across all projects in Cursor. Two essential skill collections are **Superpowers** (TDD, systematic debugging, planning, code review) and **wshobson/agents** (comprehensive plugin library for Python, backend, frontend, security, and more). These skills transform Cursor into a production-grade development environment.

## Goal

Install and configure global skill collections that provide professional development workflows, best practices, and specialized capabilities across all your Cursor projects.

## The Prompt

```
Install global skills for Cursor:

**1. Install Superpowers skill collection:**
```bash
cd ~/.cursor/skills
git clone https://github.com/Superpowers-Corp/superpowers.git
```

This provides:
- Test-driven development workflow
- Systematic debugging methodology
- Writing and executing plans
- Code review requesting and receiving
- Verification before completion
- Git worktree management
- Parallel agent dispatching

**2. Install wshobson/agents skill collection:**
```bash
cd ~/.cursor/skills
git clone https://github.com/wshobson/agents.git wshobson-agents
```

This provides plugins for:
- Python development (testing, async, type safety, error handling)
- Backend development (architecture, microservices, CQRS)
- Frontend/mobile (React, Next.js, React Native, Tailwind)
- Kubernetes operations (Helm, GitOps, security policies)
- LLM application development (RAG, LangChain, embeddings)
- Security scanning (SAST, STRIDE, threat modeling)
- Observability (Prometheus, Grafana, distributed tracing)
- And many more specialized domains

**3. Verify installation:**
- Restart Cursor or reload window
- Start a new chat and ask "What skills do you have available?"
- Confirm both collections appear in the agent skills list

**4. Create a skill usage cheatsheet in your project:**
Create `docs/ai-skills-cheatsheet.md` listing your most-used skills with trigger phrases

**Note:**
- Skills are automatically available in all Cursor projects
- Update skills periodically with `git pull` in each repository
- Create project-specific skills in `.cursor/skills/` for custom workflows
```

## Key Takeaway

Global skills transform Cursor from a code editor into a comprehensive development environment with professional workflows, best practices, and specialized capabilities that work across all your projects. The Superpowers and wshobson/agents collections provide battle-tested patterns for virtually every development scenario.

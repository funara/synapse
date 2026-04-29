---
name: init
description: Entry point. Explains available skills, bootstraps CLAUDE.md if missing.
---

# Synapse Init

Welcome to Synapse. This is the entry point for initializing the repository and explaining available skills.

## Available Skills
- `init`: Bootstraps the repo.
- `spec`: Design, acceptance criteria, task decomposition (The only human approval gate).
- `build`: Autonomous code generation.
- `test`: Autonomous testing.
- `review`: Autonomous code review and auto-fixing.
- `debug`: Systematic debugging.
- `learn`: Distill lessons to memory.

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands (e.g., `git diff`, `git status`). The human owns git state.

## Core Powers & References
When initializing the workspace, you must be aware of the following capabilities:
- **Tool Capabilities:** Read `skills/init/references/codex-tools.md` or `skills/init/references/gemini-tools.md` for advanced tooling usage.
- **Repository Memory:** Read `skills/init/references/bootstrap-repository-memory.md` to understand how to correctly bootstrap memory.

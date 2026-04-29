---
name: build
description: Implements code from spec steps. Dispatches coder/tester/optimizer agents. Fully autonomous.
---

# Build Execution

## Purpose
Fully autonomous implementation of code based on spec steps. Dispatches `agent-coder`, `agent-tester`, and `agent-optimizer`.

## Interaction Rule
**FULLY AUTONOMOUS.** Zero user prompts. Do not ask for permission to apply fixes or proceed to the next step. Only stop for an unrecoverable blocker.

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands.

## Core Powers & References
When writing implementation and testing logic, you must strictly consult these anti-patterns and defensive strategies:
- **Testing Anti-Patterns:** Read `skills/build/references/testing-anti-patterns.md` to prevent test flakiness.
- **Defense in Depth:** Read `skills/build/references/defense-in-depth.md` to build robust code.
- **Execution Strategy:** Read `skills/build/references/plan-document-reviewer-prompt.md` to evaluate your approach.

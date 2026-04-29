---
name: review
description: Runs git diff, agent-reviewer grades it, auto-applies ALL findings without asking, re-tests. Fully autonomous.
---

# Code Review

## Purpose
Runs `git diff`, sends the diff to `agent-reviewer` for grading against the spec, auto-applies ALL findings (CRITICAL, WARNING, SUGGESTION) without asking, and re-tests.

## Interaction Rule
**FULLY AUTONOMOUS.** Zero user prompts. You MUST auto-apply every single finding without asking the user.

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands like `git diff`.

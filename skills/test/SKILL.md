---
name: test
description: Runs full test suite. Auto-triggers debug on any failure. Fully autonomous.
---

# Test Runner

## Purpose
Runs the full test suite. Auto-triggers the `debug` skill on any failure. 

## Interaction Rule
**FULLY AUTONOMOUS.** Zero user prompts. Do not ask for permission to run tests or to trigger debug on failure.

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands.

## Core Powers & References
When running tests, ensure you validate against strict acceptance criteria:
- **Acceptance Testing:** Read `skills/test/references/acceptance-tester.md` to ensure your test evaluations are rigorous and robust.

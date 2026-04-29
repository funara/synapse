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

---

## Dispatch Decision Tree

Use this table to decide which agent to dispatch. Apply the FIRST matching rule.

| Situation | Dispatch |
|-----------|----------|
| Executing a task from an approved plan | `agent-coder` |
| Code quality issues (naming, duplication, dead code, over-complexity) flagged by review | `agent-optimizer` |
| Test is failing AND root cause is unknown | `agent-debugger` |
| Test is failing AND root cause is known (clear fix from plan/review) | `agent-coder` |
| Verifying acceptance criteria after review is complete | `agent-tester` |
| Distilling lessons, bootstrapping memory, curating knowledge | `agent-admin` |

**Never dispatch `agent-optimizer` for logic/behavior changes** — those go to `agent-coder`.
**Never dispatch `agent-coder` for unknown failures** — always investigate with `agent-debugger` first.

---

## Execution Order per Task

For each task in the plan, follow this sequence:

1. **Dispatch `agent-coder`** — implement the task using TDD (Red → Green → Refactor)
2. **If coder returns COMPLETE:** dispatch `agent-optimizer` only if `agent-reviewer` later flags Important code quality issues
3. **If coder returns BLOCKED:** see Escalation Policy below

---

## Escalation Policy

When a subagent returns BLOCKED or FAIL, apply this chain in order:

| State | Action |
|-------|--------|
| `agent-coder` BLOCKED (unclear spec/missing dependency) | Dispatch `agent-debugger` to investigate root cause |
| `agent-debugger` returns FIXED | Re-dispatch `agent-coder` on the original task |
| `agent-debugger` returns ARCHITECTURAL BLOCKER | **Stop. Surface to human. Do not attempt further dispatch.** |
| `agent-debugger` returns BLOCKED (investigation) | **Stop. Surface to human with full findings.** |
| `agent-tester` FAIL (≥1 criterion failing) | Dispatch `agent-coder` with the Fix Task Block from the tester report |
| `agent-optimizer` BLOCKED (suite not green) | Dispatch `agent-debugger` before retrying optimization |

**Maximum 3 debugger→coder cycles per task.** After 3 failed cycles, stop and surface to human as unrecoverable.

---

## Core Powers & References
When writing implementation and testing logic, you must strictly consult these anti-patterns and defensive strategies:
- **Testing Anti-Patterns:** Read `skills/build/references/testing-anti-patterns.md` to prevent test flakiness.
- **Defense in Depth:** Read `skills/build/references/defense-in-depth.md` to build robust code.
- **Execution Strategy:** Read `skills/build/references/plan-document-reviewer-prompt.md` to evaluate your approach.

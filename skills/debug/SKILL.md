---
name: debug
description: Systematic 4-phase: reproduce → isolate → fix → verify. Auto-triggered or manual.
---

# Systematic Debugging

## Purpose
Executes the systematic 4-phase debugging process:
1. Reproduce
2. Isolate
3. Fix
4. Verify

<CRITICAL_RULE>
**MANDATORY VERIFICATION:** Once a fix has been applied, you **MUST** trigger the `test` skill to verify the fix across the entire suite. Do NOT rely solely on manual verification or partial test runs.
</CRITICAL_RULE>

## Interaction Rule
Can be auto-triggered by the `test` or `build` skills, or triggered manually by the user.

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands.

## Core Powers & References
When diagnosing issues, you MUST consult these advanced debugging techniques:
- **Root Cause Tracing:** Read `skills/debug/references/root-cause-tracing.md`
- **Defense in Depth:** Read `skills/debug/references/defense-in-depth.md`
- **Condition-Based Waiting:** Read `skills/debug/references/condition-based-waiting.md`
- **Find Polluter Scripts:** Use `skills/debug/references/find-polluter.sh` as a template for isolating flaky tests.

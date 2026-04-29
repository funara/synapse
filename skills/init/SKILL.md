---
name: init
description: Entry point. Explains available skills, bootstraps CLAUDE.md if missing, and runs constitution setup if no project context exists.
---

# Synapse Init

Welcome to Synapse. This is the entry point for initializing the repository and explaining available skills.

## Available Skills
- `init`: Bootstraps the repo and runs one-time project constitution setup.
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

---

## Constitution Bootstrap

<CRITICAL_RULE>
**MANDATORY CHECK ON EVERY INIT:** After explaining available skills, you MUST check whether `docs/synapse/memory/context.md` exists.

- If it **exists**: Read it silently. Confirm to the user: "Project context loaded." Then stop. Do NOT re-run constitution setup.
- If it **does NOT exist**: You MUST run the Constitution Setup sequence below before this skill ends. Do NOT skip it. Do NOT proceed to any other skill until `docs/synapse/memory/context.md` has been written and confirmed by the human.
</CRITICAL_RULE>

### Constitution Setup Sequence

Run this sequence only when `docs/synapse/memory/context.md` does not exist.

1. Say EXACTLY this to the user:

   > "This project has no context file yet. I need to capture your project's governing rules before we begin — this takes about 2 minutes and only happens once. I'll ask you a few questions."

2. Ask the following questions **one at a time**, waiting for each answer before asking the next:

   **Q1:** "What is the primary tech stack for this project? (e.g., language, frameworks, runtime)"

   **Q2:** "What test framework do you use, and what is your minimum acceptable coverage threshold?"

   **Q3:** "Are there any naming conventions, folder structure rules, or architectural patterns I must follow?"

   **Q4:** "Are there any dependencies, patterns, or approaches that are explicitly forbidden in this project?"

   **Q5:** "Any performance, security, or compliance requirements I must always respect?"

3. After all five answers are collected, write `docs/synapse/memory/context.md` using this exact structure:

```
# Project Context
Generated: <ISO 8601 date>

## Tech Stack
<answer from Q1>

## Test Standards
Framework: <test framework from Q2>
Minimum Coverage: <coverage threshold from Q2>

## Conventions
<answer from Q3>

## Forbidden Patterns
<answer from Q4>

## Constraints
<answer from Q5>

## Iron Laws (Synapse)
- No production code without a failing test first.
- No fix without root cause investigation. Use the debug skill.
- No mutating git commands. The human owns git state.
```

4. After writing the file, say EXACTLY this and WAIT for confirmation:

   > "Context written to `docs/synapse/memory/context.md`. Please review it and say 'confirmed' to proceed, or tell me what to change."

5. If the user requests changes, update the file and repeat step 4. Do NOT proceed until the user says "confirmed".

6. Once confirmed, say: "Project context locked. All Synapse skills will now reference this file."

---

## Context Consumption Rule (All Skills)

<CRITICAL_RULE>
**Every Synapse skill — spec, build, test, review, debug, learn — MUST read `docs/synapse/memory/context.md` at the start of execution if the file exists.** The context file is the authoritative source for tech stack, test standards, naming conventions, forbidden patterns, and constraints. No skill may make assumptions about the project that contradict or ignore this file.
</CRITICAL_RULE>
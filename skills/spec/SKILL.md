---
name: spec
description: Design + acceptance criteria + task decomposition + file map.
---

# Spec Generation

## Purpose
Produces design docs, acceptance criteria, task decomposition, and file maps. This is the ONLY skill that asks the user a question before proceeding.

---

## Pre-Flight: Load Project Context

<CRITICAL_RULE>
**MANDATORY FIRST STEP:** Before generating any spec, you MUST check for `docs/synapse/memory/context.md`.

- If it **exists**: Read it fully and silently. All spec decisions — tech stack choices, naming conventions, forbidden patterns, test structure, and constraints — MUST be consistent with this file. If the user's request conflicts with a constraint in `context.md`, flag the conflict before writing the spec.
- If it **does NOT exist**: Stop immediately. Say EXACTLY this:

  > "No project context found. Please run the `init` skill first to set up your project context. This ensures the spec respects your tech stack, conventions, and constraints."

  Do NOT generate any spec until `docs/synapse/memory/context.md` exists.
</CRITICAL_RULE>

---

## Visual Companion
A browser-based companion for showing mockups, diagrams, and visual options during spec generation.

<CRITICAL_RULE>
**MANDATORY TRIGGER:** Whenever the user requests a "redesign", "UI update", or anything involving visual layout, you **MUST** offer the Visual Companion BEFORE writing any specs.

Say EXACTLY this and WAIT for their response:
> "Some of the design might be easier to explain if I can show it to you in a web browser. I can put together mockups and diagrams as we go. Want to try the Visual Companion? (Requires opening a local URL)"

Do NOT skip this question. Do NOT immediately generate the spec.
If they agree, read `skills/spec/visual-companion.md` and start the server. 
**IMPORTANT:** The server script `serve.js` is in `skills/spec/scripts/serve.js`. Do NOT use relative paths like `src/scripts/serve.js` as they will fail. Always use an absolute path found by exploring the filesystem if necessary.
</CRITICAL_RULE>

---

## Interaction Rule
The ONLY time you are allowed to invoke the `build` skill is after you have generated the final text spec and received explicit, unequivocal approval from the human in the terminal.

1. **A selection in the Visual Companion is NOT an approval to build.** It is only a design choice.
2. Allow the user to iterate in the Visual Companion as long as they need. Do NOT ask for spec approval until they explicitly say they are satisfied with the design. Once the design is finalized, present the text spec, steps, and acceptance criteria.
3. Then, you must ask EXACTLY ONCE: **"Spec complete. Approve and build?"**
4. You MUST STOP AND WAIT. Do NOT auto-invoke `build`.
5. Only if the user explicitly says "yes" or "approve" in the terminal may you invoke `build`. Before invoking `build`, you MUST kill the Visual Companion server process if it is running.

---

## Strict Git Rules
1. **Never execute mutating git commands.** Do not use `git add`, `git commit`, `git worktree`, `git stash`, `git branch`, `git merge`, or `git rebase`.
2. You are restricted to read-only git commands.

---

## Core Powers & References
When generating specs and designs, you must leverage the following deep writing skills:
- **Best Practices:** Read `skills/spec/references/anthropic-best-practices.md`.
- **Persuasion Principles:** Read `skills/spec/references/persuasion-principles.md` for framing arguments.
- **Graphing/Diagrams:** Consult `skills/spec/references/graphviz-conventions.dot` and `render-graphs.js` for architectural diagrams.
- **Project Context:** `docs/synapse/memory/context.md` (loaded in pre-flight above — authoritative for all project constraints).
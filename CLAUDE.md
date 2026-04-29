# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

**Synapse** is a workflow skill library for AI coding agents (Claude Code, Codex, OpenCode, Gemini CLI). It implements a unified design → build → test → review workflow. This is not a buildable application — it's a collection of skill modules (each a directory with a `SKILL.md`) that are installed into agent environments via symlinks or plugin installers.

## Running Tests

```bash
# Run all fast skill tests
tests/claude-code/run-skill-tests.sh

# Run integration tests (10-30 min)
tests/claude-code/run-skill-tests.sh --integration

# Run a single test
tests/claude-code/run-skill-tests.sh --test test-executing-plans.sh

# Verbose output
tests/claude-code/run-skill-tests.sh --verbose
```

Tests are bash scripts under `tests/claude-code/`. See `docs/testing.md` for the full guide.

## Architecture

### Skill Structure

Each skill lives in `skills/<skill-name>/` and contains:
- `SKILL.md` — the instruction document loaded by the agent (frontmatter: `name`, `description`)
- Optional `references/`, `examples/`, scripts

Skills are the unit of deployment. When a user installs synapse, the `skills/` directory gets symlinked/copied into their agent's skill path.

### Core Workflow Skills (in order)

The workflow enforces a strict progression:

1. **init** — Entry point. Explains available skills, bootstraps CLAUDE.md if missing.
2. **spec** — Design + acceptance criteria + task decomposition + file map. THE ONLY HUMAN APPROVAL GATE.
3. **build** — Implements code from spec steps. Dispatches coder/tester/optimizer agents. Fully autonomous.
4. **test** — Runs full test suite. Auto-triggers debug on any failure. Fully autonomous.
5. **review** — Runs git diff, agent-reviewer grades it, auto-applies ALL findings without asking, re-tests. Fully autonomous.
6. **debug** — Systematic 4-phase: reproduce → isolate → fix → verify. Auto-triggered or manual.
7. **learn** — Distill session lessons, update CLAUDE.md. User-triggered.

### Execution Model

`build` is the central router:
- Main agent orchestrates; ALL implementation goes to subagents (context preservation principle)
- Subagents default to lower-capability models (Haiku/Flash), upgraded only on failure
- Task granularity: each task = one RED-GREEN-REFACTOR cycle (~2-5 min)
- Code quality cleanup (naming, duplication, dead code, optimization) → `agent-reviewer` / `agent-optimizer`
- Logic/behavior fixes → `agent-coder`
- Root cause investigation → `agent-debugger`

### Plugin Infrastructure

Each platform has its own integration:
- `.claude-plugin/` — Claude Code (install via `install.sh`)
- `.codex/` — Codex App (see `.codex/INSTALL.md`)
- `.opencode/` — OpenCode (see `.opencode/INSTALL.md`)
- `.cursor-plugin/` — Cursor
- `hooks/hooks.json` — Claude Code hook definitions (SessionStart fires `init`)
- `gemini-extension.json` — Gemini CLI extension manifest

### Documentation Layout

- `docs/synapse/specs/YYYY-MM-DD-<topic>-design.md` — design specifications
- `docs/synapse/plans/YYYY-MM-DD-<feature>.md` — implementation plans
- `docs/synapse/reuse/` — reusable component docs
- `RELEASE-NOTES.md` — detailed version history

## Adding or Modifying Skills

When creating a new skill, use the `writing-skills` skill — it enforces the correct SKILL.md format and validates the skill before deployment. The frontmatter fields (`name`, `description`) must match what gets registered in the agent's skill index.

When modifying an existing skill's behavior, check `tests/claude-code/` for a corresponding test file and run it after changes.

## Key Conventions

- **Iron Law (TDD):** If production code exists without a failing test, delete it and start fresh.
- **Iron Law (Debugging):** No fixes without root cause investigation. Use `debug` before proposing any fix.
- **Self-review:** Skills use inline checklists (not subagent review loops) — faster and sufficient for most changes.
- **Commits:** Granular, after each RED-GREEN-REFACTOR cycle. Do NOT use mutating git commands inside skills.
- **Plans:** Stored in `docs/synapse/plans/` following the date-prefixed naming convention.
- **Comment policy (`agent-optimizer`):** The optimizer removes ALL inline comments, block comments, and docstrings — including on public APIs. This is intentional: code must explain itself through names and structure. If you need generated API docs, set up a doc-gen tool (e.g., JSDoc, typedoc, pydoc) before using the optimizer on a public interface.

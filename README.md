# Synapse

Synapse is an enhanced workflow capability layer for coding agent environments (such as Gemini CLI, Claude Code, Codex, OpenCode, and Cursor). It preserves the strict "design → plan → execute → verify" lifecycle while unifying execution routing, subagent context control, and installation entry points within a single, self-contained system.

## Supported Platforms & Installation

Synapse provides native integrations and plugin infrastructures for multiple AI coding environments. See the platform-specific guides for installation instructions:

- **Gemini CLI**: Managed via `gemini-extension.json`. See [GEMINI.md](GEMINI.md).
- **Claude Code**: Handled via `.claude-plugin/`.
- **OpenCode**: Native JavaScript plugin. See [docs/README.opencode.md](docs/README.opencode.md).
- **Codex App**: See [docs/README.codex.md](docs/README.codex.md).
- **Cursor**: Supported via `.cursor-plugin/`.

## Architecture & Workflow

Synapse operates through a unified suite of core workflow skills. The workflow enforces a strict progression:

1. **init** — Entry point. Explains available skills and bootstraps environment context.
2. **spec** — Design + acceptance criteria + task decomposition + file map. This is the **ONLY HUMAN APPROVAL GATE**.
3. **build** — Implements code from spec steps. Fully autonomous routing to coder/tester subagents.
4. **test** — Runs the full test suite. Auto-triggers debug on any failure. Fully autonomous.
5. **review** — Runs `git diff`, grades the implementation, and auto-applies findings. Fully autonomous.
6. **debug** — Systematic 4-phase debugging (reproduce → isolate → fix → verify). Auto-triggered or manual.
7. **learn** — Distills session lessons and updates agent instructions. User-triggered.

### Skill Structure

Each skill lives in `skills/<skill-name>/` and contains a `SKILL.md` file (the instruction document loaded by the agent), along with optional scripts, references, and examples.

## Key Conventions

- **Iron Law (TDD):** If production code exists without a failing test, delete it and start fresh.
- **Iron Law (Debugging):** No fixes without root cause investigation. Use the `debug` skill before proposing any fix.
- **Commits:** Stay granular after each RED-GREEN-REFACTOR cycle. Do NOT use mutating git commands inside skills.
- **Plans:** Implementation plans are generated and stored in `docs/synapse/plans/` using a date-prefixed naming convention.

## Project Structure

This repository is documentation- and skill-first. 
- Core skills: `skills/<skill-name>/SKILL.md`
- Command entry docs: `commands/`
- Long-form design and execution records: `docs/synapse/specs/` and `docs/synapse/plans/`
- Tests are grouped by environment in `tests/`

## Testing Guidelines

There is no single build pipeline at the repo root. Validate the part you changed:
- `bash tests/claude-code/run-skill-tests.sh`: run the default Claude Code skill checks.
- `bash tests/opencode/run-tests.sh`: run the default OpenCode plugin checks.
- `bash tests/skill-triggering/run-all.sh`: verify skill auto-triggering prompts.

## Contributing

Add or update tests in the nearest relevant suite to the changed surface area. Recent history uses Conventional Commit-style prefixes (`feat:`, `refactor:`, `docs:`). Keep subjects short and imperative, and scope them to one logical change. PRs should explain the affected skill or platform.

For more agent-specific notes, refer to [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md).

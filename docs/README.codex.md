# Synapse for Codex

Guide for using Synapse with OpenAI Codex via native skill discovery.

## Quick Install

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/funara/synapse/refs/heads/main/.codex/INSTALL.md
```

## Manual Installation

### Prerequisites

- OpenAI Codex CLI
- Git

### Steps

1. Clone the repo:
   ```bash
   git clone https://github.com/funara/synapse.git ~/.codex/synapse
   ```

2. Create the skills symlink:
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/synapse/skills ~/.agents/skills/synapse
   ```

3. Restart Codex.

4. **For multi-agent execution** (optional): Skills like `dispatching-parallel-agents` and `executing-plans` benefit from Codex's multi-agent feature. Add to your Codex config:
   ```toml
   [features]
   multi_agent = true
   ```

### Windows

Use a junction instead of a symlink (works without Developer Mode):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\synapse" "$env:USERPROFILE\.codex\synapse\skills"
```

## How It Works

Codex has native skill discovery â€” it scans `~/.agents/skills/` at startup, parses SKILL.md frontmatter, and loads skills on demand. Synapse skills are made visible through a single symlink:

```
~/.agents/skills/synapse/ â†’ ~/.codex/synapse/skills/
```

The `using-synapse` skill is discovered automatically and enforces skill usage discipline â€” no additional configuration needed.

## Usage

Skills are discovered automatically. Codex activates them when:
- You mention a skill by name (e.g., "use brainstorming")
- The task matches a skill's description
- The `using-synapse` skill directs Codex to use one

### Personal Skills

Create your own skills in `~/.agents/skills/`:

```bash
mkdir -p ~/.agents/skills/my-skill
```

Create `~/.agents/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

The `description` field is how Codex decides when to activate a skill automatically — write it as a clear trigger condition.

## Updating

```bash
cd ~/.codex/synapse && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/synapse
```

**Windows (PowerShell):**
```powershell
Remove-Item "$env:USERPROFILE\.agents\skills\synapse"
```

Optionally delete the clone: `rm -rf ~/.codex/synapse` (Windows: `Remove-Item -Recurse -Force "$env:USERPROFILE\.codex\synapse"`).

## Troubleshooting

### Skills not showing up

1. Verify the symlink: `ls -la ~/.agents/skills/synapse`
2. Check skills exist: `ls ~/.codex/synapse/skills`
3. Restart Codex â€” skills are discovered at startup

### Windows junction issues

Junctions normally work without special permissions. If creation fails, try running PowerShell as administrator.

## Getting Help

- Report issues: https://github.com/funara/synapse/issues
- Main documentation: https://github.com/funara/synapse

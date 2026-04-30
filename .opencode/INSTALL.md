# Installing Synapse for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add synapse to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["synapse@git+https://github.com/funara/synapse.git"]
}
```

Restart OpenCode. That's it â€” the plugin auto-installs and registers all skills.

Verify by asking: "Tell me about your synapse"

## Migrating from the old symlink-based install

If you previously installed synapse using `git clone` and symlinks, remove the old setup:

```bash
# Remove old symlinks
rm -f ~/.config/opencode/plugins/synapse.js
rm -rf ~/.config/opencode/skills/synapse

# Optionally remove the cloned repo
rm -rf ~/.config/opencode/synapse

# Remove skills.paths from opencode.json if you added one for synapse
```

Then follow the installation steps above.

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to list skills
use skill tool to load synapse/spec
```

## Updating

Synapse updates automatically when you restart OpenCode.

To pin a specific version:

```json
{
  "plugin": ["synapse@git+https://github.com/funara/synapse.git#main"]
}
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i synapse`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)

### Tool mapping

When skills reference Claude Code tools:
- `TodoWrite` -> `todowrite`
- `Task` with subagents -> `@mention` syntax
- `Skill` tool -> OpenCode's native `skill` tool
- File operations -> your native tools

## Getting Help

- Report issues: https://github.com/funara/synapse/issues
- Full documentation: https://github.com/funara/synapse/blob/main/docs/README.opencode.md

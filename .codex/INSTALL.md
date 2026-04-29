# Installing Synapse for Codex

Enable Synapse skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the synapse repository:**
   ```bash
   git clone https://github.com/xhyqaq/synapse.git ~/.codex/synapse
   ```

2. **Create the skills symlink:**
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/synapse/skills ~/.agents/skills/synapse
   ```

   **Windows (PowerShell):**
   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\synapse" "$env:USERPROFILE\.codex\synapse\skills"
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Migrating from old bootstrap

If you installed synapse before native skill discovery, you need to:

1. **Update the repo:**
   ```bash
   cd ~/.codex/synapse && git pull
   ```

2. **Create the skills symlink** (step 2 above) â€” this is the new discovery mechanism.

3. **Remove the old bootstrap block** from `~/.codex/AGENTS.md` â€” any block referencing `synapse-codex bootstrap` is no longer needed.

4. **Restart Codex.**

## Verify

```bash
ls -la ~/.agents/skills/synapse
```

You should see a symlink (or junction on Windows) pointing to your Synapse skills directory.

## Updating

```bash
cd ~/.codex/synapse && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/synapse
```

Optionally delete the clone: `rm -rf ~/.codex/synapse`.

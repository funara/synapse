# Synapse Visual Companion Guide

Browser-based visual spec companion for showing mockups, diagrams, and options.

## When to Use

Decide per-question, not per-session. The test: **would the user understand this better by seeing it than reading it?**

**Use the browser** when the content itself is visual:
- **UI mockups** — wireframes, layouts, navigation structures, component designs
- **Architecture diagrams** — system components, data flow, relationship maps
- **Side-by-side visual comparisons** — comparing two layouts, two color schemes, two design directions

**Use the terminal** when the content is text or tabular:
- **Requirements and scope questions** — "what does X mean?", "which features are in scope?"
- **Conceptual choices** — picking between approaches described in words

## Starting a Session

Start the visual server in the background using your execution tools.
Because this is an extension, you must run it from the extension mount path:

```bash
node .gemini/extensions/synapse/skills/spec/scripts/serve.js
```

Save `screen_dir` and `state_dir` from the stdout JSON response. Tell user to open the URL.
**Note:** Ensure you run it as an async background task so the server survives across your turns. 

## The Loop

1. **Check server is alive**, then **write an `.html` file** to `screen_dir`.
   - **The file MUST end in `.html`** — e.g. `platform.html`, `visual-style.html`, `layout.html`.
   - **The file MUST contain HTML markup** (tags like `<div>`, `<h2>`, `<p>`). Never write JSON, plain text, or any other format — the server only detects `.html` files.
   - **Never reuse filenames** — each screen gets a fresh file.
   - Server automatically serves the newest `.html` file and broadcasts a reload to the browser.

2. **Immediately self-verify after writing:**
   Confirm the file exists in `screen_dir` and has a `.html` extension before ending your turn:
   ```bash
   # Windows
   dir "<screen_dir>\*.html"
   # macOS / Linux
   ls "<screen_dir>"/*.html
   ```
   If no `.html` file appears, you wrote the wrong format or path. Correct it before continuing.

3. **Tell user what to expect and end your turn:**
   - Remind them of the URL.
   - Give a brief text summary of what's on screen.
   - Ask them to respond in the terminal: "Take a look and let me know what you think. Click to select an option if you'd like."

4. **On your next turn** — after the user responds in the terminal:
   - Read `$STATE_DIR/events` if it exists — this contains the user's browser interactions (clicks, selections) as JSON lines.
   - Iterate or advance based on feedback.

5. **Iterate until the user explicitly states they are satisfied.** Do NOT try to rush to the final spec approval while the user is still iterating in the visual companion. Only proceed to spec approval when the user explicitly indicates they are done with the visual design.

## Ending a Session

When the spec is finalized and the user approves the build, you MUST kill the visual companion server process. Do not leave it running in the background.

## Writing Content Fragments

Write just the content that goes inside the page. 

**CRITICAL RULE:** Do NOT wrap your content in `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` tags! Do NOT write your own `<style>`. The server automatically injects your content into a pre-styled Synapse theme frame. If you output a full HTML document, it will break the rendering pipeline!

**Options (A/B/C choices)**
```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Single Column</h3>
      <p>Clean, focused reading experience</p>
    </div>
  </div>
</div>
```

**Cards (visual designs)**
```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"><!-- mockup content --></div>
    <div class="card-body">
      <h3>Name</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

**Mockup container**
```html
<div class="mockup">
  <div class="mockup-header">Preview: Dashboard Layout</div>
  <div class="mockup-body"><!-- your mockup HTML --></div>
</div>
```

**Split view (side-by-side)**
```html
<div class="split">
  <div class="mockup"><!-- left --></div>
  <div class="mockup"><!-- right --></div>
</div>
```

### Typography
- \`h2\` — page title
- \`h3\` — section heading
- \`.subtitle\` — secondary text below title
- \`.section\` — content block with bottom margin

**Keep mockups simple** — focus on layout and structure, not pixel-perfect design.

## What You Never Do

- Write a `.json`, `.md`, `.txt`, or any non-`.html` file to `screen_dir` — the server ignores everything that is not `.html`
- Write design data as a JSON structure and expect the server to render it — it cannot
- Skip the self-verify step in The Loop — if the browser still shows "Waiting for the agent", you wrote the wrong file format or path
- End your turn after "saving a design" without confirming a `.html` file exists in `screen_dir`

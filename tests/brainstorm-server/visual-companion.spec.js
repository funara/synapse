const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let serverProcess;
let serverInfo = null;

test.beforeAll(async () => {
  const servePath = path.resolve(__dirname, '../../skills/spec/scripts/serve.js');
  serverProcess = spawn('node', [servePath]);

  await new Promise((resolve, reject) => {
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (!serverInfo) {
        try {
          serverInfo = JSON.parse(output);
          if (serverInfo.type === 'server-started') {
            resolve();
          }
        } catch (e) {
          // ignore
        }
      }
    });
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });
    setTimeout(() => reject(new Error('Server start timeout')), 5000);
  });
});

test.afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

test('Visual Companion UI - Render and Interactive Click', async ({ page }) => {
  expect(serverInfo).not.toBeNull();
  
  // 1. Create a mockup screen
  const testHtmlPath = path.join(serverInfo.screen_dir, 'design-1.html');
  const mockDesign = `
    <div class="options" data-multiselect="false">
      <div class="option" data-choice="a" id="opt-a" onclick="window.toggleSelect(this)">
        <div class="letter">A</div>
        <div class="content">
          <h3>Sleek Dark Mode</h3>
          <p>Uses deep blacks and vibrant neon accents.</p>
        </div>
      </div>
      <div class="option" data-choice="b" id="opt-b" onclick="window.toggleSelect(this)">
        <div class="letter">B</div>
        <div class="content">
          <h3>Clean Light Mode</h3>
          <p>Minimalist, white background, high readability.</p>
        </div>
      </div>
    </div>
  `;
  fs.writeFileSync(testHtmlPath, mockDesign);

  // Wait for file watcher to catch up
  await page.waitForTimeout(500);

  // 2. Navigate to the companion
  await page.goto(serverInfo.url);

  // 3. Verify it rendered correctly
  const headerText = await page.textContent('.header h1');
  expect(headerText).toContain('Synapse Spec Companion');

  // Verify the options are visible
  const optA = page.locator('#opt-a');
  await expect(optA).toBeVisible();
  
  // 4. Simulate a user clicking the option
  await optA.click();

  // 5. Verify the indicator bar updates visually
  const indicator = page.locator('#indicator-text');
  await expect(indicator).toContainText('Sleek Dark Mode selected');
  
  // Wait a bit for the WebSocket event to hit the server
  await page.waitForTimeout(500);

  // 6. Verify the server recorded the interaction
  const eventsFilePath = path.join(serverInfo.state_dir, 'events');
  expect(fs.existsSync(eventsFilePath)).toBeTruthy();
  
  const eventsData = fs.readFileSync(eventsFilePath, 'utf-8').trim();
  const parsedEvent = JSON.parse(eventsData);
  
  expect(parsedEvent.choice).toBe('a');
  expect(parsedEvent.text).toContain('Sleek Dark Mode');
});

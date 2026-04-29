const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const assert = require('assert');

const servePath = path.resolve(__dirname, '../../skills/spec/scripts/serve.js');

async function runTest() {
  console.log('Starting Visual Companion server test...');
  
  // 1. Start the server
  const serverProcess = spawn('node', [servePath]);
  
  let serverInfo = null;
  
  // Create a Promise to wait for the server startup JSON
  const startupPromise = new Promise((resolve, reject) => {
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (!serverInfo) {
        try {
          serverInfo = JSON.parse(output);
          if (serverInfo.type === 'server-started') {
            console.log('Server started:', serverInfo.url);
            resolve(serverInfo);
          }
        } catch (e) {
          // Ignore non-JSON output
        }
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });
    
    serverProcess.on('close', (code) => {
      if (code !== 0 && !serverInfo) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });
    
    // Timeout if server doesn't start
    setTimeout(() => reject(new Error('Server start timeout')), 5000);
  });

  try {
    await startupPromise;
    assert.ok(serverInfo.screen_dir, 'Missing screen_dir in server output');
    assert.ok(serverInfo.state_dir, 'Missing state_dir in server output');
    
    // 2. Write a test HTML file to screen_dir
    const testHtmlPath = path.join(serverInfo.screen_dir, 'test-screen.html');
    fs.writeFileSync(testHtmlPath, '<div class="test">Hello World</div>');
    console.log('Wrote test HTML file to:', testHtmlPath);
    
    // Wait for file watcher to catch up
    await new Promise(r => setTimeout(r, 500));
    
    // 3. Connect via WebSocket
    const wsUrl = serverInfo.url.replace('http://', 'ws://');
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    
    const wsOpenPromise = new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
      setTimeout(() => reject(new Error('WebSocket connection timeout')), 2000);
    });
    
    await wsOpenPromise;
    console.log('WebSocket connected');
    
    // 4. Simulate a UI click interaction
    const simulatedEvent = {
      type: 'click',
      text: 'Option A',
      choice: 'a',
      id: 'opt-a',
      timestamp: Date.now()
    };
    
    ws.send(JSON.stringify(simulatedEvent));
    console.log('Sent simulated click event');
    
    // Wait for the server to process and write the event file
    await new Promise(r => setTimeout(r, 500));
    
    // 5. Verify the event was written to state_dir/events
    const eventsFilePath = path.join(serverInfo.state_dir, 'events');
    assert.ok(fs.existsSync(eventsFilePath), 'Events file was not created');
    
    const eventsData = fs.readFileSync(eventsFilePath, 'utf-8').trim();
    const parsedEvent = JSON.parse(eventsData);
    
    assert.strictEqual(parsedEvent.choice, 'a', 'Event choice does not match');
    assert.strictEqual(parsedEvent.text, 'Option A', 'Event text does not match');
    
    console.log('Successfully verified bidirectional interaction!');
    console.log('TEST PASSED \u2705');
    
  } catch (error) {
    console.error('TEST FAILED \u274c', error);
    process.exitCode = 1;
  } finally {
    // 6. Clean up: Kill the server
    console.log('Shutting down server process...');
    serverProcess.kill();
  }
}

runTest();

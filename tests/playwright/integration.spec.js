const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Read the userscript content
const userscriptPath = path.join(__dirname, '../../infinite-craft-helper.user.js');
const userscriptContent = fs.readFileSync(userscriptPath, 'utf8');

test.describe('Integration Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Create a more realistic test environment that simulates neal.fun/infinite-craft
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Infinite Craft</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .game-area { 
            width: 100%; 
            height: 100vh; 
            position: relative;
          }
          .element { 
            display: inline-block; 
            padding: 8px 16px; 
            margin: 4px; 
            background: white; 
            border-radius: 20px; 
            cursor: pointer; 
          }
        </style>
      </head>
      <body>
        <div class="game-area">
          <div class="element">Fire</div>
          <div class="element">Water</div>
          <div class="element">Earth</div>
          <div class="element">Air</div>
        </div>
      </body>
      </html>
    `;
    
    await page.setContent(testHTML);
    
    // Inject the userscript
    const scriptCode = userscriptContent
      .replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/, '');
    
    await page.addScriptTag({ content: scriptCode });
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
    
    // Wait for Logger to be available
    await page.waitForFunction(() => {
      return typeof window.Logger !== 'undefined' && 
             typeof window.Logger.log === 'function';
    }, { timeout: 5000 });
  });

  test('should not interfere with page layout', async () => {
    // Check that game elements are still visible and functional
    const gameArea = await page.locator('.game-area');
    await expect(gameArea).toBeVisible();
    
    const elements = await page.locator('.element').all();
    expect(elements.length).toBe(4);
    
    // Check that control panel doesn't block game elements
    const fireElement = await page.locator('.element').first();
    await expect(fireElement).toBeVisible();
    await fireElement.click(); // Should be clickable
  });

  test('should initialize logging system automatically', async () => {
    // Check that the logging system is initialized
    const hasLogger = await page.evaluate(() => {
      return typeof window.Logger !== 'undefined' && 
             typeof window.Logger.log === 'function';
    });
    
    expect(hasLogger).toBe(true);
    
    // Test that logging works
    await page.evaluate(() => {
      window.Logger.log('Integration test message');
    });
    
    const logContent = await page.locator('.logs-list');
    const logText = await logContent.textContent();
    expect(logText).toContain('Integration test message');
  });

  test('should handle window resize gracefully', async () => {
    // Get initial panel position
    const panel = page.locator('#infinite-craft-control-panel');
    const initialBox = await panel.boundingBox();
    
    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(100);
    
    // Check panel is still visible and positioned correctly
    await expect(panel).toBeVisible();
    const newBox = await panel.boundingBox();
    
    // Panel should still be within viewport
    expect(newBox.x).toBeGreaterThanOrEqual(0);
    expect(newBox.y).toBeGreaterThanOrEqual(0);
    expect(newBox.x + newBox.width).toBeLessThanOrEqual(800);
    expect(newBox.y + newBox.height).toBeLessThanOrEqual(600);
  });

  test('should maintain functionality after DOM changes', async () => {
    // Simulate dynamic content changes (common in games)
    await page.evaluate(() => {
      const gameArea = document.querySelector('.game-area');
      const newElement = document.createElement('div');
      newElement.className = 'element';
      newElement.textContent = 'Steam';
      gameArea.appendChild(newElement);
    });
    
    // Control panel should still work
    const panel = page.locator('#infinite-craft-control-panel');
    await expect(panel).toBeVisible();
    
    // Logging should still work
    await page.evaluate(() => {
      window.Logger.log('After DOM change');
    });
    
    const logContent = await page.locator('.logs-list');
    const logText = await logContent.textContent();
    expect(logText).toContain('After DOM change');
  });

  test('should handle multiple rapid log messages', async () => {
    // Simulate rapid logging (like game events)
    await page.evaluate(() => {
      for (let i = 0; i < 50; i++) {
        window.Logger.log(`Rapid message ${i}`);
      }
    });
    
    // Check that messages are logged (may not be exactly 50 due to log rotation)
    const logContent = await page.locator('.logs-list');
    const logEntries = await page.locator('.logs-list .log-entry').all();
    expect(logEntries.length).toBeGreaterThan(0);
    
    // Check that the log container is still scrollable
    const isScrollable = await logContent.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });
    expect(isScrollable).toBe(true);
  });

  test('should preserve panel state across interactions', async () => {
    const panel = page.locator('#infinite-craft-control-panel');
    
    // Move panel to a specific position
    const header = page.locator('#infinite-craft-control-panel .panel-header');
    await header.dragTo(page.locator('body'), {
      targetPosition: { x: 200, y: 150 }
    });
    
    // Add some logs
    await page.evaluate(() => {
      window.Logger.log('State test message 1');
      window.Logger.warn('State test message 2');
    });
    
    // Interact with page elements
    await page.locator('.element').first().click();
    
    // Panel should still be in the same position
    const panelBox = await panel.boundingBox();
    expect(Math.abs(panelBox.x - 200)).toBeLessThan(20);
    expect(Math.abs(panelBox.y - 150)).toBeLessThan(20);
    
    // Logs should still be there
    const logContent = await page.locator('.logs-list');
    const logText = await logContent.textContent();
    expect(logText).toContain('State test message 1');
    expect(logText).toContain('State test message 2');
  });
});
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Read the userscript content
const userscriptPath = path.join(__dirname, '../../infinite-craft-helper.user.js');
const userscriptContent = fs.readFileSync(userscriptPath, 'utf8');

test.describe('Infinite Craft Helper Userscript', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Create a minimal HTML page that simulates the Infinite Craft environment
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Infinite Craft Test Environment</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .game-container { width: 100%; height: 500px; background: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="game-container">
          <h1>Infinite Craft Test Environment</h1>
          <p>This simulates the game environment for testing the userscript.</p>
        </div>
      </body>
      </html>
    `;
    
    await page.setContent(testHTML);
    
    // Inject the userscript (extract the main code without the userscript header)
    const scriptCode = userscriptContent
      .replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/, '')
      .replace(/^\(function\(\) \{/, '')
      .replace(/\}\)\(\);?\s*$/, '');
    
    await page.addScriptTag({ content: scriptCode });
  });

  test('should create control panel on page load', async () => {
    // Wait for the control panel to be created
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
    
    // Check if the control panel exists
    const panel = await page.locator('#infinite-craft-control-panel');
    await expect(panel).toBeVisible();
    
    // Check panel structure
    const header = await page.locator('#infinite-craft-control-panel .panel-header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Infinite Craft Helper');
    
    const content = await page.locator('#infinite-craft-control-panel .panel-content');
    await expect(content).toBeVisible();
  });

  test('should display correct version', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
    
    const versionElement = await page.locator('.version-display');
    await expect(versionElement).toBeVisible();
    
    const versionText = await versionElement.textContent();
    expect(versionText).toMatch(/v\d+\.\d+\.\d+/);
  });

  test('should be draggable', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
    
    const panel = page.locator('#infinite-craft-control-panel');
    const header = page.locator('#infinite-craft-control-panel .panel-header');
    
    // Get initial position
    const initialBox = await panel.boundingBox();
    
    // Drag the panel
    await header.dragTo(page.locator('body'), {
      targetPosition: { x: initialBox.x + 100, y: initialBox.y + 100 }
    });
    
    // Get new position
    const newBox = await panel.boundingBox();
    
    // Verify the panel moved
    expect(Math.abs(newBox.x - (initialBox.x + 100))).toBeLessThan(10);
    expect(Math.abs(newBox.y - (initialBox.y + 100))).toBeLessThan(10);
  });

  test('should have proper styling', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
    
    const panel = page.locator('#infinite-craft-control-panel');
    
    // Check CSS properties
    const styles = await panel.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        zIndex: computed.zIndex,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        backdropFilter: computed.backdropFilter
      };
    });
    
    expect(styles.position).toBe('fixed');
    expect(parseInt(styles.zIndex)).toBeGreaterThan(1000);
    expect(styles.borderRadius).toBe('12px');
  });
});
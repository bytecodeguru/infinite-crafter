const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Read the userscript content
const userscriptPath = path.join(__dirname, '../../dist/infinite-craft-helper.user.js');
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
          .game-container { width: 100%; min-height: 500px; background: #f0f0f0; padding: 16px; }
          .container.infinite-craft { display: flex; gap: 24px; align-items: flex-start; }
          #sidebar { width: 300px; border: 1px solid #ccc; padding: 12px; background: #fff; }
          .item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; margin-bottom: 4px; border: 1px solid #ddd; border-radius: 4px; cursor: grab; }
          #instances { flex: 1; min-height: 300px; border: 1px dashed #aaa; }
        </style>
      </head>
      <body>
        <div class="game-container">
          <h1>Infinite Craft Test Environment</h1>
          <p>This simulates the game environment for testing the userscript.</p>
          <div class="container infinite-craft" data-container>
            <div id="sidebar">
              <div class="items">
                <div class="item-wrapper">
                  <div class="item" data-item data-item-text="Water" data-item-emoji="💧" data-item-id="0">
                    <span class="item-emoji">💧</span>
                    Water
                  </div>
                </div>
                <div class="item-wrapper">
                  <div class="item" data-item data-item-text="Fire" data-item-emoji="🔥" data-item-id="1">
                    <span class="item-emoji">🔥</span>
                    Fire
                  </div>
                </div>
                <div class="item-wrapper">
                  <div class="item" data-item data-item-text="Wind" data-item-emoji="🌬️" data-item-id="2">
                    <span class="item-emoji">🌬️</span>
                    Wind
                  </div>
                </div>
              </div>
            </div>
            <div id="instances"></div>
            <div id="instances-top"></div>
            <div id="select-box"></div>
            <canvas id="particles"></canvas>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(testHTML);

    // Inject the userscript (extract the main code without the userscript header)
    const scriptCode = userscriptContent
      .replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/, '');

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

    const versionElement = await page.locator('.version');
    await expect(versionElement).toBeVisible();

    const versionText = await versionElement.textContent();
    expect(versionText).toMatch(/\d+\.\d+\.\d+/);
  });

  test('should be draggable', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });

    const panel = page.locator('#infinite-craft-control-panel');
    const header = page.locator('#infinite-craft-control-panel .panel-header');

    // Get initial position
    const initialBox = await panel.boundingBox();

    // Drag the panel by moving the header
    await header.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox.x + 100, initialBox.y + 100);
    await page.mouse.up();

    // Wait a bit for the drag to complete
    await page.waitForTimeout(100);

    // Get new position
    const newBox = await panel.boundingBox();

    // Verify the panel moved (allow for some tolerance)
    const movedX = Math.abs(newBox.x - initialBox.x) > 50;
    const movedY = Math.abs(newBox.y - initialBox.y) > 50;
    expect(movedX || movedY).toBe(true);
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
    expect(styles.borderRadius).toBe('8px');
  });

  test('should expose GameInterface helpers on window', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });

    const result = await page.evaluate(() => {
      const gameInterface = window.gameInterface;
      if (!gameInterface) {
        return { exists: false };
      }

      const requiredMethods = ['logGameState', 'getElementCount', 'runBasicTests'];
      const hasMethods = requiredMethods.every(method => typeof gameInterface[method] === 'function');
      const basicTests = gameInterface.runBasicTests();

      return {
        exists: true,
        hasMethods,
        basicTestsLength: Array.isArray(basicTests) ? basicTests.length : 0
      };
    });

    expect(result.exists).toBe(true);
    expect(result.hasMethods).toBe(true);
    expect(result.basicTestsLength).toBeGreaterThan(0);

    const diagnosticsHandle = await page.waitForFunction(() => {
      const state = window.__infiniteCraftHelperDiagnostics;
      if (!state || typeof state.attempts !== 'number') {
        return false;
      }
      return state.attempts > 0 ? state : false;
    });
    const diagnosticsState = await diagnosticsHandle.jsonValue();

    expect(diagnosticsState.attempts).toBeGreaterThan(0);
  });

  test('should provide sidebar selection helpers', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });

    const data = await page.evaluate(() => {
      const gi = window.gameInterface;
      const elements = gi.getSidebarElements();
      const draggable = gi.getDraggableElements();
      const water = gi.findElementByName('Water');
      const fireMatches = gi.findElementsByPredicate(info => info.name === 'Fire');
      const diagnostics = gi.runSelectionDiagnostics();
      const summary = gi.logSidebarSummary();

      return {
        total: elements.length,
        draggableCount: draggable.length,
        waterFound: Boolean(water && water.name === 'Water'),
        predicateCount: fireMatches.length,
        issues: diagnostics.issues,
        invalidCount: summary.invalidCount
      };
    });

    expect(data.total).toBeGreaterThan(0);
    expect(data.draggableCount).toBe(data.total);
    expect(data.waterFound).toBe(true);
    expect(data.predicateCount).toBe(1);
    expect(Array.isArray(data.issues)).toBe(true);
    expect(data.issues.length).toBe(0);
    expect(data.invalidCount).toBe(0);
  });

  test('diagnostics button runs tests', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });

    const button = page.locator('.run-diagnostics-button');
    await expect(button).toBeVisible();

    const initialLogCount = await page.evaluate(() => {
      const manager = window.logManager;
      return manager ? manager.getLogCount() : 0;
    });

    await button.click();

    await page.waitForFunction(count => {
      const manager = window.logManager;
      if (!manager) {
        return false;
      }
      const logs = manager.getLogs();
      if (logs.length <= count) {
        return false;
      }
      return logs.some(entry => entry.message.includes('Diagnostics finished'));
    }, initialLogCount);

    await expect(button).not.toBeDisabled();
  });

  test('action simulator can click elements', async () => {
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });

    await page.evaluate(() => {
      const button = document.createElement('button');
      button.id = 'sim-target';
      button.textContent = 'Click me';
      button.addEventListener('click', () => {
        button.dataset.clicked = 'true';
      });
      document.body.appendChild(button);
    });

    await page.evaluate(async () => {
      const simulator = window.actionSimulator;
      const target = document.getElementById('sim-target');
      if (!simulator || !target) {
        throw new Error('ActionSimulator not available');
      }
      await simulator.clickElement(target, { delay: { min: 0, max: 0 } });
    });

    const clicked = await page.getAttribute('#sim-target', 'data-clicked');
    expect(clicked).toBe('true');
  });
});

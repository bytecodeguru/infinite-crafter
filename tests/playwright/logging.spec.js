const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Read the userscript content
const userscriptPath = path.join(__dirname, '../../infinite-craft-helper.user.js');
const userscriptContent = fs.readFileSync(userscriptPath, 'utf8');

test.describe('Logging System', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Create test environment
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logging Test Environment</title>
      </head>
      <body>
        <div id="test-container">Logging Test Environment</div>
      </body>
      </html>
    `;
    
    await page.setContent(testHTML);
    
    // Inject the userscript
    const scriptCode = userscriptContent
      .replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/, '')
      .replace(/^\(function\(\) \{/, '')
      .replace(/\}\)\(\);?\s*$/, '');
    
    await page.addScriptTag({ content: scriptCode });
    await page.waitForSelector('#infinite-craft-control-panel', { timeout: 5000 });
  });

  test('should display log section in control panel', async () => {
    const logSection = await page.locator('#log-section');
    await expect(logSection).toBeVisible();
    
    const logHeader = await page.locator('#log-section h3');
    await expect(logHeader).toContainText('Logs');
    
    const logContent = await page.locator('#log-content');
    await expect(logContent).toBeVisible();
    
    const clearButton = await page.locator('#clear-logs-btn');
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toContainText('Clear Logs');
  });

  test('should log messages with different levels', async () => {
    // Test logging different message types
    await page.evaluate(() => {
      window.InfiniteCraftHelper.log('Test info message', 'info');
      window.InfiniteCraftHelper.log('Test warning message', 'warn');
      window.InfiniteCraftHelper.log('Test error message', 'error');
      window.InfiniteCraftHelper.log('Test debug message', 'debug');
    });

    const logContent = await page.locator('#log-content');
    const logText = await logContent.textContent();
    
    expect(logText).toContain('[INFO] Test info message');
    expect(logText).toContain('[WARN] Test warning message');
    expect(logText).toContain('[ERROR] Test error message');
    expect(logText).toContain('[DEBUG] Test debug message');
  });

  test('should apply correct styling to different log levels', async () => {
    await page.evaluate(() => {
      window.InfiniteCraftHelper.log('Info message', 'info');
      window.InfiniteCraftHelper.log('Warning message', 'warn');
      window.InfiniteCraftHelper.log('Error message', 'error');
      window.InfiniteCraftHelper.log('Debug message', 'debug');
    });

    // Check log entry colors
    const logEntries = await page.locator('#log-content .log-entry').all();
    expect(logEntries.length).toBe(4);

    // Check info log styling
    const infoEntry = logEntries[0];
    const infoColor = await infoEntry.evaluate(el => window.getComputedStyle(el).color);
    expect(infoColor).toBe('rgb(59, 130, 246)'); // blue

    // Check warning log styling
    const warnEntry = logEntries[1];
    const warnColor = await warnEntry.evaluate(el => window.getComputedStyle(el).color);
    expect(warnColor).toBe('rgb(245, 158, 11)'); // amber

    // Check error log styling
    const errorEntry = logEntries[2];
    const errorColor = await errorEntry.evaluate(el => window.getComputedStyle(el).color);
    expect(errorColor).toBe('rgb(239, 68, 68)'); // red

    // Check debug log styling
    const debugEntry = logEntries[3];
    const debugColor = await debugEntry.evaluate(el => window.getComputedStyle(el).color);
    expect(debugColor).toBe('rgb(107, 114, 128)'); // gray
  });

  test('should auto-scroll to bottom when new logs are added', async () => {
    // Add many log messages to trigger scrolling
    await page.evaluate(() => {
      for (let i = 0; i < 20; i++) {
        window.InfiniteCraftHelper.log(`Test message ${i}`, 'info');
      }
    });

    const logContent = await page.locator('#log-content');
    
    // Check if scrolled to bottom
    const isScrolledToBottom = await logContent.evaluate(el => {
      return Math.abs(el.scrollTop - (el.scrollHeight - el.clientHeight)) < 5;
    });
    
    expect(isScrolledToBottom).toBe(true);
  });

  test('should clear logs when clear button is clicked', async () => {
    // Add some log messages
    await page.evaluate(() => {
      window.InfiniteCraftHelper.log('Message 1', 'info');
      window.InfiniteCraftHelper.log('Message 2', 'warn');
      window.InfiniteCraftHelper.log('Message 3', 'error');
    });

    // Verify logs exist
    let logContent = await page.locator('#log-content');
    let logText = await logContent.textContent();
    expect(logText).toContain('Message 1');
    expect(logText).toContain('Message 2');
    expect(logText).toContain('Message 3');

    // Click clear button and confirm
    await page.locator('#clear-logs-btn').click();
    
    // Handle the confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('clear all logs');
      await dialog.accept();
    });

    // Wait a bit for the clear operation
    await page.waitForTimeout(100);

    // Verify logs are cleared
    logContent = await page.locator('#log-content');
    logText = await logContent.textContent();
    expect(logText.trim()).toBe('');
  });

  test('should maintain scroll position when user manually scrolls up', async () => {
    // Add initial messages
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        window.InfiniteCraftHelper.log(`Initial message ${i}`, 'info');
      }
    });

    const logContent = await page.locator('#log-content');
    
    // Manually scroll up
    await logContent.evaluate(el => {
      el.scrollTop = 0;
    });

    // Add more messages
    await page.evaluate(() => {
      for (let i = 10; i < 15; i++) {
        window.InfiniteCraftHelper.log(`New message ${i}`, 'info');
      }
    });

    // Check that scroll position stayed at top (user was manually scrolling)
    const scrollTop = await logContent.evaluate(el => el.scrollTop);
    expect(scrollTop).toBe(0);
  });

  test('should format timestamps correctly', async () => {
    await page.evaluate(() => {
      window.InfiniteCraftHelper.log('Test message with timestamp', 'info');
    });

    const logContent = await page.locator('#log-content');
    const logText = await logContent.textContent();
    
    // Check timestamp format (HH:MM:SS)
    const timestampRegex = /\[\d{2}:\d{2}:\d{2}\]/;
    expect(logText).toMatch(timestampRegex);
  });
});
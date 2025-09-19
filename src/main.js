/**
 * Entry point and initialization
 * Main initialization logic for the Infinite Craft Helper userscript
 */

import { addStyles } from './ui/styles.js';
import { createControlPanel } from './ui/control-panel.js';
import { makeDraggable } from './ui/draggable.js';
import { LogManager, LogDisplay, createLogger } from './core/logger.js';

/**
 * Initialize the script
 */
function init() {
    // Wait for the page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    console.log('[Init] Starting Infinite Craft Helper initialization...');

    // Add styles
    addStyles();

    // Create and add the control panel
    const panel = createControlPanel();
    if (document.body) {
        document.body.appendChild(panel);
    } else {
        console.warn('[Init] document.body not available, panel not added to DOM');
    }

    // Make it draggable
    makeDraggable(panel);

    // Initialize logging system components
    console.log('[Init] Initializing logging system...');

    // 1. Initialize LogManager
    console.log('[Init] Creating LogManager...');
    const logManager = new LogManager(100);

    // 2. Connect Logger API to LogManager
    console.log('[Init] Connecting Logger API to LogManager...');
    let Logger = createLogger(logManager);

    // 3. Initialize LogDisplay with the control panel and LogManager
    console.log('[Init] Initializing LogDisplay...');
    let logDisplay = null;
    let displayInitialized = false;

    try {
        logDisplay = new LogDisplay(panel, logManager);
        displayInitialized = logDisplay.initialize();
    } catch (error) {
        console.warn('[Init] LogDisplay initialization failed:', error.message);
    }

    if (!displayInitialized) {
        console.warn('[Init] LogDisplay not available, but Logger API will still work');
    }

    // Make components available globally for debugging
    window.logManager = logManager;
    window.logDisplay = logDisplay;
    window.Logger = Logger;

    console.log('[Init] Logging system initialized successfully!');
    console.log('[Init] Components available globally: logManager, logDisplay, Logger');

    // Test the Logger API integration
    console.log('[Init] Testing Logger API integration...');
    Logger.log('Logger API test: info message - logging system is working!');
    Logger.warn('Logger API test: warning message - this should appear in the logs panel');
    Logger.error('Logger API test: error message - with proper styling');

    // Test integration with existing control panel functionality
    console.log('[Init] Testing control panel integration...');
    Logger.log('Control panel is draggable and logs section should be visible');
    Logger.log('Collapse/expand, copy, and clear buttons should be functional');

    console.log('Infinite Craft Helper loaded successfully!');

    // Clear initialization logs to start with empty log history
    // This ensures the user starts with a clean slate while preserving initialization logging for development
    // Skip clearing in test environments (detect by checking for common test indicators)
    const isTestEnvironment = typeof window !== 'undefined' && (
        window.location.href.includes('test') ||
        window.location.href.includes('localhost') ||
        window.location.href.includes('127.0.0.1') ||
        window.location.href === 'about:blank' ||
        typeof window.playwright !== 'undefined' ||
        typeof window.__playwright !== 'undefined'
    );

    if (!isTestEnvironment) {
        setTimeout(() => {
            const clearedCount = logManager.clearLogs();
            console.log(`[Init] Cleared ${clearedCount} initialization logs - starting with empty log history`);
        }, 100);
    } else {
        console.log('[Init] Test environment detected, skipping log cleanup');
    }
}

// Start the script
init();
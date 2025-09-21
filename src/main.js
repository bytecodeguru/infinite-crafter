/**
 * Entry point and initialization
 * Main initialization logic for the Infinite Craft Helper userscript
 */

import { addStyles } from './ui/styles.js';
import { createControlPanel } from './ui/control-panel.js';
import { makeDraggable } from './ui/draggable.js';
import { LogManager, createLogger } from './core/log-manager.js';
import { LogDisplay } from './ui/log-display-core.js';
import { onDOMReady, appendToBody } from './utils/dom.js';

/**
 * Initialize the script
 */
function init() {
    console.log('[Init] Starting Infinite Craft Helper initialization...');

    const panel = setupControlPanel();
    const { logManager, Logger } = initializeLogging(panel);

    runInitializationSmokeTests(Logger);
    console.log('Infinite Craft Helper loaded successfully!');

    scheduleLogCleanup(logManager);
}

function setupControlPanel() {
    addStyles();

    const panel = createControlPanel();
    appendToBody(panel);
    makeDraggable(panel);

    return panel;
}

function initializeLogging(panel) {
    console.log('[Init] Initializing logging system...');

    console.log('[Init] Creating LogManager...');
    const logManager = new LogManager(100);

    console.log('[Init] Connecting Logger API to LogManager...');
    const Logger = createLogger(logManager);

    const { logDisplay } = configureLogDisplay(panel, logManager);
    exposeLoggingGlobals(logManager, logDisplay, Logger);

    console.log('[Init] Logging system initialized successfully!');
    console.log('[Init] Components available globally: logManager, logDisplay, Logger');

    return { logManager, Logger, logDisplay };
}

function configureLogDisplay(panel, logManager) {
    console.log('[Init] Initializing LogDisplay...');

    let logDisplay = null;
    let initialized = false;

    try {
        logDisplay = new LogDisplay(panel, logManager);
        initialized = logDisplay.initialize();
    } catch (error) {
        console.warn('[Init] LogDisplay initialization failed:', error.message);
    }

    if (!initialized) {
        console.warn('[Init] LogDisplay not available, but Logger API will still work');
    }

    return { logDisplay, initialized };
}

function exposeLoggingGlobals(logManager, logDisplay, Logger) {
    window.logManager = logManager;
    window.logDisplay = logDisplay;
    window.Logger = Logger;
}

function runInitializationSmokeTests(Logger) {
    console.log('[Init] Testing Logger API integration...');
    Logger.log('Logger API test: info message - logging system is working!');
    Logger.warn('Logger API test: warning message - this should appear in the logs panel');
    Logger.error('Logger API test: error message - with proper styling');

    console.log('[Init] Testing control panel integration...');
    Logger.log('Control panel is draggable and logs section should be visible');
    Logger.log('Collapse/expand, copy, and clear buttons should be functional');
}

function scheduleLogCleanup(logManager) {
    if (!isTestEnvironment()) {
        setTimeout(() => {
            const clearedCount = logManager.clearLogs();
            console.log(`[Init] Cleared ${clearedCount} initialization logs - starting with empty log history`);
        }, 100);
        return;
    }

    console.log('[Init] Test environment detected, skipping log cleanup');
}

function isTestEnvironment() {
    if (typeof window === 'undefined') {
        return false;
    }

    const locationHref = window.location?.href || '';
    return (
        locationHref.includes('test') ||
        locationHref.includes('localhost') ||
        locationHref.includes('127.0.0.1') ||
        locationHref === 'about:blank' ||
        typeof window.playwright !== 'undefined' ||
        typeof window.__playwright !== 'undefined'
    );
}

// Start the script when DOM is ready
onDOMReady(init);

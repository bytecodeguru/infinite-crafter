/**
 * Entry point and initialization
 * Main initialization logic for the Infinite Craft Helper userscript
 */

import { addStyles } from './ui/styles.js';
import { createControlPanel } from './ui/control-panel.js';
import { makeDraggable } from './ui/draggable.js';
import { LogManager, createLogger } from './core/log-manager.js';
import { LogDisplay } from './ui/log-display-core.js';
import { createGameInterface } from './auto-play/game-interface.js';
import { createActionSimulator } from './auto-play/action-simulator.js';
import { onDOMReady, appendToBody } from './utils/dom.js';

/**
 * Initialize the script
 */
function init() {
    console.log('[Init] Starting Infinite Craft Helper initialization...');

    const panel = setupControlPanel();
    const { logManager, Logger } = initializeLogging(panel);
    const gameInterface = initializeGameInterface(Logger);
    initializeActionSimulator(Logger);
    setupDiagnosticsControls(panel, gameInterface, Logger);

    runInitializationSmokeTests(Logger, gameInterface);
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

function exposeGameInterfaceGlobal(gameInterface) {
    window.gameInterface = gameInterface;
}

function initializeGameInterface(Logger) {
    console.log('[Init] Initializing GameInterface...');

    const loggerBridge = createNamespacedLogger(Logger, 'GameInterface');
    const gameInterface = createGameInterface(loggerBridge);

    exposeGameInterfaceGlobal(gameInterface);
    console.log('[Init] GameInterface available via window.gameInterface');

    return gameInterface;
}

function initializeActionSimulator(Logger) {
    console.log('[Init] Initializing ActionSimulator...');

    const loggerBridge = createNamespacedLogger(Logger, 'ActionSimulator');
    const actionSimulator = createActionSimulator({ logger: loggerBridge });

    window.actionSimulator = actionSimulator;
    console.log('[Init] ActionSimulator available via window.actionSimulator');

    return actionSimulator;
}

function createNamespacedLogger(Logger, namespace) {
    if (!Logger) {
        return null;
    }
    const send = level => (message, ...args) => {
        const text = formatLoggerMessage(message);
        const label = `[${namespace}]`;
        try {
            if (typeof Logger[level] === 'function') {
                Logger[level](text);
            } else if (typeof Logger.log === 'function') {
                Logger.log(text);
            }
        } catch (error) {
            console.warn('[Init] Logger bridge failed, falling back to console:', error);
            const consoleLevel = console[level] ? level : 'log';
            console[consoleLevel](label, text);
        }
        if (args.length) {
            const consoleLevel = console[level] ? level : 'log';
            console[consoleLevel](label, message, ...args);
        }
    };
    return {
        log: send('log'),
        warn: send('warn'),
        error: send('error')
    };
}

function formatLoggerMessage(message) {
    if (typeof message === 'string') {
        return message;
    }
    try {
        return JSON.stringify(message);
    } catch {
        return String(message);
    }
}

function runInitializationSmokeTests(Logger, gameInterface) {
    console.log('[Init] Testing Logger API integration...');
    Logger.log('Logger API test: info message - logging system is working!');
    Logger.warn('Logger API test: warning message - this should appear in the logs panel');
    Logger.error('Logger API test: error message - with proper styling');

    console.log('[Init] Testing control panel integration...');
    Logger.log('Control panel is draggable and logs section should be visible');
    Logger.log('Collapse/expand, copy, and clear buttons should be functional');

    if (gameInterface) {
        console.log('[Init] GameInterface diagnostics will re-run automatically until all checks pass');
    }
}

function setupDiagnosticsControls(panel, gameInterface, Logger) {
    if (!panel) {
        return;
    }

    const button = panel.querySelector('.run-diagnostics-button');
    if (!button) {
        return;
    }

    button.dataset.originalText = button.textContent || 'Run Diagnostics';
    button.addEventListener('click', () => runDiagnosticsSuite({ button, gameInterface, Logger }));
}

function runDiagnosticsSuite({ button, gameInterface, Logger }) {
    if (!button || !gameInterface) {
        Logger?.warn('GameInterface not ready yet – diagnostics cannot run.');
        return;
    }

    if (button.disabled) {
        return;
    }

    const originalText = button.dataset.originalText || button.textContent || 'Run Diagnostics';
    button.disabled = true;
    button.textContent = 'Running...';

    try {
        Logger?.log('Running GameInterface diagnostics...');

        const basicResults = gameInterface.runBasicTests();
        const failedBasics = basicResults.filter(result => !result.passed);
        if (failedBasics.length) {
            Logger?.warn(`Basic tests reported ${failedBasics.length} issue(s)`, failedBasics);
        }

        const selectionResults = gameInterface.runSelectionDiagnostics();
        if (selectionResults.issues.length) {
            Logger?.warn(`Selection diagnostics found ${selectionResults.issues.length} issue(s)`, selectionResults.issues);
        } else {
            Logger?.log('Selection diagnostics passed');
        }

        Logger?.log('Diagnostics finished');
    } catch (error) {
        const message = error && error.message ? error.message : 'Unknown error';
        Logger?.error(`Diagnostics failed: ${message}`);
        console.error('[Diagnostics] Failed to run diagnostics', error);
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
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

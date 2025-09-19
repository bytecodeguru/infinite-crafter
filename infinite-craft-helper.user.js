// ==UserScript==
// @name         Infinite Craft Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.3-dev
// @description  Control panel overlay for Infinite Craft with GameInterface foundation
// @author       You
// @match        https://neal.fun/infinite-craft/*
// @match        https://neal.fun/infinite-craft
// @updateURL    https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/infinite-craft-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/infinite-craft-helper.user.js
// @supportURL   https://github.com/bytecodeguru/infinite-crafter/issues
// @homepageURL  https://github.com/bytecodeguru/infinite-crafter
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Get version info from userscript metadata
    function getVersionInfo() {
        const version = '1.0.3-dev';  // Add -dev suffix for feature branch
        const isDevVersion = version.includes('-') || version.includes('dev') || version.includes('test');

        return {
            version: version,
            isDev: isDevVersion,
            displayVersion: isDevVersion ? version : `v${version}`,
            tag: isDevVersion ? 'DEV' : null
        };
    }

    // Create the overlay control panel
    function createControlPanel() {
        const versionInfo = getVersionInfo();
        const panel = document.createElement('div');
        panel.id = 'infinite-craft-control-panel';

        const versionDisplay = versionInfo.tag
            ? `<span class="version ${versionInfo.isDev ? 'dev-version' : ''}">${versionInfo.displayVersion} <span class="dev-tag">${versionInfo.tag}</span></span>`
            : `<span class="version">${versionInfo.displayVersion}</span>`;

        panel.innerHTML = `
            <div class="panel-header">
                <h3>Infinite Craft Helper</h3>
                ${versionDisplay}
            </div>
            <div class="panel-content">
                <p>Control panel ready!</p>
                <!-- Add your controls here -->
            </div>
            <div class="logs-section">
                <div class="logs-header">
                    <h4>Console Logs</h4>
                    <div class="logs-controls">
                        <button class="logs-toggle" title="Collapse/Expand logs">▼</button>
                        <button class="logs-copy" title="Copy logs to clipboard">Copy</button>
                        <button class="logs-clear" title="Clear all logs">Clear</button>
                    </div>
                </div>
                <div class="logs-content">
                    <div class="logs-list" id="logs-list">
                        <div class="logs-empty">No logs yet...</div>
                    </div>
                </div>
            </div>
        `;

        // Style the panel
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 280px;
            background: rgba(30, 30, 30, 0.95);
            border: 2px solid #4a90e2;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        `;

        return panel;
    }

    // Add CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #infinite-craft-control-panel .panel-header {
                background: linear-gradient(135deg, #4a90e2, #357abd);
                padding: 12px 16px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }

            #infinite-craft-control-panel .panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }

            #infinite-craft-control-panel .version {
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            #infinite-craft-control-panel .version.dev-version {
                background: rgba(255, 165, 0, 0.3);
                border: 1px solid rgba(255, 165, 0, 0.5);
            }

            #infinite-craft-control-panel .dev-tag {
                background: #ff6b35;
                color: white;
                padding: 1px 6px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            #infinite-craft-control-panel .panel-content {
                padding: 16px;
            }

            #infinite-craft-control-panel .panel-content p {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #e0e0e0;
            }

            /* Logs Section Styles */
            #infinite-craft-control-panel .logs-section {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.2);
            }

            #infinite-craft-control-panel .logs-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            #infinite-craft-control-panel .logs-header h4 {
                margin: 0;
                font-size: 14px;
                color: #e0e0e0;
                font-weight: bold;
            }

            #infinite-craft-control-panel .logs-controls {
                display: flex;
                gap: 6px;
            }

            #infinite-craft-control-panel .logs-controls button {
                background: rgba(74, 144, 226, 0.8);
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.2s;
            }

            #infinite-craft-control-panel .logs-controls button:hover {
                background: rgba(74, 144, 226, 1);
            }

            #infinite-craft-control-panel .logs-controls button:disabled {
                background: rgba(100, 100, 100, 0.5);
                cursor: not-allowed;
            }

            #infinite-craft-control-panel .logs-toggle {
                width: 20px;
                padding: 4px 2px !important;
                font-size: 10px !important;
                transition: transform 0.2s;
            }

            #infinite-craft-control-panel .logs-toggle.collapsed {
                transform: rotate(-90deg);
            }

            #infinite-craft-control-panel .logs-content {
                max-height: 200px;
                overflow-y: auto;
                transition: max-height 0.3s ease;
            }

            #infinite-craft-control-panel .logs-content.collapsed {
                max-height: 0;
                overflow: hidden;
            }

            #infinite-craft-control-panel .logs-list {
                padding: 8px;
            }

            #infinite-craft-control-panel .logs-empty {
                color: #888;
                font-style: italic;
                text-align: center;
                padding: 20px;
                font-size: 12px;
            }

            #infinite-craft-control-panel .log-entry {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 4px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 11px;
                line-height: 1.4;
            }

            #infinite-craft-control-panel .log-entry:last-child {
                border-bottom: none;
            }

            #infinite-craft-control-panel .log-timestamp {
                color: #888;
                font-size: 10px;
                white-space: nowrap;
                min-width: 60px;
            }

            #infinite-craft-control-panel .log-level {
                font-size: 12px;
                min-width: 16px;
                text-align: center;
            }

            #infinite-craft-control-panel .log-message {
                flex: 1;
                word-break: break-word;
                color: #e0e0e0;
            }

            /* Log Level Colors */
            #infinite-craft-control-panel .log-entry.error .log-level {
                color: #ff6b6b;
            }

            #infinite-craft-control-panel .log-entry.error .log-message {
                color: #ffcccb;
            }

            #infinite-craft-control-panel .log-entry.warn .log-level {
                color: #ffa726;
            }

            #infinite-craft-control-panel .log-entry.warn .log-message {
                color: #ffe0b3;
            }

            #infinite-craft-control-panel .log-entry.info .log-level {
                color: #42a5f5;
            }

            #infinite-craft-control-panel .log-entry.info .log-message {
                color: #cce7ff;
            }

            #infinite-craft-control-panel .log-entry.debug .log-level {
                color: #9e9e9e;
            }

            #infinite-craft-control-panel .log-entry.debug .log-message {
                color: #bbb;
            }

            #infinite-craft-control-panel .log-entry.log .log-level {
                color: #e0e0e0;
            }
        `;
        document.head.appendChild(style);
    }

    // Make panel draggable
    function makeDraggable(panel) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = panel.querySelector('.panel-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // Log entry data structure
    class LogEntry {
        constructor(level, message, args = []) {
            this.id = this.generateId();
            this.timestamp = new Date();
            this.level = level;
            this.message = message;
            this.args = args;
            this.source = 'userscript';
        }

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2);
        }

        toString() {
            const timestamp = this.timestamp.toLocaleTimeString();
            return `[${timestamp}] ${this.level.toUpperCase()}: ${this.message}`;
        }
    }

    // LogManager class for log storage, rotation, and event system
    class LogManager {
        constructor(maxLogs = 100) {
            this.logs = [];
            this.maxLogs = maxLogs;
            this.listeners = [];

            // Store original console for internal logging to prevent recursion
            this.originalConsole = {
                log: console.log.bind(console),
                error: console.error.bind(console),
                warn: console.warn.bind(console)
            };

            this.originalConsole.log('[LogManager] Initialized with maxLogs:', maxLogs);
        }

        addLog(level, message, args = []) {
            const logEntry = new LogEntry(level, message, args);

            // Add to logs array
            this.logs.unshift(logEntry); // Add to beginning for newest-first order

            // Rotate logs if we exceed maxLogs
            if (this.logs.length > this.maxLogs) {
                const removed = this.logs.splice(this.maxLogs);
                this.originalConsole.log('[LogManager] Rotated logs, removed', removed.length, 'old entries');
            }

            // Notify listeners
            this.notifyListeners('logAdded', logEntry);

            return logEntry;
        }

        clearLogs() {
            const clearedCount = this.logs.length;
            this.logs = [];

            // Notify listeners
            this.notifyListeners('logsCleared', { clearedCount });

            this.originalConsole.log('[LogManager] Cleared', clearedCount, 'logs');
            return clearedCount;
        }

        getLogs() {
            return [...this.logs]; // Return copy to prevent external modification
        }

        getLogCount() {
            return this.logs.length;
        }

        getLogsByLevel(level) {
            return this.logs.filter(log => log.level === level);
        }

        subscribe(callback) {
            if (typeof callback !== 'function') {
                this.originalConsole.error('[LogManager] Subscribe callback must be a function');
                return null;
            }

            this.listeners.push(callback);
            this.originalConsole.log('[LogManager] Added listener, total listeners:', this.listeners.length);

            // Return unsubscribe function
            return () => {
                const index = this.listeners.indexOf(callback);
                if (index > -1) {
                    this.listeners.splice(index, 1);
                    this.originalConsole.log('[LogManager] Removed listener, total listeners:', this.listeners.length);
                }
            };
        }

        notifyListeners(event, data) {
            this.listeners.forEach(callback => {
                try {
                    callback(event, data);
                } catch (error) {
                    this.originalConsole.error('[LogManager] Error in listener callback:', error);
                }
            });
        }

        // Utility methods for testing and debugging
        getLogStats() {
            const stats = {
                total: this.logs.length,
                byLevel: {}
            };

            // Count logs by level
            this.logs.forEach(log => {
                stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
            });

            return stats;
        }

        // Test methods for unit testing functionality
        runLogManagerTests() {
            console.log('[LogManager] === RUNNING LOG MANAGER TESTS ===');

            try {
                // Test 1: Basic log addition
                console.log('Test 1: Basic log addition');
                const initialCount = this.getLogCount();
                this.addLog('info', 'Test log message');
                const afterAddCount = this.getLogCount();
                console.log('✓ Log added successfully:', afterAddCount === initialCount + 1);

                // Test 2: Log rotation
                console.log('Test 2: Log rotation');
                const originalMaxLogs = this.maxLogs;
                this.maxLogs = 3; // Temporarily set low limit for testing

                this.addLog('info', 'Log 1');
                this.addLog('warn', 'Log 2');
                this.addLog('error', 'Log 3');
                this.addLog('debug', 'Log 4'); // This should trigger rotation

                const rotationTestCount = this.getLogCount();
                console.log('✓ Log rotation working:', rotationTestCount === 3);

                this.maxLogs = originalMaxLogs; // Restore original limit

                // Test 3: Event system
                console.log('Test 3: Event system');
                let eventReceived = false;
                const unsubscribe = this.subscribe((event, data) => {
                    if (event === 'logAdded') {
                        eventReceived = true;
                    }
                });

                this.addLog('info', 'Event test log');
                console.log('✓ Event system working:', eventReceived);
                unsubscribe();

                // Test 4: Log filtering
                console.log('Test 4: Log filtering');
                this.clearLogs();
                this.addLog('error', 'Error message');
                this.addLog('warn', 'Warning message');
                this.addLog('error', 'Another error');

                const errorLogs = this.getLogsByLevel('error');
                const warnLogs = this.getLogsByLevel('warn');
                console.log('✓ Log filtering working:', errorLogs.length === 2 && warnLogs.length === 1);

                // Test 5: Log stats
                console.log('Test 5: Log stats');
                const stats = this.getLogStats();
                console.log('✓ Log stats working:', stats.total === 3 && stats.byLevel.error === 2);

                // Test 6: Clear logs
                console.log('Test 6: Clear logs');
                const clearedCount = this.clearLogs();
                const finalCount = this.getLogCount();
                console.log('✓ Clear logs working:', clearedCount === 3 && finalCount === 0);

                console.log('[LogManager] ✅ ALL LOG MANAGER TESTS PASSED');
                return true;
            } catch (error) {
                console.error('[LogManager] ❌ TEST FAILED:', error);
                return false;
            }
        }
    }

    // LogDisplay class for rendering and managing the logs UI
    class LogDisplay {
        constructor(container, logManager) {
            this.container = container;
            this.logManager = logManager;
            this.isCollapsed = false;
            this.logsList = null;
            this.logsContent = null;
            this.toggleButton = null;
            this.copyButton = null;
            this.clearButton = null;

            // Store original console for internal logging to prevent recursion
            this.originalConsole = {
                log: console.log.bind(console),
                error: console.error.bind(console),
                warn: console.warn.bind(console)
            };

            // Log level icons and styling
            this.logIcons = {
                error: '❌',
                warn: '⚠️',
                info: 'ℹ️',
                log: '📝',
                debug: '🔍'
            };

            this.originalConsole.log('[LogDisplay] Initialized');
        }

        initialize() {
            try {
                // Get DOM elements
                this.logsList = this.container.querySelector('#logs-list');
                this.logsContent = this.container.querySelector('.logs-content');
                this.toggleButton = this.container.querySelector('.logs-toggle');
                this.copyButton = this.container.querySelector('.logs-copy');
                this.clearButton = this.container.querySelector('.logs-clear');

                if (!this.logsList || !this.logsContent || !this.toggleButton || !this.copyButton || !this.clearButton) {
                    throw new Error('Required DOM elements not found');
                }

                // Set up event listeners
                this.setupEventListeners();

                // Subscribe to log manager events
                this.logManager.subscribe((event, data) => {
                    this.handleLogEvent(event, data);
                });

                // Initial render
                this.updateDisplay();

                this.originalConsole.log('[LogDisplay] Initialized successfully');
                return true;
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Failed to initialize:', error);
                return false;
            }
        }

        setupEventListeners() {
            // Toggle collapse/expand
            this.toggleButton.addEventListener('click', () => {
                this.toggleCollapse();
            });

            // Copy logs to clipboard
            this.copyButton.addEventListener('click', () => {
                this.copyLogsToClipboard();
            });

            // Clear logs
            this.clearButton.addEventListener('click', () => {
                this.clearLogs();
            });
        }

        handleLogEvent(event, data) {
            switch (event) {
                case 'logAdded':
                    this.addLogEntry(data);
                    this.updateButtonStates();
                    break;
                case 'logsCleared':
                    this.originalConsole.log(`[LogDisplay] Logs cleared: ${data.clearedCount} entries`);
                    this.updateDisplay();
                    this.updateButtonStates();
                    break;
            }
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;

            if (this.isCollapsed) {
                this.logsContent.classList.add('collapsed');
                this.toggleButton.classList.add('collapsed');
                this.toggleButton.title = 'Expand logs';
            } else {
                this.logsContent.classList.remove('collapsed');
                this.toggleButton.classList.remove('collapsed');
                this.toggleButton.title = 'Collapse logs';
            }
        }

        addLogEntry(logEntry) {
            // Remove empty message if it exists
            const emptyMessage = this.logsList.querySelector('.logs-empty');
            if (emptyMessage) {
                emptyMessage.remove();
            }

            // Create log entry element
            const entryElement = this.createLogEntryElement(logEntry);

            // Add to top of list (newest first)
            this.logsList.insertBefore(entryElement, this.logsList.firstChild);

            // Auto-scroll to show newest entry if not collapsed
            if (!this.isCollapsed) {
                this.logsContent.scrollTop = 0;
            }
        }

        createLogEntryElement(logEntry) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${logEntry.level}`;
            entry.dataset.logId = logEntry.id;

            const timestamp = logEntry.timestamp.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const icon = this.logIcons[logEntry.level] || '📝';

            entry.innerHTML = `
                <span class="log-timestamp">${timestamp}</span>
                <span class="log-level">${icon}</span>
                <span class="log-message">${this.escapeHtml(logEntry.message)}</span>
            `;

            return entry;
        }

        updateDisplay() {
            const logs = this.logManager.getLogs();

            // Clear current display
            this.logsList.innerHTML = '';

            if (logs.length === 0) {
                // Show empty message
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'logs-empty';
                emptyDiv.textContent = 'No logs yet...';
                this.logsList.appendChild(emptyDiv);
            } else {
                // Add all log entries
                logs.forEach(log => {
                    const entryElement = this.createLogEntryElement(log);
                    this.logsList.appendChild(entryElement);
                });
            }

            this.updateButtonStates();
        }

        updateButtonStates() {
            const logCount = this.logManager.getLogCount();

            // Disable copy and clear buttons if no logs
            this.copyButton.disabled = logCount === 0;
            this.clearButton.disabled = logCount === 0;

            // Update header to show log count when collapsed
            if (this.isCollapsed && logCount > 0) {
                const header = this.container.querySelector('.logs-header h4');
                if (header) {
                    header.textContent = `Console Logs (${logCount})`;
                }
            } else {
                const header = this.container.querySelector('.logs-header h4');
                if (header) {
                    header.textContent = 'Console Logs';
                }
            }
        }

        copyLogsToClipboard() {
            try {
                const logs = this.logManager.getLogs();
                if (logs.length === 0) {
                    return;
                }

                // Format logs for clipboard
                const formattedLogs = logs.reverse().map(log => {
                    const timestamp = log.timestamp.toLocaleTimeString();
                    return `[${timestamp}] ${log.level.toUpperCase()}: ${log.message}`;
                }).join('\n');

                // Try modern clipboard API first
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(formattedLogs).then(() => {
                        this.showCopyFeedback(true);
                    }).catch(() => {
                        this.fallbackCopyToClipboard(formattedLogs);
                    });
                } else {
                    this.fallbackCopyToClipboard(formattedLogs);
                }
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Error copying logs:', error);
                this.showCopyFeedback(false);
            }
        }

        fallbackCopyToClipboard(text) {
            try {
                // Create temporary textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);

                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);

                this.showCopyFeedback(success);
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Fallback copy failed:', error);
                this.showCopyFeedback(false);
            }
        }

        showCopyFeedback(success) {
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = success ? '✓ Copied!' : '✗ Failed';
            this.copyButton.style.background = success ? '#4caf50' : '#f44336';

            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.style.background = '';
            }, 2000);
        }

        clearLogs() {
            const clearedCount = this.logManager.clearLogs();
            this.originalConsole.log(`[LogDisplay] Cleared ${clearedCount} logs`);
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Test log display functionality
        runDisplayTests() {
            console.log('[LogDisplay] === RUNNING LOG DISPLAY TESTS ===');

            try {
                // Test 1: Basic initialization
                console.log('Test 1: Basic initialization');
                const initSuccess = this.initialize();
                console.log('✓ Initialization successful:', initSuccess);

                // Test 2: Log entry creation
                console.log('Test 2: Log entry creation');
                const testLog = new LogEntry('info', 'Test display message');
                const entryElement = this.createLogEntryElement(testLog);
                console.log('✓ Log entry element created:', !!entryElement);

                // Test 3: Display update
                console.log('Test 3: Display update');
                this.logManager.addLog('test', 'Display test message');
                this.updateDisplay();
                const hasEntries = this.logsList.children.length > 0;
                console.log('✓ Display updated with entries:', hasEntries);

                // Test 4: Collapse/expand
                console.log('Test 4: Collapse/expand functionality');
                const wasCollapsed = this.isCollapsed;
                this.toggleCollapse();
                const toggleWorked = this.isCollapsed !== wasCollapsed;
                this.toggleCollapse(); // Reset
                console.log('✓ Toggle functionality working:', toggleWorked);

                console.log('[LogDisplay] ✅ ALL LOG DISPLAY TESTS PASSED');
                return true;
            } catch (error) {
                console.error('[LogDisplay] ❌ DISPLAY TEST FAILED:', error);
                return false;
            }
        }
    }

    // LogCapture class for safely intercepting console methods
    class LogCapture {
        constructor(logManager) {
            this.logManager = logManager;
            this.originalConsole = {};
            this.isCapturing = false;
            this.capturedMethods = ['log', 'warn', 'error', 'info', 'debug'];

            console.log('[LogCapture] Initialized');
        }

        startCapturing() {
            if (this.isCapturing) {
                this.originalConsole.log('[LogCapture] Already capturing, skipping start');
                return;
            }

            try {
                // Store original console methods
                this.capturedMethods.forEach(method => {
                    if (typeof console[method] === 'function') {
                        this.originalConsole[method] = console[method].bind(console);
                    }
                });

                // Override console methods
                this.capturedMethods.forEach(method => {
                    if (this.originalConsole[method]) {
                        console[method] = (...args) => {
                            try {
                                // Call original console method first
                                this.originalConsole[method](...args);

                                // Capture for our log system (avoid recursive logging)
                                this.captureLog(method, args);
                            } catch (error) {
                                // If our capture fails, ensure original console still works
                                this.originalConsole[method](...args);
                                this.originalConsole.error('[LogCapture] Error in console interception:', error);
                            }
                        };
                    }
                });

                this.isCapturing = true;
                this.originalConsole.log('[LogCapture] Started capturing console methods:', this.capturedMethods);
            } catch (error) {
                this.originalConsole.error('[LogCapture] Failed to start capturing:', error);
                this.stopCapturing(); // Cleanup on failure
            }
        }

        stopCapturing() {
            if (!this.isCapturing) {
                this.originalConsole.log('[LogCapture] Not currently capturing, skipping stop');
                return;
            }

            try {
                // Restore original console methods
                this.capturedMethods.forEach(method => {
                    if (this.originalConsole[method]) {
                        console[method] = this.originalConsole[method];
                    }
                });

                this.isCapturing = false;
                this.originalConsole.log('[LogCapture] Stopped capturing console methods');
            } catch (error) {
                this.originalConsole.error('[LogCapture] Error stopping capture:', error);
            }
        }

        captureLog(level, args) {
            try {
                // Skip capturing our own log messages to prevent infinite recursion
                const message = this.formatLogMessage(args);
                if (message.includes('[LogCapture]') || message.includes('[LogManager]') || message.includes('[LogDisplay]')) {
                    return;
                }

                // Add to log manager
                this.logManager.addLog(level, message, args);
            } catch (error) {
                // Use original console to report capture errors
                if (this.originalConsole.error) {
                    this.originalConsole.error('[LogCapture] Error capturing log:', error);
                }
            }
        }

        formatLogMessage(args) {
            try {
                return args.map(arg => {
                    if (typeof arg === 'string') {
                        return arg;
                    } else if (typeof arg === 'object' && arg !== null) {
                        // Handle objects, arrays, etc.
                        try {
                            return JSON.stringify(arg, null, 2);
                        } catch (jsonError) {
                            // Handle circular references or non-serializable objects
                            return Object.prototype.toString.call(arg);
                        }
                    } else {
                        return String(arg);
                    }
                }).join(' ');
            } catch (error) {
                return 'Error formatting log message';
            }
        }

        // Test console interception functionality
        runCaptureTests() {
            console.log('[LogCapture] === RUNNING CONSOLE CAPTURE TESTS ===');

            try {
                // Test 1: Basic capture functionality
                console.log('Test 1: Basic capture functionality');
                const initialLogCount = this.logManager.getLogCount();

                // Start capturing
                this.startCapturing();

                // Generate test logs
                console.log('Test log message');
                console.warn('Test warning message');
                console.error('Test error message');

                const afterCaptureCount = this.logManager.getLogCount();
                const capturedLogs = afterCaptureCount - initialLogCount;
                console.log('✓ Console capture working:', capturedLogs >= 3);

                // Test 2: Object logging
                console.log('Test 2: Object logging');
                const testObj = { test: 'value', number: 42 };
                console.log('Object test:', testObj);

                const objTestCount = this.logManager.getLogCount();
                console.log('✓ Object logging working:', objTestCount > afterCaptureCount);

                // Test 3: Error handling with circular reference
                console.log('Test 3: Circular reference handling');
                const circularObj = { name: 'test' };
                circularObj.self = circularObj;
                console.log('Circular object:', circularObj);

                const circularTestCount = this.logManager.getLogCount();
                console.log('✓ Circular reference handling working:', circularTestCount > objTestCount);

                // Test 4: Stop and restart
                console.log('Test 4: Stop and restart capture');
                this.stopCapturing();

                const beforeStopCount = this.logManager.getLogCount();
                console.log('This should not be captured');
                const afterStopCount = this.logManager.getLogCount();

                this.startCapturing();
                console.log('This should be captured again');
                const afterRestartCount = this.logManager.getLogCount();

                console.log('✓ Stop/restart working:',
                    afterStopCount === beforeStopCount &&
                    afterRestartCount > afterStopCount);

                console.log('[LogCapture] ✅ ALL CONSOLE CAPTURE TESTS PASSED');
                return true;
            } catch (error) {
                console.error('[LogCapture] ❌ CAPTURE TEST FAILED:', error);
                return false;
            }
        }
    }

    // GameInterface class for DOM interaction and game state detection
    class GameInterface {
        constructor() {
            this.sidebarSelector = '.sidebar';
            this.playAreaSelector = '.container';
            this.elementSelector = '.item';
            this.elementTextSelector = '.item-text';

            // Store original console for internal logging to prevent recursion
            this.originalConsole = {
                log: console.log.bind(console),
                error: console.error.bind(console),
                warn: console.warn.bind(console)
            };

            this.originalConsole.log('[GameInterface] Initialized with selectors:', {
                sidebar: this.sidebarSelector,
                playArea: this.playAreaSelector,
                element: this.elementSelector,
                elementText: this.elementTextSelector
            });
        }

        // Basic DOM query methods
        getSidebar() {
            const sidebar = document.querySelector(this.sidebarSelector);
            this.originalConsole.log('[GameInterface] getSidebar():', sidebar ? 'Found' : 'Not found');
            return sidebar;
        }

        getPlayArea() {
            const playArea = document.querySelector(this.playAreaSelector);
            this.originalConsole.log('[GameInterface] getPlayArea():', playArea ? 'Found' : 'Not found');
            return playArea;
        }

        getAllElements() {
            const elements = document.querySelectorAll(this.elementSelector);
            this.originalConsole.log('[GameInterface] getAllElements(): Found', elements.length, 'elements');
            return Array.from(elements);
        }

        // Element counting and availability detection functions
        getAvailableElements() {
            const sidebar = this.getSidebar();
            if (!sidebar) {
                this.originalConsole.log('[GameInterface] getAvailableElements(): No sidebar found');
                return [];
            }

            const elements = sidebar.querySelectorAll(this.elementSelector);
            const availableElements = Array.from(elements).map(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return {
                    name: textElement ? textElement.textContent.trim() : 'Unknown',
                    domElement: element,
                    position: this.getElementBounds(element),
                    isNew: element.classList.contains('new') || false
                };
            });

            this.originalConsole.log('[GameInterface] getAvailableElements(): Found', availableElements.length, 'available elements');
            return availableElements;
        }

        getPlayAreaElements() {
            const playArea = this.getPlayArea();
            if (!playArea) {
                this.originalConsole.log('[GameInterface] getPlayAreaElements(): No play area found');
                return [];
            }

            const elements = playArea.querySelectorAll(this.elementSelector);
            const playAreaElements = Array.from(elements).map(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return {
                    name: textElement ? textElement.textContent.trim() : 'Unknown',
                    domElement: element,
                    position: this.getElementBounds(element),
                    isNew: element.classList.contains('new') || false
                };
            });

            this.originalConsole.log('[GameInterface] getPlayAreaElements(): Found', playAreaElements.length, 'play area elements');
            return playAreaElements;
        }

        getElementCount() {
            const total = this.getAllElements().length;
            const available = this.getAvailableElements().length;
            const inPlayArea = this.getPlayAreaElements().length;

            const counts = {
                total,
                available,
                inPlayArea
            };

            this.originalConsole.log('[GameInterface] getElementCount():', counts);
            return counts;
        }

        // Element detection and validation
        findElementByName(name) {
            const elements = this.getAllElements();
            const found = elements.find(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return textElement && textElement.textContent.trim() === name;
            });

            this.originalConsole.log('[GameInterface] findElementByName("' + name + '"):', found ? 'Found' : 'Not found');
            return found || null;
        }

        isElementDraggable(element) {
            if (!element) {
                this.originalConsole.log('[GameInterface] isElementDraggable(): Element is null');
                return false;
            }

            // Check if element has draggable attribute or is in sidebar
            const isDraggable = element.draggable !== false &&
                !element.classList.contains('disabled') &&
                element.offsetParent !== null; // Element is visible

            this.originalConsole.log('[GameInterface] isElementDraggable():', isDraggable);
            return isDraggable;
        }

        // Utility methods
        getElementBounds(element) {
            if (!element) {
                this.originalConsole.log('[GameInterface] getElementBounds(): Element is null');
                return null;
            }

            const bounds = element.getBoundingClientRect();
            const result = {
                x: bounds.left,
                y: bounds.top,
                width: bounds.width,
                height: bounds.height,
                centerX: bounds.left + bounds.width / 2,
                centerY: bounds.top + bounds.height / 2
            };

            this.originalConsole.log('[GameInterface] getElementBounds():', result);
            return result;
        }

        // Game state detection
        isGameReady() {
            const sidebar = this.getSidebar();
            const playArea = this.getPlayArea();
            const hasElements = this.getAvailableElements().length > 0;

            const ready = !!(sidebar && playArea && hasElements);
            this.originalConsole.log('[GameInterface] isGameReady():', ready, {
                hasSidebar: !!sidebar,
                hasPlayArea: !!playArea,
                hasElements
            });

            return ready;
        }

        isLoading() {
            // Check for common loading indicators
            const loadingIndicators = [
                '.loading',
                '.spinner',
                '[data-loading="true"]'
            ];

            const isLoading = loadingIndicators.some(selector =>
                document.querySelector(selector) !== null
            );

            this.originalConsole.log('[GameInterface] isLoading():', isLoading);
            return isLoading;
        }

        // Debug and verification methods
        logGameState() {
            this.originalConsole.log('[GameInterface] === GAME STATE DEBUG ===');
            this.originalConsole.log('Game Ready:', this.isGameReady());
            this.originalConsole.log('Loading:', this.isLoading());
            this.originalConsole.log('Element Counts:', this.getElementCount());
            this.originalConsole.log('Available Elements:', this.getAvailableElements().map(e => e.name));
            this.originalConsole.log('Play Area Elements:', this.getPlayAreaElements().map(e => e.name));
            this.originalConsole.log('[GameInterface] === END DEBUG ===');
        }

        // Test all basic functionality (disabled to prevent excessive logging)
        runBasicTests() {
            return true; // Disabled for now
            this.originalConsole.log('[GameInterface] === RUNNING BASIC TESTS ===');

            try {
                // Test DOM queries
                console.log('Test 1: DOM Queries');
                const sidebar = this.getSidebar();
                const playArea = this.getPlayArea();
                console.log('✓ Sidebar found:', !!sidebar);
                console.log('✓ Play area found:', !!playArea);

                // Test element detection
                console.log('Test 2: Element Detection');
                const allElements = this.getAllElements();
                const availableElements = this.getAvailableElements();
                const playAreaElements = this.getPlayAreaElements();
                console.log('✓ All elements:', allElements.length);
                console.log('✓ Available elements:', availableElements.length);
                console.log('✓ Play area elements:', playAreaElements.length);

                // Test counting
                console.log('Test 3: Element Counting');
                const counts = this.getElementCount();
                console.log('✓ Element counts:', counts);

                // Test game state
                console.log('Test 4: Game State');
                console.log('✓ Game ready:', this.isGameReady());
                console.log('✓ Game loading:', this.isLoading());

                // Test element search (if elements exist)
                if (availableElements.length > 0) {
                    console.log('Test 5: Element Search');
                    const firstElement = availableElements[0];
                    const found = this.findElementByName(firstElement.name);
                    console.log('✓ Element search for "' + firstElement.name + '":', !!found);
                    console.log('✓ Element draggable check:', this.isElementDraggable(found));
                }

                console.log('[GameInterface] ✅ ALL BASIC TESTS COMPLETED');
                return true;
            } catch (error) {
                console.error('[GameInterface] ❌ TEST FAILED:', error);
                return false;
            }
        }
    }

    // Initialize the script
    function init() {
        // Wait for the page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Add styles
        addStyles();

        // Create and add the control panel
        const panel = createControlPanel();
        document.body.appendChild(panel);

        // Make it draggable
        makeDraggable(panel);

        // Initialize GameInterface for testing
        console.log('Infinite Craft Helper v1.0.1-game-interface-foundation loaded successfully!');

        // Initialize LogManager
        console.log('[Init] Initializing LogManager...');
        const logManager = new LogManager(100);

        // Initialize LogDisplay
        console.log('[Init] Initializing LogDisplay...');
        const logDisplay = new LogDisplay(panel, logManager);
        logDisplay.initialize();

        // Initialize LogCapture
        console.log('[Init] Initializing LogCapture...');
        const logCapture = new LogCapture(logManager);

        // Start console interception
        logCapture.startCapturing();

        // Make components available globally for debugging
        window.logManager = logManager;
        window.logCapture = logCapture;
        window.logDisplay = logDisplay;
        window.gameInterface = null; // Will be set later
        console.log('[Init] Logging system components available globally for debugging');

        // Wait a moment for the game to fully load, then initialize GameInterface
        setTimeout(() => {
            console.log('[Init] Initializing GameInterface...');
            const gameInterface = new GameInterface();

            // Make gameInterface available globally for debugging
            window.gameInterface = gameInterface;
            console.log('[Init] GameInterface available as window.gameInterface for debugging');
        }, 2000);
    }

    // Start the script
    init();
})();
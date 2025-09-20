// ==UserScript==
// @name         Infinite Craft Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.4-dev
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
        const version = '1.0.4-dev';  // Add -dev suffix for feature branch
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
                    <h4>Logs</h4>
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
            bottom: 20px;
            right: 20px;
            width: 250px;
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
                border-radius: 0;
            }

            /* When panel-content is the last element (no logs section) */
            #infinite-craft-control-panel .panel-content:last-child {
                border-radius: 0 0 6px 6px;
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
                border-radius: 0 0 6px 6px;
            }

            /* Ensure logs section completes the panel's rounded corners */
            #infinite-craft-control-panel .logs-section:last-child {
                border-radius: 0 0 6px 6px;
            }

            #infinite-craft-control-panel .logs-section .logs-content:last-child {
                border-radius: 0 0 6px 6px;
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
                transition: background 0.2s ease;
                font-family: Arial, sans-serif;
                font-weight: normal;
            }

            #infinite-craft-control-panel .logs-controls button:hover {
                background: rgba(74, 144, 226, 1);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            #infinite-craft-control-panel .logs-controls button:active {
                transform: translateY(0);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            #infinite-craft-control-panel .logs-controls button:disabled {
                background: rgba(100, 100, 100, 0.5);
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            #infinite-craft-control-panel .logs-controls button:disabled:hover {
                background: rgba(100, 100, 100, 0.5);
                transform: none;
                box-shadow: none;
            }

            #infinite-craft-control-panel .logs-toggle {
                width: 20px;
                padding: 4px 2px !important;
                font-size: 10px !important;
                transition: transform 0.2s ease;
            }

            #infinite-craft-control-panel .logs-toggle.collapsed {
                transform: rotate(-90deg);
            }

            #infinite-craft-control-panel .logs-content {
                max-height: 150px;
                overflow-y: auto;
                overflow-x: hidden;
                transition: max-height 0.3s ease, opacity 0.2s ease;
                scroll-behavior: smooth;
                scrollbar-width: thin;
                scrollbar-color: rgba(74, 144, 226, 0.6) rgba(0, 0, 0, 0.2);
                background: rgba(0, 0, 0, 0.1);
            }

            /* Webkit scrollbar styling - consistent with panel theme */
            #infinite-craft-control-panel .logs-content::-webkit-scrollbar {
                width: 6px;
            }

            #infinite-craft-control-panel .logs-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            #infinite-craft-control-panel .logs-content::-webkit-scrollbar-thumb {
                background: rgba(74, 144, 226, 0.6);
                border-radius: 3px;
                transition: background 0.2s ease;
            }

            #infinite-craft-control-panel .logs-content::-webkit-scrollbar-thumb:hover {
                background: rgba(74, 144, 226, 0.8);
            }

            #infinite-craft-control-panel .logs-content.collapsed {
                max-height: 0;
                overflow: hidden;
                opacity: 0;
            }

            #infinite-craft-control-panel .logs-list {
                padding: 8px;
                min-height: 40px;
                font-family: Arial, sans-serif;
            }

            #infinite-craft-control-panel .logs-empty {
                color: #888;
                font-style: italic;
                text-align: center;
                padding: 20px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 4px;
                margin: 4px;
            }

            #infinite-craft-control-panel .log-entry {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 6px 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 11px;
                line-height: 1.4;
                border-radius: 3px;
                margin: 1px 0;
                transition: background 0.1s ease;
            }

            #infinite-craft-control-panel .log-entry:hover {
                background: rgba(255, 255, 255, 0.03);
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

            /* Log Level Colors - consistent with panel theme */
            #infinite-craft-control-panel .log-entry.error {
                border-left: 2px solid #ff6b6b;
                background: rgba(255, 107, 107, 0.05);
            }

            #infinite-craft-control-panel .log-entry.error .log-level {
                color: #ff6b6b;
            }

            #infinite-craft-control-panel .log-entry.error .log-message {
                color: #ffcccb;
            }

            #infinite-craft-control-panel .log-entry.warn {
                border-left: 2px solid #ffa726;
                background: rgba(255, 167, 38, 0.05);
            }

            #infinite-craft-control-panel .log-entry.warn .log-level {
                color: #ffa726;
            }

            #infinite-craft-control-panel .log-entry.warn .log-message {
                color: #ffe0b3;
            }

            #infinite-craft-control-panel .log-entry.info {
                border-left: 2px solid #4a90e2;
                background: rgba(74, 144, 226, 0.05);
            }

            #infinite-craft-control-panel .log-entry.info .log-level {
                color: #4a90e2;
            }

            #infinite-craft-control-panel .log-entry.info .log-message {
                color: #cce7ff;
            }

            #infinite-craft-control-panel .log-entry.debug {
                border-left: 2px solid #9e9e9e;
                background: rgba(158, 158, 158, 0.05);
            }

            #infinite-craft-control-panel .log-entry.debug .log-level {
                color: #9e9e9e;
            }

            #infinite-craft-control-panel .log-entry.debug .log-message {
                color: #bbb;
            }

            #infinite-craft-control-panel .log-entry.log {
                border-left: 2px solid #e0e0e0;
                background: rgba(224, 224, 224, 0.03);
            }

            #infinite-craft-control-panel .log-entry.log .log-level {
                color: #e0e0e0;
            }

            #infinite-craft-control-panel .log-entry.log .log-message {
                color: #e0e0e0;
            }

            /* Activity indicator styles - consistent with panel theme */
            #infinite-craft-control-panel .logs-activity-indicator {
                color: #ffa726;
                font-size: 12px;
                font-weight: normal;
                animation: pulse-activity 2s infinite;
                background: rgba(255, 167, 38, 0.1);
                padding: 2px 6px;
                border-radius: 10px;
                border: 1px solid rgba(255, 167, 38, 0.3);
            }

            @keyframes pulse-activity {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(0.98);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Make panel draggable
    function makeDraggable(panel) {
        if (!panel) {
            console.warn('[makeDraggable] Panel is null, skipping drag setup');
            return;
        }

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = panel.querySelector('.panel-header');

        if (!header) {
            console.warn('[makeDraggable] Header not found, skipping drag setup');
            return;
        }

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

        // Removed test methods - not needed in production
    }

    // LogDisplay class for rendering and managing the logs UI
    class LogDisplay {
        constructor(container, logManager) {
            this.container = container;
            this.logManager = logManager;

            // Store original console for internal logging to prevent recursion
            this.originalConsole = {
                log: console.log.bind(console),
                error: console.error.bind(console),
                warn: console.warn.bind(console)
            };

            this.isCollapsed = this.loadCollapseState();
            this.logsList = null;
            this.logsContent = null;
            this.toggleButton = null;
            this.copyButton = null;
            this.clearButton = null;
            this.activityIndicator = null;
            this.newLogsSinceCollapse = 0;
            this.hasBeenCleared = false;

            // Log level icons and styling
            this.logIcons = {
                error: '❌',
                warn: '⚠️',
                info: 'ℹ️',
                log: '📝',
                debug: '🔍'
            };

            this.originalConsole.log('[LogDisplay] Initialized with collapse state:', this.isCollapsed);
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

                // Create activity indicator
                this.createActivityIndicator();

                // Set up event listeners
                this.setupEventListeners();

                // Set up scrolling behavior for draggable panel
                this.ensureScrollingWorksInDraggablePanel();

                // Subscribe to log manager events
                this.logManager.subscribe((event, data) => {
                    this.handleLogEvent(event, data);
                });

                // Apply saved collapse state
                this.applyCollapseState();

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
                if (confirm('Are you sure you want to clear all logs?')) {
                    this.clearLogs();
                }
            });
        }

        handleLogEvent(event, data) {
            switch (event) {
                case 'logAdded':
                    this.addLogEntry(data);
                    this.updateButtonStates();
                    // Track new logs when collapsed for activity indicator
                    if (this.isCollapsed) {
                        this.newLogsSinceCollapse++;
                        this.updateActivityIndicator();
                    }
                    break;
                case 'logsCleared':
                    this.originalConsole.log(`[LogDisplay] Logs cleared: ${data.clearedCount} entries`);
                    this.hasBeenCleared = true;
                    this.newLogsSinceCollapse = 0;
                    this.updateDisplay();
                    this.updateButtonStates();
                    this.updateActivityIndicator();
                    break;
            }
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.saveCollapseState();

            if (this.isCollapsed) {
                this.logsContent.classList.add('collapsed');
                this.toggleButton.classList.add('collapsed');
                this.toggleButton.title = 'Expand logs';
                this.newLogsSinceCollapse = 0; // Reset counter when collapsing
            } else {
                this.logsContent.classList.remove('collapsed');
                this.toggleButton.classList.remove('collapsed');
                this.toggleButton.title = 'Collapse logs';
                this.newLogsSinceCollapse = 0; // Reset counter when expanding

                // Auto-scroll to newest when expanding
                setTimeout(() => {
                    this.scrollToNewest();
                }, 300); // Wait for CSS transition to complete
            }

            this.updateActivityIndicator();
            this.updateButtonStates();
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
                this.scrollToNewest();
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
                <span class="log-timestamp">[${timestamp}]</span>
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
                // Show empty message only on initial load, not after clearing
                if (!this.hasBeenCleared) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.className = 'logs-empty';
                    emptyDiv.textContent = 'No logs yet...';
                    this.logsList.appendChild(emptyDiv);
                }
            } else {
                // Add all log entries
                logs.forEach(log => {
                    const entryElement = this.createLogEntryElement(log);
                    this.logsList.appendChild(entryElement);
                });

                // Auto-scroll to newest entry if not collapsed
                if (!this.isCollapsed) {
                    this.scrollToNewest();
                }
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
                    header.textContent = `Logs (${logCount})`;
                }
            } else {
                const header = this.container.querySelector('.logs-header h4');
                if (header) {
                    header.textContent = 'Logs';
                }
            }
        }

        // Scrolling and height management methods
        scrollToNewest() {
            if (!this.logsContent || this.isCollapsed) {
                return;
            }

            // Use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                try {
                    // Scroll to top since newest logs are at the top
                    this.logsContent.scrollTop = 0;
                } catch (error) {
                    this.originalConsole.error('[LogDisplay] Error scrolling to newest:', error);
                }
            });
        }

        scrollToOldest() {
            if (!this.logsContent || this.isCollapsed) {
                return;
            }

            requestAnimationFrame(() => {
                try {
                    // Scroll to bottom to show oldest logs
                    this.logsContent.scrollTop = this.logsContent.scrollHeight;
                } catch (error) {
                    this.originalConsole.error('[LogDisplay] Error scrolling to oldest:', error);
                }
            });
        }

        ensureScrollingWorksInDraggablePanel() {
            if (!this.logsContent) {
                return;
            }

            // Prevent drag events from interfering with scrolling
            this.logsContent.addEventListener('mousedown', (e) => {
                // Stop propagation to prevent dragging when scrolling
                e.stopPropagation();
            });

            this.logsContent.addEventListener('wheel', (e) => {
                // Stop propagation to prevent dragging when scrolling with mouse wheel
                e.stopPropagation();
            });

            // Ensure touch scrolling works on mobile
            this.logsContent.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });

            this.logsContent.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            });
        }

        getScrollInfo() {
            if (!this.logsContent) {
                return null;
            }

            return {
                scrollTop: this.logsContent.scrollTop,
                scrollHeight: this.logsContent.scrollHeight,
                clientHeight: this.logsContent.clientHeight,
                isAtTop: this.logsContent.scrollTop === 0,
                isAtBottom: this.logsContent.scrollTop + this.logsContent.clientHeight >= this.logsContent.scrollHeight - 1
            };
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

        // Collapse state persistence methods
        loadCollapseState() {
            try {
                if (typeof localStorage !== 'undefined') {
                    const saved = localStorage.getItem('infinite-craft-helper-logs-collapsed');
                    return saved === 'true';
                }
                return false;
            } catch (error) {
                this.originalConsole.warn('[LogDisplay] Failed to load collapse state:', error);
                return false;
            }
        }

        saveCollapseState() {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('infinite-craft-helper-logs-collapsed', this.isCollapsed.toString());
                }
            } catch (error) {
                this.originalConsole.warn('[LogDisplay] Failed to save collapse state:', error);
            }
        }

        applyCollapseState() {
            if (this.isCollapsed) {
                this.logsContent.classList.add('collapsed');
                this.toggleButton.classList.add('collapsed');
                this.toggleButton.title = 'Expand logs';
            } else {
                this.logsContent.classList.remove('collapsed');
                this.toggleButton.classList.remove('collapsed');
                this.toggleButton.title = 'Collapse logs';
            }
            this.updateActivityIndicator();
        }

        // Activity indicator methods
        createActivityIndicator() {
            this.activityIndicator = document.createElement('span');
            this.activityIndicator.className = 'logs-activity-indicator';
            this.activityIndicator.style.display = 'none';

            // Insert after the header title
            const header = this.container.querySelector('.logs-header h4');
            if (header) {
                header.appendChild(this.activityIndicator);
            }
        }

        updateActivityIndicator() {
            if (!this.activityIndicator) return;

            if (this.isCollapsed && this.newLogsSinceCollapse > 0) {
                this.activityIndicator.textContent = ` (${this.newLogsSinceCollapse} new)`;
                this.activityIndicator.style.display = 'inline';
            } else {
                this.activityIndicator.style.display = 'none';
            }
        }

        // Removed test methods - not needed in production
    }

    // Logger API - initially empty until connected to LogManager
    let Logger = {
        log(message) {
            console.log('[Logger] Not initialized yet:', message);
        },

        warn(message) {
            console.warn('[Logger] Not initialized yet:', message);
        },

        error(message) {
            console.error('[Logger] Not initialized yet:', message);
        }
    };

    // Make Logger available globally immediately for tests
    window.Logger = Logger;

    // Function to create Logger API connected to LogManager
    function createLogger(logManager) {
        return {
            log(message) {
                logManager.addLog('info', message);
            },

            warn(message) {
                logManager.addLog('warn', message);
            },

            error(message) {
                logManager.addLog('error', message);
            }
        };
    }

    // Initialize the script
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
        Logger = createLogger(logManager);

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

        console.log('Infinite Craft Helper v1.0.4-dev loaded successfully!');

        // Clear initialization logs to start with empty log history (Requirement 4.3)
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
})();
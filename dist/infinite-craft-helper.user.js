// ==UserScript==
// @name         Infinite Craft Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.4-feature/game-interface-foundation
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

    // === core/log-entry.js ===
    /**
     * Log entry data structure
     * Represents a single log entry with metadata
     */

    /**
     * Log entry data structure
     */
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

    // === core/log-manager.js ===
    /**
     * LogManager class for log storage, rotation, and event system
     * Handles log storage, rotation, and event notifications
     */

    /**
     * LogManager class for log storage, rotation, and event system
     */
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
    }

    /**
     * Create Logger API connected to LogManager
     * @param {LogManager} logManager - The log manager instance
     * @returns {Object} Logger API object
     */
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

    // === core/version.js ===
    /**
     * Version management utilities
     * Handles version information and display formatting
     */

    /**
     * Get version info from userscript metadata
     * @returns {Object} Version information object
     */
    function getVersionInfo() {
        const gmInfo = typeof globalThis !== 'undefined' ? globalThis.GM_info : undefined;
        const gmVersion = gmInfo && gmInfo.script && gmInfo.script.version ? gmInfo.script.version : null;

        const injectedVersion = typeof window !== 'undefined' && window.__INFINITE_CRAFT_HELPER_VERSION__
            ? window.__INFINITE_CRAFT_HELPER_VERSION__
            : null;

        let version = gmVersion || injectedVersion || '{{VERSION}}';

        if (version === '{{VERSION}}') {
            version = 'dev-local';
        }

        const isDevVersion = /dev|test|-/.test(version);

        return {
            version,
            isDev: isDevVersion,
            displayVersion: isDevVersion ? version : `v${version}`,
            tag: isDevVersion ? 'DEV' : null
        };
    }

    // === ui/panel-styles.js ===
    /**
     * Panel styles
     * CSS styles for the main control panel structure and header
     */

    /**
     * Get panel CSS styles
     * @returns {string} CSS styles for the panel
     */
    function getPanelStyles() {
        return `
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
        `;
    }

    // === ui/log-styles/section.js ===
    /**
     * Core layout styles for the logs section container, header, controls, and scroll area.
     * @returns {string} CSS rules covering structural layout.
     */
    function buildLogSectionStyles() {
        return `
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
        `;
    }

    // === ui/log-styles/entries.js ===
    /**
     * Styles that shape the visual presentation for log entries and message content.
     * @returns {string} CSS rules for individual log rows.
     */
    function buildLogEntryStyles() {
        return `
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
        `;
    }

    // === ui/log-styles/activity.js ===
    /**
     * Activity indicator styling and animation for log updates.
     * @returns {string} CSS covering indicator state.
     */
    function buildLogActivityStyles() {
        return `
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
    }

    // === ui/log-styles/index.js ===
    /**
     * Get aggregated log CSS styles for the control panel.
     * @returns {string} Complete CSS payload for log UI components.
     */
    function getLogStyles() {
        return [
            buildLogSectionStyles(),
            buildLogEntryStyles(),
            buildLogActivityStyles()
        ].join('\n');
    }

    // === utils/dom.js ===
    /**
     * DOM utilities and helpers
     * Common DOM manipulation functions used throughout the application
     */

    /**
     * Wait for DOM to be ready
     * @param {Function} callback - Function to call when DOM is ready
     */
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    /**
     * Create and append a style element to the document head
     * @param {string} cssText - CSS text content
     * @returns {HTMLStyleElement} The created style element
     */
    function addStyleSheet(cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        return style;
    }

    /**
     * Safely append element to document body
     * @param {HTMLElement} element - Element to append
     * @returns {boolean} True if successful, false otherwise
     */
    function appendToBody(element) {
        if (document.body) {
            document.body.appendChild(element);
            return true;
        } else {
            console.warn('[DOM] document.body not available, element not added to DOM');
            return false;
        }
    }

    /**
     * Create a DOM element with optional properties
     * @param {string} tagName - HTML tag name
     * @param {Object} options - Optional properties
     * @param {string} options.className - CSS class name
     * @param {string} options.id - Element ID
     * @param {string} options.innerHTML - Inner HTML content
     * @param {Object} options.style - Style properties
     * @param {Object} options.dataset - Data attributes
     * @returns {HTMLElement} Created element
     */
    function createElement(tagName, options = {}) {
        const element = document.createElement(tagName);

        if (options.className) {
            element.className = options.className;
        }

        if (options.id) {
            element.id = options.id;
        }

        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }

        if (options.style) {
            Object.assign(element.style, options.style);
        }

        if (options.dataset) {
            Object.assign(element.dataset, options.dataset);
        }

        return element;
    }

    /**
     * Escape HTML text to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Query selector with error handling
     * @param {string|HTMLElement} container - Container element or selector
     * @param {string} selector - CSS selector
     * @returns {HTMLElement|null} Found element or null
     */
    function safeQuerySelector(container, selector) {
        try {
            const containerElement = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (!containerElement) {
                return null;
            }

            return containerElement.querySelector(selector);
        } catch (error) {
            console.warn('[DOM] Query selector failed:', selector, error);
            return null;
        }
    }

    /**
     * Add event listener with error handling
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event listener options
     * @returns {Function|null} Cleanup function or null if failed
     */
    function addEventListenerSafe(element, event, handler, options = {}) {
        try {
            if (!element || typeof handler !== 'function') {
                console.warn('[DOM] Invalid element or handler for event listener');
                return null;
            }

            element.addEventListener(event, handler, options);

            // Return cleanup function
            return () => {
                element.removeEventListener(event, handler, options);
            };
        } catch (error) {
            console.warn('[DOM] Failed to add event listener:', event, error);
            return null;
        }
    }

    /**
     * Create temporary element for clipboard operations
     * @param {string} text - Text to copy
     * @returns {HTMLTextAreaElement} Temporary textarea element
     */
    function createTempTextarea(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        return textarea;
    }

    /**
     * Remove element safely
     * @param {HTMLElement} element - Element to remove
     * @returns {boolean} True if removed successfully
     */
    function removeElement(element) {
        try {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
                return true;
            }
            return false;
        } catch (error) {
            console.warn('[DOM] Failed to remove element:', error);
            return false;
        }
    }

    // === ui/styles.js ===
    /**
     * CSS styles injection
     * Combines panel and log styles and injects them into the document
     */

    /**
     * Add CSS styles to the document
     */
    function addStyles() {
        const cssText = getPanelStyles() + getLogStyles();
        addStyleSheet(cssText);
    }

    // === ui/control-panel.js ===
    /**
     * Main control panel creation
     * Creates and configures the draggable control panel overlay
     */

    /**
     * Create the overlay control panel
     * @returns {HTMLElement} The created panel element
     */
    function createControlPanel() {
        const versionInfo = getVersionInfo();

        const versionDisplay = versionInfo.tag
            ? `<span class="version ${versionInfo.isDev ? 'dev-version' : ''}">${versionInfo.displayVersion} <span class="dev-tag">${versionInfo.tag}</span></span>`
            : `<span class="version">${versionInfo.displayVersion}</span>`;

        const panelHTML = `
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

        const panel = createElement('div', {
            id: 'infinite-craft-control-panel',
            innerHTML: panelHTML,
            style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '250px',
                background: 'rgba(30, 30, 30, 0.95)',
                border: '2px solid #4a90e2',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                zIndex: '10000',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                transform: 'scale(1.5)',
                transformOrigin: 'bottom right'
            }
        });

        return panel;
    }

    // === ui/draggable.js ===
    /**
     * Drag functionality
     * Makes the control panel draggable by its header
     */

    /**
     * Make panel draggable
     * @param {HTMLElement} panel - The panel element to make draggable
     */
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

    // === ui/log-display-controls.js ===
    /**
     * Log display controls and interactions
     * Handles button events, clipboard operations, and user interactions
     */

    /**
     * Add control methods to LogDisplay prototype
     * @param {LogDisplay} LogDisplay - The LogDisplay class
     */
    function addControlMethods(LogDisplay) {
        LogDisplay.prototype.setupEventListeners = function() {
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
        };

        LogDisplay.prototype.toggleCollapse = function() {
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
        };

        LogDisplay.prototype.copyLogsToClipboard = function() {
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
        };

        LogDisplay.prototype.fallbackCopyToClipboard = function(text) {
            try {
                // Create temporary textarea
                const textarea = createTempTextarea(text);
                appendToBody(textarea);

                textarea.select();
                const success = document.execCommand('copy');
                removeElement(textarea);

                this.showCopyFeedback(success);
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Fallback copy failed:', error);
                this.showCopyFeedback(false);
            }
        };

        LogDisplay.prototype.showCopyFeedback = function(success) {
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = success ? '✓ Copied!' : '✗ Failed';
            this.copyButton.style.background = success ? '#4caf50' : '#f44336';

            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.style.background = '';
            }, 2000);
        };

        LogDisplay.prototype.clearLogs = function() {
            const clearedCount = this.logManager.clearLogs();
            this.originalConsole.log(`[LogDisplay] Cleared ${clearedCount} logs`);
        };
    }

    // === ui/log-display-utils.js ===
    /**
     * Log display utility methods
     * Handles scrolling, DOM manipulation, and helper functions
     */

    /**
     * Add utility methods to LogDisplay prototype
     * @param {LogDisplay} LogDisplay - The LogDisplay class
     */
    function addUtilityMethods(LogDisplay) {
        // Scrolling and height management methods
        LogDisplay.prototype.scrollToNewest = function() {
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
        };

        LogDisplay.prototype.scrollToOldest = function() {
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
        };

        LogDisplay.prototype.ensureScrollingWorksInDraggablePanel = function() {
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
        };

        LogDisplay.prototype.getScrollInfo = function() {
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
        };
    }

    // === ui/log-display-render.js ===
    /**
     * Augment LogDisplay with rendering and activity-handling behaviours.
     * @param {typeof import('./log-display-core.js').LogDisplay} LogDisplay
     */
    function addRenderMethods(LogDisplay) {
        LogDisplay.prototype.handleLogEvent = function handleLogEvent(event, data) {
            switch (event) {
                case 'logAdded':
                    this.addLogEntry(data);
                    this.updateButtonStates();
                    if (this.isCollapsed) {
                        this.newLogsSinceCollapse += 1;
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
                default:
                    break;
            }
        };

        LogDisplay.prototype.addLogEntry = function addLogEntry(logEntry) {
            const emptyMessage = this.logsList.querySelector('.logs-empty');
            if (emptyMessage) {
                emptyMessage.remove();
            }

            const entryElement = this.createLogEntryElement(logEntry);
            this.logsList.insertBefore(entryElement, this.logsList.firstChild);

            if (!this.isCollapsed) {
                this.scrollToNewest();
            }
        };

        LogDisplay.prototype.createLogEntryElement = function createLogEntryElement(logEntry) {
            const entry = createElement('div', {
                className: `log-entry ${logEntry.level}`,
                dataset: { logId: logEntry.id }
            });

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
                <span class="log-message">${escapeHtml(logEntry.message)}</span>
            `;

            return entry;
        };

        LogDisplay.prototype.updateDisplay = function updateDisplay() {
            const logs = this.logManager.getLogs();
            this.logsList.innerHTML = '';

            if (logs.length === 0) {
                if (!this.hasBeenCleared) {
                    const emptyDiv = createElement('div', {
                        className: 'logs-empty',
                        innerHTML: 'No logs yet...'
                    });
                    this.logsList.appendChild(emptyDiv);
                }
            } else {
                logs.forEach(log => {
                    const entryElement = this.createLogEntryElement(log);
                    this.logsList.appendChild(entryElement);
                });

                if (!this.isCollapsed) {
                    this.scrollToNewest();
                }
            }

            this.updateButtonStates();
        };

        LogDisplay.prototype.updateButtonStates = function updateButtonStates() {
            const logCount = this.logManager.getLogCount();
            this.copyButton.disabled = logCount === 0;
            this.clearButton.disabled = logCount === 0;

            const header = this.container.querySelector('.logs-header h4');
            if (!header) {
                return;
            }

            if (this.isCollapsed && logCount > 0) {
                header.textContent = `Logs (${logCount})`;
            } else {
                header.textContent = 'Logs';
            }
        };

        LogDisplay.prototype.createActivityIndicator = function createActivityIndicator() {
            this.activityIndicator = createElement('span', {
                className: 'logs-activity-indicator',
                style: { display: 'none' }
            });

            const header = this.container.querySelector('.logs-header h4');
            if (header) {
                header.appendChild(this.activityIndicator);
            }
        };

        LogDisplay.prototype.updateActivityIndicator = function updateActivityIndicator() {
            if (!this.activityIndicator) {
                return;
            }

            if (this.isCollapsed && this.newLogsSinceCollapse > 0) {
                this.activityIndicator.textContent = ` (${this.newLogsSinceCollapse} new)`;
                this.activityIndicator.style.display = 'inline';
            } else {
                this.activityIndicator.style.display = 'none';
            }
        };
    }

    // === ui/log-display-core.js ===
    /**
     * Core log display functionality
     * Handles initialization, DOM setup, and basic display operations
     */

    /**
     * LogDisplay class for rendering and managing the logs UI
     */
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

    }

    // Add control and utility methods to the LogDisplay class
    addControlMethods(LogDisplay);
    addUtilityMethods(LogDisplay);
    addRenderMethods(LogDisplay);

    // === main.js ===
    /**
     * Entry point and initialization
     * Main initialization logic for the Infinite Craft Helper userscript
     */

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

})();
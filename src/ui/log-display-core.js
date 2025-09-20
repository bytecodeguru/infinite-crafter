/**
 * Core log display functionality
 * Handles initialization, DOM setup, and basic display operations
 */

import { addControlMethods } from './log-display-controls.js';
import { addUtilityMethods } from './log-display-utils.js';
import { createElement, escapeHtml, safeQuerySelector } from '../utils/dom.js';

/**
 * LogDisplay class for rendering and managing the logs UI
 */
export class LogDisplay {
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
    }

    updateDisplay() {
        const logs = this.logManager.getLogs();

        // Clear current display
        this.logsList.innerHTML = '';

        if (logs.length === 0) {
            // Show empty message only on initial load, not after clearing
            if (!this.hasBeenCleared) {
                const emptyDiv = createElement('div', {
                    className: 'logs-empty',
                    innerHTML: 'No logs yet...'
                });
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

    // Note: escapeHtml is now imported from utils/dom.js

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
        this.activityIndicator = createElement('span', {
            className: 'logs-activity-indicator',
            style: { display: 'none' }
        });

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
}

// Add control and utility methods to the LogDisplay class
addControlMethods(LogDisplay);
addUtilityMethods(LogDisplay);
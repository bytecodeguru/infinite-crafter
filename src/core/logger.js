/**
 * LogManager and Logger API
 * Handles log storage, rotation, event system, and UI display
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

/**
 * LogManager class for log storage, rotation, and event system
 */
export class LogManager {
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
}

/**
 * Create Logger API connected to LogManager
 * @param {LogManager} logManager - The log manager instance
 * @returns {Object} Logger API object
 */
export function createLogger(logManager) {
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
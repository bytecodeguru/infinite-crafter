/**
 * Log display controls and interactions
 * Handles button events, clipboard operations, and user interactions
 */

/**
 * Add control methods to LogDisplay prototype
 * @param {LogDisplay} LogDisplay - The LogDisplay class
 */
export function addControlMethods(LogDisplay) {
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
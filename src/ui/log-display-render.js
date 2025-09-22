import { createElement, escapeHtml } from '../utils/dom.js';

/**
 * Augment LogDisplay with rendering and activity-handling behaviours.
 * @param {typeof import('./log-display-core.js').LogDisplay} LogDisplay
 */
export function addRenderMethods(LogDisplay) {
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

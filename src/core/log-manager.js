/**
 * LogManager class for log storage, rotation, and event system
 * Handles log storage, rotation, and event notifications
 */

import { LogEntry } from './log-entry.js';

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
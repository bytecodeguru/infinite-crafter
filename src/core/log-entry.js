/**
 * Log entry data structure
 * Represents a single log entry with metadata
 */

/**
 * Log entry data structure
 */
export class LogEntry {
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
export class Logger {
    constructor() {
        this.entries = [];
    }

    log(message) {
        this.entries.push({ level: 'info', message });
        return this.entries.length;
    }

    warn(message) {
        this.entries.push({ level: 'warn', message });
        return this.entries.length;
    }
}

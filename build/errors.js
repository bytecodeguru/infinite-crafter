export class BuildError extends Error {
    constructor(message, { file = null, line = null, column = null, stage = null, cause = null } = {}) {
        super(message);
        this.name = 'BuildError';
        this.file = file;
        this.line = line;
        this.column = column;
        this.stage = stage;
        if (cause) {
            this.cause = cause;
        }
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BuildError);
        }
    }

    toLogString() {
        const parts = [this.message];
        if (this.stage) {
            parts.unshift(`[${this.stage}]`);
        }
        if (this.file) {
            const location = this.line ? `${this.file}:${this.line}${this.column ? `:${this.column}` : ''}` : this.file;
            parts.push(`(@ ${location})`);
        }
        return parts.join(' ');
    }
}

export function toBuildError(error, fallbackMessage, meta = {}) {
    if (error instanceof BuildError) {
        return error;
    }
    return new BuildError(fallbackMessage || error.message, { ...meta, cause: error });
}

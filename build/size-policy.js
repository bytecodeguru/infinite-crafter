import { BuildError } from './errors.js';
import { lineCount } from './size-utils.js';

export class SizePolicy {
    constructor(config) {
        this.config = config;
        this.maxFileLines = config.maxFileLines || 300;
        this.maxFunctionLines = config.maxFunctionLines || 50;
        this.recommendedFileLines = config.recommendedFileLines || 200;
        this.recommendedFunctionLines = config.recommendedFunctionLines || 30;
        this.enforce = !!(config.build && (config.build.enforcePolicy === true || config.build.enforcePolicy === 'strict'));
    }

    validateModule(module) {
        this.validateFileSize(module.path, module.content);
        this.validateFunctionSizes(module.path, module.content);
    }

    validateFileSize(filePath, content) {
        const lines = lineCount(content);
        if (lines > this.maxFileLines) {
            if (this.enforce) {
                throw new BuildError(`File ${filePath} exceeds ${this.maxFileLines} lines (${lines}).`, {
                    stage: 'size-policy',
                    file: filePath,
                    line: this.maxFileLines
                });
            }
            console.warn(`[size-policy] ${filePath} exceeds ${this.maxFileLines} line limit (${lines}).`);
        }
        if (lines > this.recommendedFileLines) {
            console.warn(`[size-policy] ${filePath} exceeds recommended ${this.recommendedFileLines} lines (${lines}). Consider splitting.`);
        }
    }

    validateFunctionSizes(filePath, content) {
        const lines = content.split(/\r?\n/);

        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index].trim();
            if (!this.looksLikeFunction(line)) {
                continue;
            }

            const startLine = index + 1;
            const nameMatch = line.match(/[\w$]+/g);
            const name = nameMatch ? nameMatch[1] || nameMatch[0] : '<anonymous>';
            const length = this.measureFunctionLength(lines, index);

            if (length > this.maxFunctionLines) {
                if (this.enforce) {
                    throw new BuildError(`Function ${name} in ${filePath} exceeds ${this.maxFunctionLines} lines (${length}).`, {
                        stage: 'size-policy',
                        file: filePath,
                        line: startLine
                    });
                }
                console.warn(`[size-policy] Function ${name} in ${filePath} exceeds ${this.maxFunctionLines} line limit (${length}).`);
            }

            if (length > this.recommendedFunctionLines) {
                console.warn(`[size-policy] Function ${name} in ${filePath} exceeds recommended ${this.recommendedFunctionLines} lines (${length}).`);
            }
        }
    }

    measureFunctionLength(lines, index) {
        let depth = 0;
        let length = 0;
        let started = false;

        for (let i = index; i < lines.length; i += 1) {
            const line = lines[i];
            const opens = (line.match(/\{/g) || []).length;
            const closes = (line.match(/\}/g) || []).length;

            if (opens > 0) {
                started = true;
            }

            if (started) {
                length += 1;
            }

            depth += opens - closes;
            if (started && depth <= 0) {
                break;
            }
        }

        return length;
    }

    looksLikeFunction(line) {
        if (/^(function|class)\s+[\w$]+/.test(line)) {
            return true;
        }
        if (/^(const|let|var)\s+[\w$]+\s*=\s*(function|\()/.test(line)) {
            return true;
        }
        return false;
    }
}

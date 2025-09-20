#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const includeDirs = ['build', 'src', 'test', 'tests', 'scripts'];
const includeFiles = ['build.config.js', 'playwright.config.js', 'infinite-craft-helper.user.js'];
const ignoreDirs = new Set(['node_modules', 'dist', '.git', '.kiro', 'playwright-report', 'test-results']);
const allowedExtensions = new Set(['.js', '.mjs', '.cjs']);

const lintErrors = [];
const filesScanned = [];

async function main() {
    for (const target of includeDirs) {
        await collectTarget(path.join(projectRoot, target));
    }

    for (const file of includeFiles) {
        await collectTarget(path.join(projectRoot, file));
    }

    for (const filePath of filesScanned) {
        await lintFile(filePath);
    }

    if (lintErrors.length > 0) {
        lintErrors.forEach((error) => {
            console.error(`[lint] ${error.file}:${error.line} - ${error.message}`);
        });

        console.error(`\nLint check failed: ${lintErrors.length} issue${lintErrors.length === 1 ? '' : 's'} detected.`);
        process.exit(1);
    }

    console.log(`Lint check passed (${filesScanned.length} file${filesScanned.length === 1 ? '' : 's'} scanned).`);
}

async function collectTarget(targetPath) {
    try {
        const stats = await fs.stat(targetPath);

        if (stats.isDirectory()) {
            const entries = await fs.readdir(targetPath, { withFileTypes: true });

            for (const entry of entries) {
                if (ignoreDirs.has(entry.name)) {
                    continue;
                }

                await collectTarget(path.join(targetPath, entry.name));
            }
            return;
        }

        if (!stats.isFile()) {
            return;
        }

        const extension = path.extname(targetPath);
        if (allowedExtensions.has(extension)) {
            filesScanned.push(targetPath);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return;
        }

        throw error;
    }
}

async function lintFile(filePath) {
    const relativePath = path.relative(projectRoot, filePath);
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        if (line.includes('\t')) {
            recordError(relativePath, lineNumber, 'Tab character found; use spaces for indentation.');
        }

        if (/\s$/.test(line) && line.trim().length > 0) {
            recordError(relativePath, lineNumber, 'Trailing whitespace detected.');
        }
    });
}

function recordError(file, line, message) {
    lintErrors.push({ file, line, message });
}

main().catch((error) => {
    console.error('Lint runner failed:', error.message);
    process.exit(1);
});

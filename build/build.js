#!/usr/bin/env node

import path from 'path';
import { pathToFileURL } from 'url';
import { BuildManager } from './BuildManager.js';
import defaultConfig from '../build.config.js';
import { parseCommandLine, applyCliOverrides } from './cli-options.js';

/**
 * Main build script entry point
 * Handles command line arguments and orchestrates build operations
 */

const rawArgs = process.argv.slice(2);
const cli = parseCommandLine(rawArgs);

if (cli.errors.length > 0) {
    cli.errors.forEach((message) => console.error(`[31m[ERROR][0m ${message}`));
    console.log();
    showHelp();
    process.exit(1);
}

if (cli.flags.help || cli.command === 'help') {
    showHelp();
    process.exit(0);
}

async function loadConfig(configPath) {
    if (!configPath) {
        return defaultConfig;
    }

    const resolvedPath = path.resolve(process.cwd(), configPath);
    const module = await import(pathToFileURL(resolvedPath).href);
    return module.default || module;
}

async function main() {
    const configModule = await loadConfig(cli.options.configPath).catch((error) => {
        console.error(`Failed to load config at ${cli.options.configPath}:`, error.message);
        process.exit(1);
    });

    const config = applyCliOverrides(configModule, cli);
    const buildManager = new BuildManager(config);

    try {
        if (cli.command === 'clean') {
            await buildManager.clean();
            return;
        }

        if (cli.command === 'watch') {
            await buildManager.watch();
            process.on('SIGINT', async () => {
                console.log('\nShutting down watch mode...');
                await buildManager.stopWatch();
                process.exit(0);
            });
            await new Promise(() => {});
            return;
        }

        await buildManager.build();
        return;
    } catch (error) {
        console.error('Build process failed:', error.message);
        if (cli.flags.verbose && error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
Infinite Craft Helper Build System

Usage: node build/build.js [command] [options]

Commands:
  build            Run a single build (default)
  watch            Watch for file changes and rebuild automatically
  clean            Remove generated build artifacts
  help             Show this help message

Options:
  --config <path>  Use an alternate build configuration file
  --skip-quality   Skip lint/test quality gates (use with caution)
  --verbose, -v    Enable verbose logging output
  --quiet, -q      Reduce logging to warnings and errors
  --watch, -w      Shortcut for the watch command
  --clean, -c      Shortcut for the clean command
  --help, -h       Show this help message

Examples:
  node build/build.js
  node build/build.js watch --verbose
  node build/build.js --config build.config.custom.js --skip-quality
  node build/build.js clean

NPM Scripts:
  npm run build
  npm run build:watch
  npm run clean
`);
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

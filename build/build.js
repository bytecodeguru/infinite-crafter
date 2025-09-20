#!/usr/bin/env node

import { BuildManager } from './BuildManager.js';
import config from '../build.config.js';

/**
 * Main build script entry point
 * Handles command line arguments and orchestrates build operations
 */

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    watch: args.includes('--watch') || args.includes('-w'),
    clean: args.includes('--clean') || args.includes('-c'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h')
};

// Show help if requested
if (options.help) {
    showHelp();
    process.exit(0);
}

// Set verbose logging if requested
if (options.verbose) {
    config.logging.level = 'debug';
}

// Main execution
async function main() {
    const buildManager = new BuildManager(config);

    try {
        if (options.clean) {
            await buildManager.clean();
            return;
        }

        if (options.watch) {
            await buildManager.watch();

            // Keep process alive for watch mode
            process.on('SIGINT', async () => {
                console.log('\nShutting down watch mode...');
                await buildManager.stopWatch();
                process.exit(0);
            });

            // Keep the process running
            await new Promise(() => {});
        } else {
            await buildManager.build();
        }

    } catch (error) {
        console.error('Build process failed:', error.message);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
Infinite Craft Helper Build System

Usage: node build/build.js [options]

Options:
  --watch, -w     Watch for file changes and rebuild automatically
  --clean, -c     Clean build artifacts
  --verbose, -v   Enable verbose logging
  --help, -h      Show this help message

Examples:
  node build/build.js              # Single build
  node build/build.js --watch      # Watch mode
  node build/build.js --clean      # Clean artifacts
  node build/build.js -w -v        # Watch with verbose logging

NPM Scripts:
  npm run build                    # Single build
  npm run build:watch              # Watch mode
  npm run clean                    # Clean artifacts
`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
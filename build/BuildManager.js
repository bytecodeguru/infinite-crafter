import fs from 'fs/promises';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { ModuleResolver } from './ModuleResolver.js';
import { FileConcatenator } from './FileConcatenator.js';
import { BuildError, toBuildError } from './errors.js';

/**
 * BuildManager orchestrates the entire build process for the userscript
 * Handles file watching, incremental builds, and branch-specific configuration
 */
export class BuildManager {
    constructor(config) {
        this.config = config;
        this.watcher = null;
        this.isBuilding = false;
        this.buildStartTime = null;
        this.isWatchMode = false;
        this.rebuildTimer = null;

        // Ensure output directory exists
        this.ensureOutputDir();
    }

    /**
     * Main build method - orchestrates the complete build process
     */
    async build() {
        if (this.isBuilding) {
            this.log('warn', 'Build already in progress, skipping...');
            return false;
        }

        this.isBuilding = true;
        this.buildStartTime = Date.now();

        try {
            this.log('info', 'Starting build process...');

            // Run quality gates (linting, tests, etc.)
            await this.runQualityChecks({ isWatch: this.isWatchMode });

            // Get build context (branch, version, etc.)
            const buildContext = await this.getBuildContext();
            this.log('debug', 'Build context:', buildContext);

            // Validate source directory exists
            await this.validateSourceDirectory();

            // Resolve modules and dependencies
            const moduleResolver = new ModuleResolver(this.config.srcDir, {
                log: this.log.bind(this)
            });

            const modules = await moduleResolver.resolveModules();
            buildContext.sourceFiles = modules.map(m => m.relativePath);

            this.log('info', `Resolved ${modules.length} modules in dependency order`);
            this.log('debug', 'Module order:', modules.map(m => m.relativePath));

            // Concatenate modules into userscript
            this.log('info', 'Concatenating modules...');
            const concatenator = new FileConcatenator(this.config);
            const userscriptContent = await concatenator.concatenateModules(modules, buildContext);

            // Validate syntax
            this.log('info', 'Validating generated userscript...');
            concatenator.validateSyntax(userscriptContent);

            // Write output file
            this.log('info', `Writing userscript to ${buildContext.outputPath}...`);
            await concatenator.writeOutput(userscriptContent, buildContext.outputPath);

            const buildTime = Date.now() - this.buildStartTime;
            this.log('info', `Build completed successfully in ${buildTime}ms`);
            this.log('info', `Output: ${buildContext.outputPath} (${Math.round(userscriptContent.length / 1024)}KB)`);

            return true;

        } catch (error) {
            const buildTime = Date.now() - this.buildStartTime;
            const buildError = toBuildError(error, error.message, { stage: error.stage || 'build' });
            this.log('error', `Build failed after ${buildTime}ms: ${this.describeError(buildError)}`);
            throw buildError;
        } finally {
            this.isBuilding = false;
        }
    }

    /**
     * Watch mode - automatically rebuild on file changes
     */
    async watch() {
        if (this.watcher) {
            this.log('warn', 'Watch mode already active');
            return;
        }

        const watchConfig = this.getWatchConfig();
        const watchPaths = this.resolveWatchPaths(watchConfig);

        this.log('info', 'Starting watch mode (press Ctrl+C to exit)...');
        this.log('info', `Quality gates in watch: ${this.describeQualityStatus(true)}`);
        this.log('info', `Watching: ${watchPaths.join(', ')}`);

        this.isWatchMode = true;
        this.watcher = await this.createWatcher(watchPaths, watchConfig);
        this.setupWatcherListeners(this.watcher, watchConfig);

        await this.build();
    }

    /**
     * Stop watch mode
     */
    async stopWatch() {
        if (this.watcher) {
            await this.watcher.close();
            this.watcher = null;
            this.log('info', 'Watch mode stopped');
        }
        if (this.rebuildTimer) {
            clearTimeout(this.rebuildTimer);
            this.rebuildTimer = null;
        }
        this.isWatchMode = false;
    }

    /**
     * Clean build artifacts
     */
    async clean() {
        try {
            this.log('info', 'Cleaning build artifacts...');

            const outputPath = path.join(this.config.outputDir, this.config.outputFile);

            try {
                await fs.access(outputPath);
                await fs.unlink(outputPath);
                this.log('info', `Removed: ${outputPath}`);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
                this.log('debug', `File not found (already clean): ${outputPath}`);
            }

            this.log('info', 'Clean completed');
            return true;

        } catch (error) {
            this.log('error', 'Clean failed:', error.message);
            throw error;
        }
    }

    /**
     * Run configured quality checks (linting, tests, etc.) before building
     * @param {Object} options
     * @param {boolean} options.isWatch - Whether build triggered from watch mode
     */
    async runQualityChecks({ isWatch = false } = {}) {
        const quality = this.config.quality;

        if (!quality) {
            this.log('debug', 'Quality checks not configured, skipping');
            return;
        }

        for (const [name, settings] of Object.entries(quality)) {
            if (!settings || settings.enabled === false) {
                this.log('debug', `Quality check "${name}" disabled; skipping`);
                continue;
            }

            if (isWatch && settings.skipOnWatch) {
                this.log('info', `Skipping ${name} check in watch mode`);
                continue;
            }

            if (!settings.command) {
                throw new BuildError(`Quality check "${name}" is enabled but has no command configured`, { stage: `quality:${name}` });
            }

            this.log('info', `Running ${name} check...`);
            try {
                await this.executeQualityCommand(settings.command, name, settings.cwd);
                this.log('info', `${name} check passed`);
            } catch (error) {
                throw toBuildError(error, error.message, { stage: `quality:${name}` });
            }
        }
    }

    /**
     * Execute a single quality check command
     * @param {string} command - Command to execute
     * @param {string} label - Friendly label for logging
     * @param {string} [cwd] - Optional working directory
     */
    executeQualityCommand(command, label, cwd = process.cwd()) {
        return new Promise((resolve, reject) => {
            const child = spawn(command, {
                cwd,
                shell: true,
                stdio: 'inherit'
            });

            child.on('exit', (code) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject(new BuildError(`Quality check "${label}" failed with exit code ${code}`,{ stage: `quality:${label}` }));
                }
            });

            child.on('error', (error) => {
                reject(new BuildError(`Failed to run quality check "${label}": ${error.message}`,{ stage: `quality:${label}`, cause: error }));
            });
        });
    }

    /**
     * Get build context including branch, version, and environment info
     */
    async getBuildContext() {
        const context = {
            timestamp: new Date(),
            sourceFiles: [],
            outputPath: path.join(this.config.outputDir, this.config.outputFile)
        };

        // Get Git branch if available
        try {
            if (this.config.branch.auto) {
                context.branch = execSync('git rev-parse --abbrev-ref HEAD', {
                    encoding: 'utf8'
                }).trim();
            } else {
                context.branch = 'main';
            }
        } catch (error) {
            this.log('warn', 'Could not determine Git branch, using "main"', error.message);
            context.branch = 'main';
        }

        // Determine if this is a development version
        context.isDev = context.branch !== 'main';

        // Set version based on package.json and branch
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
        context.version = context.isDev
            ? `${packageJson.version}-${context.branch}`
            : packageJson.version;

        if (process.env.USERSCRIPT_DEV_URL) {
            context.devUrl = process.env.USERSCRIPT_DEV_URL;
        }

        return context;
    }

    /**
     * Validate that source directory exists and contains expected files
     */
    async validateSourceDirectory() {
        try {
            const srcStats = await fs.stat(this.config.srcDir);
            if (!srcStats.isDirectory()) {
                throw new BuildError(`Source path is not a directory: ${this.config.srcDir}`, { stage: 'build', file: this.config.srcDir });
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new BuildError(`Source directory does not exist: ${this.config.srcDir}`, { stage: 'build', file: this.config.srcDir });
            }
            throw toBuildError(error, error.message, { stage: 'build', file: this.config.srcDir });
        }
    }

    /**
     * Ensure output directory exists
     */
    async ensureOutputDir() {
        try {
            await fs.mkdir(this.config.outputDir, { recursive: true });
        } catch (error) {
            // Ignore if directory already exists
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    /**
     * Logging utility with configurable levels and formatting
     */
    describeError(error) {
        if (!(error instanceof BuildError)) {
            return error.message;
        }
        const parts = [];
        if (error.stage) {
            parts.push(`[${error.stage}]`);
        }
        parts.push(error.message);
        if (error.file) {
            const location = error.line ? `${error.file}:${error.line}${error.column ? `:${error.column}` : ''}` : error.file;
            parts.push(`(@ ${location})`);
        }
        return parts.join(' ');
    }

    log(level, message, ...args) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        const configLevel = levels[this.config.logging.level] || 1;

        if (levels[level] < configLevel) {
            return;
        }

        const timestamp = this.config.logging.timestamps
            ? `[${new Date().toLocaleTimeString()}] `
            : '';

        const colors = {
            debug: '\x1b[36m',  // Cyan
            info: '\x1b[32m',   // Green
            warn: '\x1b[33m',   // Yellow
            error: '\x1b[31m',  // Red
            reset: '\x1b[0m'
        };

        const color = this.config.logging.colors ? colors[level] : '';
        const reset = this.config.logging.colors ? colors.reset : '';

        console[level === 'debug' ? 'log' : level](
            `${color}${timestamp}[${level.toUpperCase()}]${reset} ${message}`,
            ...args
        );
    }

    getWatchConfig() {
        const baseConfig = this.config.watch || {};
        if (baseConfig.enabled === false) {
            throw new BuildError('Watch mode is disabled in build.config.js (set watch.enabled = true to use "watch").', { stage: 'watch' });
        }
        return {
            debounce: baseConfig.debounce ?? 300,
            ignored: baseConfig.ignored ?? ['node_modules/**', 'dist/**', '.git/**'],
            paths: baseConfig.paths,
            createWatcher: baseConfig.createWatcher
        };
    }

    resolveWatchPaths(watchConfig) {
        const configuredPaths = Array.isArray(watchConfig.paths) && watchConfig.paths.length > 0
            ? watchConfig.paths
            : [this.config.srcDir];

        const resolved = configuredPaths
            .map((entry) => path.resolve(process.cwd(), entry))
            .filter((value, index, array) => array.indexOf(value) === index);

        if (resolved.length === 0) {
            throw new BuildError('No watch paths configured. Provide watch.paths or ensure srcDir is valid.', { stage: 'watch' });
        }

        return resolved;
    }

    async createWatcher(paths, watchConfig) {
        const factory = watchConfig.createWatcher ?? (async (targets, options) => {
            const { default: chokidar } = await import('chokidar');
            return chokidar.watch(targets, options);
        });

        const watcher = await factory(paths, {
            ignored: watchConfig.ignored,
            persistent: true,
            ignoreInitial: true
        });

        if (!watcher || typeof watcher.on !== 'function' || typeof watcher.close !== 'function') {
            throw new BuildError('Watch factory must return an object implementing on() and close().', { stage: 'watch' });
        }

        return watcher;
    }

    setupWatcherListeners(watcher, watchConfig) {
        const debouncedRebuild = () => {
            if (this.rebuildTimer) {
                clearTimeout(this.rebuildTimer);
            }
            this.rebuildTimer = setTimeout(async () => {
                try {
                    await this.build();
                } catch (error) {
                    this.log('error', `Watch rebuild failed: ${error.message}`);
                }
            }, watchConfig.debounce);
        };

        watcher
            .on('change', (filePath) => {
                this.log('info', `File changed: ${filePath}`);
                debouncedRebuild();
            })
            .on('add', (filePath) => {
                this.log('info', `File added: ${filePath}`);
                debouncedRebuild();
            })
            .on('unlink', (filePath) => {
                this.log('info', `File removed: ${filePath}`);
                debouncedRebuild();
            })
            .on('error', (error) => {
                this.log('error', `Watch error: ${error}`);
            });
    }

    describeQualityStatus(isWatch) {
        const quality = this.config.quality;
        if (!quality || Object.keys(quality).length === 0) {
            return 'none configured';
        }

        const statuses = Object.entries(quality).map(([name, settings]) => {
            if (!settings || settings.enabled === false) {
                return `${name}: disabled`;
            }
            if (isWatch && settings.skipOnWatch) {
                return `${name}: skip`;
            }
            return `${name}: run`;
        });

        return statuses.join(', ');
    }
}

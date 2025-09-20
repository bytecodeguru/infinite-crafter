import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { ModuleResolver } from './ModuleResolver.js';
import { FileConcatenator } from './FileConcatenator.js';

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
            this.log('error', `Build failed after ${buildTime}ms:`, error.message);
            throw error;
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
        
        this.log('info', 'Starting watch mode...');
        
        // Dynamic import chokidar for watch functionality
        const { default: chokidar } = await import('chokidar');
        
        this.watcher = chokidar.watch(this.config.srcDir, {
            ignored: this.config.watch.ignored,
            persistent: true,
            ignoreInitial: true
        });
        
        // Debounced rebuild function
        let rebuildTimeout;
        const debouncedRebuild = () => {
            clearTimeout(rebuildTimeout);
            rebuildTimeout = setTimeout(async () => {
                try {
                    await this.build();
                } catch (error) {
                    this.log('error', 'Watch rebuild failed:', error.message);
                }
            }, this.config.watch.debounce);
        };
        
        this.watcher
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
                this.log('error', 'Watch error:', error);
            });
        
        this.log('info', `Watching ${this.config.srcDir} for changes...`);
        
        // Initial build
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
            this.log('warn', 'Could not determine Git branch, using "main"');
            context.branch = 'main';
        }
        
        // Determine if this is a development version
        context.isDev = context.branch !== 'main';
        
        // Set version based on package.json and branch
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
        context.version = context.isDev 
            ? `${packageJson.version}-${context.branch}`
            : packageJson.version;
        
        return context;
    }
    
    /**
     * Validate that source directory exists and contains expected files
     */
    async validateSourceDirectory() {
        try {
            const srcStats = await fs.stat(this.config.srcDir);
            if (!srcStats.isDirectory()) {
                throw new Error(`Source path is not a directory: ${this.config.srcDir}`);
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Source directory does not exist: ${this.config.srcDir}`);
            }
            throw error;
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
}
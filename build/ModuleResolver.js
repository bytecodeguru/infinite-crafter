import fs from 'fs/promises';
import path from 'path';

/**
 * ModuleResolver handles ES6 import/export parsing and dependency resolution
 * Creates dependency graphs and determines execution order for module concatenation
 */
export class ModuleResolver {
    constructor(srcDir, config = {}) {
        this.srcDir = srcDir;
        this.config = config;
        this.dependencyGraph = new Map();
        this.modules = new Map();
        this.resolvedOrder = [];
    }

    /**
     * Main method to resolve all modules and their dependencies
     * Returns array of modules in execution order
     */
    async resolveModules() {
        this.log('debug', 'Starting module resolution...');

        // Clear previous resolution
        this.dependencyGraph.clear();
        this.modules.clear();
        this.resolvedOrder = [];

        // Find all JavaScript files in src directory
        const jsFiles = await this.findJavaScriptFiles(this.srcDir);
        this.log('debug', `Found ${jsFiles.length} JavaScript files`);

        // Parse each file for imports/exports
        for (const filePath of jsFiles) {
            await this.parseModule(filePath);
        }

        // Detect circular dependencies first
        this.detectCircularDependencies();

        // Validate all imports can be resolved
        await this.validateImports();

        // Calculate execution order
        this.resolvedOrder = this.calculateExecutionOrder();

        this.log('debug', `Modules in graph: ${Array.from(this.modules.keys()).map(p => path.relative(this.srcDir, p))}`);
        this.log('debug', `Resolved order: ${this.resolvedOrder.map(p => path.relative(this.srcDir, p))}`);

        this.log('info', `Resolved ${this.modules.size} modules in dependency order`);
        return this.getOrderedModules();
    }

    /**
     * Get modules in execution order with their content
     */
    getOrderedModules() {
        // Remove duplicates while preserving order
        const uniqueOrder = [];
        const seen = new Set();

        for (const modulePath of this.resolvedOrder) {
            if (!seen.has(modulePath)) {
                seen.add(modulePath);
                uniqueOrder.push(modulePath);
            }
        }

        return uniqueOrder.map(modulePath => {
            const module = this.modules.get(modulePath);
            if (!module) {
                throw new Error(`Module not found in resolution: ${modulePath}`);
            }
            return module;
        });
    }

    /**
     * Find all JavaScript files recursively in a directory
     */
    async findJavaScriptFiles(dir) {
        const files = [];

        async function scanDirectory(currentDir) {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.resolve(path.join(currentDir, entry.name));

                if (entry.isDirectory()) {
                    await scanDirectory(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.js')) {
                    files.push(fullPath);
                }
            }
        }

        await scanDirectory(path.resolve(dir));
        return files.sort(); // Consistent ordering
    }

    /**
     * Parse a single module file for imports and exports
     */
    async parseModule(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const relativePath = path.relative(this.srcDir, filePath);

            this.log('debug', `Parsing module: ${relativePath}`);

            const module = {
                path: filePath,
                relativePath: relativePath,
                content: content,
                imports: this.parseImports(content, filePath),
                exports: this.parseExports(content),
                dependencies: []
            };

            // Resolve import paths to actual file paths
            module.dependencies = await this.resolveImportPaths(module.imports, filePath);

            this.modules.set(filePath, module);
            // Ensure all modules are in dependency graph, even with empty dependencies
            this.dependencyGraph.set(filePath, module.dependencies);

            this.log('debug', `Module ${relativePath}: ${module.imports.length} imports, ${module.exports.length} exports`);

        } catch (error) {
            throw new Error(`Failed to parse module ${filePath}: ${error.message}`);
        }
    }

    /**
     * Parse import statements from module content
     */
    parseImports(content) {
        const imports = [];

        // Regular expressions for different import patterns
        const importPatterns = [
            // import { named } from 'module'
            /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"`]([^'"`]+)['"`]/g,
            // import defaultName from 'module'
            /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"`]([^'"`]+)['"`]/g,
            // import * as name from 'module'
            /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"`]([^'"`]+)['"`]/g,
            // import 'module' (side effects only)
            /import\s*['"`]([^'"`]+)['"`]/g
        ];

        for (const pattern of importPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const importDef = this.parseImportMatch(match, pattern);
                if (importDef) {
                    imports.push(importDef);
                }
            }
        }

        return imports;
    }

    /**
     * Parse a single import match based on the pattern used
     */
    parseImportMatch(match, pattern) {
        const patternStr = pattern.toString();

        if (patternStr.includes('\\{')) {
            // Named imports: import { a, b } from 'module'
            const specifiers = match[1].split(',').map(s => s.trim());
            return {
                type: 'named',
                specifiers: specifiers,
                source: match[2],
                isDefault: false
            };
        } else if (patternStr.includes('\\*')) {
            // Namespace import: import * as name from 'module'
            return {
                type: 'namespace',
                specifiers: [match[1]],
                source: match[2],
                isDefault: false
            };
        } else if (match.length === 3) {
            // Default import: import name from 'module'
            return {
                type: 'default',
                specifiers: [match[1]],
                source: match[2],
                isDefault: true
            };
        } else if (match.length === 2) {
            // Side effect import: import 'module'
            return {
                type: 'side-effect',
                specifiers: [],
                source: match[1],
                isDefault: false
            };
        }

        return null;
    }

    /**
     * Parse export statements from module content
     */
    parseExports(content) {
        const exports = [];

        // Regular expressions for different export patterns
        const exportPatterns = [
            // export function name() {}
            /export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            // export const/let/var name
            /export\s+(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            // export class Name
            /export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            // export { named }
            /export\s*\{\s*([^}]+)\s*\}/g,
            // export default
            /export\s+default\s+/g
        ];

        for (const pattern of exportPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                if (pattern.toString().includes('default')) {
                    exports.push({ name: 'default', isDefault: true });
                } else if (match[1]) {
                    if (pattern.toString().includes('\\{')) {
                        // Multiple named exports in braces
                        const names = match[1].split(',').map(s => s.trim());
                        names.forEach(name => {
                            exports.push({ name: name, isDefault: false });
                        });
                    } else {
                        // Single named export
                        exports.push({ name: match[1], isDefault: false });
                    }
                }
            }
        }

        return exports;
    }

    /**
     * Resolve import paths to actual file paths
     */
    async resolveImportPaths(imports, currentFilePath) {
        const dependencies = [];

        for (const importDef of imports) {
            const resolvedPath = await this.resolveImportPath(importDef.source, currentFilePath);
            if (resolvedPath) {
                dependencies.push(resolvedPath);
            }
        }

        return [...new Set(dependencies)]; // Remove duplicates
    }

    /**
     * Resolve a single import path to actual file path
     */
    async resolveImportPath(importPath, currentFilePath) {
        // Handle relative imports
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const currentDir = path.dirname(currentFilePath);
            let resolvedPath = path.resolve(currentDir, importPath);

            // Try with .js extension if not present
            if (!resolvedPath.endsWith('.js')) {
                resolvedPath += '.js';
            }

            try {
                await fs.access(resolvedPath);
                return resolvedPath;
            } catch {
                throw new Error(`Cannot resolve import "${importPath}" from ${currentFilePath}`);
            }
        }

        // Handle absolute imports from src root
        if (importPath.startsWith('/')) {
            let resolvedPath = path.join(this.srcDir, importPath.slice(1));

            if (!resolvedPath.endsWith('.js')) {
                resolvedPath += '.js';
            }

            try {
                await fs.access(resolvedPath);
                return resolvedPath;
            } catch {
                throw new Error(`Cannot resolve absolute import "${importPath}" from ${currentFilePath}`);
            }
        }

        // Skip external modules (node_modules, etc.)
        this.log('debug', `Skipping external import: ${importPath}`);
        return null;
    }

    /**
     * Validate that all imports can be resolved to existing exports
     */
    async validateImports() {
        for (const module of this.modules.values()) {
            for (const importDef of module.imports) {
                // Skip external imports
                if (!importDef.source.startsWith('./') && !importDef.source.startsWith('../') && !importDef.source.startsWith('/')) {
                    continue;
                }

                // Find the target module in dependencies
                const targetPath = module.dependencies.find(depPath => {
                    const targetModule = this.modules.get(depPath);
                    if (!targetModule) return false;

                    // Check if this dependency matches the import source
                    const currentDir = path.dirname(module.path);
                    let expectedPath = path.resolve(currentDir, importDef.source);
                    if (!expectedPath.endsWith('.js')) {
                        expectedPath += '.js';
                    }

                    return expectedPath === depPath;
                });

                if (!targetPath) {
                    throw new Error(`Import "${importDef.source}" in ${module.relativePath} cannot be resolved`);
                }

                const targetModule = this.modules.get(targetPath);

                // Validate that imported names exist in target module
                if (importDef.type === 'named') {
                    for (const specifier of importDef.specifiers) {
                        const exportExists = targetModule.exports.some(exp => exp.name === specifier);
                        if (!exportExists) {
                            throw new Error(`Import "${specifier}" from "${importDef.source}" in ${module.relativePath} does not exist in target module`);
                        }
                    }
                } else if (importDef.type === 'default') {
                    const hasDefault = targetModule.exports.some(exp => exp.isDefault);
                    if (!hasDefault) {
                        throw new Error(`Default import from "${importDef.source}" in ${module.relativePath} but target module has no default export`);
                    }
                }
            }
        }
    }

    /**
     * Helper to match import source with module path
     */
    matchesImportSource(importSource, targetRelativePath, currentModulePath) {
        const currentDir = path.dirname(currentModulePath);
        let expectedPath = path.resolve(currentDir, importSource);

        // Add .js extension if not present
        if (!expectedPath.endsWith('.js')) {
            expectedPath += '.js';
        }

        const targetPath = path.resolve(this.srcDir, targetRelativePath);

        return expectedPath === targetPath;
    }

    /**
     * Detect circular dependencies in the module graph
     */
    detectCircularDependencies() {
        const visited = new Set();
        const recursionStack = new Set();

        for (const modulePath of this.dependencyGraph.keys()) {
            if (!visited.has(modulePath)) {
                const cycle = this.detectCycleFromNode(modulePath, visited, recursionStack, []);
                if (cycle.length > 0) {
                    throw new Error(`Circular dependency detected: ${cycle.join(' -> ')}`);
                }
            }
        }
    }

    /**
     * DFS helper for circular dependency detection
     */
    detectCycleFromNode(node, visited, recursionStack, pathArray) {
        visited.add(node);
        recursionStack.add(node);
        pathArray.push(path.relative(this.srcDir, node));

        const dependencies = this.dependencyGraph.get(node) || [];

        for (const dependency of dependencies) {
            if (!visited.has(dependency)) {
                const cycle = this.detectCycleFromNode(dependency, visited, recursionStack, [...pathArray]);
                if (cycle.length > 0) {
                    return cycle;
                }
            } else if (recursionStack.has(dependency)) {
                // Found cycle
                const dependencyRelative = path.relative(this.srcDir, dependency);
                const cycleStart = pathArray.indexOf(dependencyRelative);
                return pathArray.slice(cycleStart).concat([dependencyRelative]);
            }
        }

        recursionStack.delete(node);
        return [];
    }

    /**
     * Calculate execution order using topological sort
     */
    calculateExecutionOrder() {
        const visited = new Set();
        const order = [];

        // DFS-based topological sort
        const visit = (node) => {
            if (visited.has(node)) {
                return;
            }

            visited.add(node);

            const dependencies = this.dependencyGraph.get(node) || [];
            for (const dependency of dependencies) {
                visit(dependency);
            }

            order.push(node);
        };

        // Visit all nodes - use modules.keys() to ensure all modules are included
        for (const modulePath of this.modules.keys()) {
            visit(modulePath);
        }

        return order;
    }

    /**
     * Logging utility
     */
    log(level, message, ...args) {
        if (this.config.log) {
            this.config.log(level, `[ModuleResolver] ${message}`, ...args);
        }
    }
}
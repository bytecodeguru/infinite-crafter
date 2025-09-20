import fs from 'fs/promises';
import path from 'path';

/**
 * FileConcatenator handles the concatenation of ES6 modules into a single userscript
 * Removes import/export statements and combines code while preserving functionality
 */
export class FileConcatenator {
    constructor(config) {
        this.config = config;
    }

    /**
     * Concatenate modules into a single userscript
     * @param {Array} modules - Array of resolved modules in dependency order
     * @param {Object} buildContext - Build context with version, branch, etc.
     * @returns {string} Complete userscript content
     */
    async concatenateModules(modules, buildContext) {
        const parts = [];

        // 1. Generate userscript header
        const header = await this.generateUserscriptHeader(buildContext);
        parts.push(header);

        // 2. Start IIFE wrapper
        parts.push('(function () {');
        parts.push("    'use strict';");
        parts.push('');

        // 3. Process and concatenate module contents
        for (const module of modules) {
            // Skip header.js as it's used for metadata generation
            if (module.relativePath === 'header.js') {
                continue;
            }

            const processedContent = await this.processModuleContent(module);
            if (processedContent.trim()) {
                parts.push(`    // === ${module.relativePath} ===`);
                parts.push(this.indentCode(processedContent, 1));
                parts.push('');
            }
        }

        // 4. Close IIFE wrapper
        parts.push('})();');

        return parts.join('\n');
    }

    /**
     * Generate userscript header with template variable replacement
     * @param {Object} buildContext - Build context
     * @returns {string} Userscript header
     */
    async generateUserscriptHeader(buildContext) {
        // Find and read header.js
        const headerPath = path.join(this.config.srcDir, 'header.js');

        try {
            const headerContent = await fs.readFile(headerPath, 'utf8');

            // Extract metadata object from header.js
            const metadataMatch = headerContent.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});/);
            if (!metadataMatch) {
                throw new Error('Could not find metadata export in header.js');
            }

            // Parse metadata (simple eval for now - could be improved with proper parsing)
            const metadataCode = metadataMatch[1];
            const metadata = eval(`(${metadataCode})`);

            // Replace template variables
            const processedMetadata = this.replaceTemplateVariables(metadata, buildContext);

            // Generate userscript header format
            const headerLines = ['// ==UserScript=='];

            // Add metadata fields
            for (const [key, value] of Object.entries(processedMetadata)) {
                if (Array.isArray(value)) {
                    // Handle arrays (like match URLs)
                    value.forEach(item => {
                        headerLines.push(`// @${key.padEnd(12)} ${item}`);
                    });
                } else {
                    headerLines.push(`// @${key.padEnd(12)} ${value}`);
                }
            }

            headerLines.push('// ==/UserScript==');
            headerLines.push('');

            return headerLines.join('\n');

        } catch (error) {
            throw new Error(`Failed to generate userscript header: ${error.message}`);
        }
    }

    /**
     * Replace template variables in metadata
     * @param {Object} metadata - Metadata object
     * @param {Object} buildContext - Build context
     * @returns {Object} Processed metadata
     */
    replaceTemplateVariables(metadata, buildContext) {
        const processed = { ...metadata };

        // Replace {{VERSION}}
        if (processed.version && processed.version.includes('{{VERSION}}')) {
            processed.version = processed.version.replace('{{VERSION}}', buildContext.version);
        }

        // Replace {{UPDATE_URL}} and {{DOWNLOAD_URL}}
        const baseUrl = this.config.branch.urlTemplate.replace('{{BRANCH}}', buildContext.branch);

        if (processed.updateURL && processed.updateURL.includes('{{UPDATE_URL}}')) {
            processed.updateURL = processed.updateURL.replace('{{UPDATE_URL}}', baseUrl);
        } else if (processed.updateURL === '{{UPDATE_URL}}') {
            processed.updateURL = baseUrl;
        }

        if (processed.downloadURL && processed.downloadURL.includes('{{DOWNLOAD_URL}}')) {
            processed.downloadURL = processed.downloadURL.replace('{{DOWNLOAD_URL}}', baseUrl);
        } else if (processed.downloadURL === '{{DOWNLOAD_URL}}') {
            processed.downloadURL = baseUrl;
        }

        return processed;
    }

    /**
     * Process individual module content by removing imports/exports
     * @param {Object} module - Module object with content and metadata
     * @returns {string} Processed module content
     */
    async processModuleContent(module) {
        let content = module.content;

        // Remove import statements
        content = content.replace(/^import\s+.*?from\s+['"`].*?['"`]\s*;?\s*$/gm, '');
        content = content.replace(/^import\s+['"`].*?['"`]\s*;?\s*$/gm, '');

        // Remove export statements but keep the declarations
        content = content.replace(/^export\s+default\s+/gm, '');
        content = content.replace(/^export\s+/gm, '');

        // Remove export from function/class/const declarations
        content = content.replace(/^export\s+(function|class|const|let|var)\s+/gm, '$1 ');

        // Remove standalone export blocks like "export { name1, name2 }"
        content = content.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '');

        // Clean up multiple empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        // Remove leading/trailing whitespace
        content = content.trim();

        return content;
    }

    /**
     * Indent code by specified number of levels (4 spaces per level)
     * @param {string} code - Code to indent
     * @param {number} levels - Number of indentation levels
     * @returns {string} Indented code
     */
    indentCode(code, levels) {
        const indent = '    '.repeat(levels);
        return code
            .split('\n')
            .map(line => line.trim() ? indent + line : line)
            .join('\n');
    }

    /**
     * Write concatenated content to output file
     * @param {string} content - Complete userscript content
     * @param {string} outputPath - Output file path
     */
    async writeOutput(content, outputPath) {
        try {
            await fs.writeFile(outputPath, content, 'utf8');
            return true;
        } catch (error) {
            throw new Error(`Failed to write output file: ${error.message}`);
        }
    }

    /**
     * Validate generated userscript syntax
     * @param {string} content - Userscript content
     * @returns {boolean} True if valid
     */
    validateSyntax(content) {
        try {
            // Basic syntax check - try to parse as JavaScript
            new Function(content);
            return true;
        } catch (error) {
            throw new Error(`Generated userscript has syntax errors: ${error.message}`);
        }
    }
}
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import path from 'path';
import { ModuleResolver } from '../../build/ModuleResolver.js';
import { BuildError } from '../../build/errors.js';

describe('ModuleResolver', () => {
    const testDir = path.resolve('test/fixtures/modules');

    // Setup test fixtures
    async function setupTestFixtures() {
        await fs.mkdir(testDir, { recursive: true });

        // Create test modules
        await fs.writeFile(path.join(testDir, 'main.js'), `
import { helper } from './utils/helper.js';
import { Component } from './ui/component.js';

export function init() {
    return helper() + Component();
}
        `);

        await fs.mkdir(path.join(testDir, 'utils'), { recursive: true });
        await fs.writeFile(path.join(testDir, 'utils', 'helper.js'), `
export function helper() {
    return 'helper';
}

export const CONSTANT = 42;
        `);

        await fs.mkdir(path.join(testDir, 'ui'), { recursive: true });
        await fs.writeFile(path.join(testDir, 'ui', 'component.js'), `
import { helper } from '../utils/helper.js';

export class Component {
    render() {
        return helper();
    }
}

export default Component;
        `);
    }

    // Cleanup test fixtures
    async function cleanupTestFixtures() {
        try {
            await fs.rm(testDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
    }

    test('should find all JavaScript files in directory', async () => {
        await setupTestFixtures();

        try {
            const resolver = new ModuleResolver(testDir);
            const files = await resolver.findJavaScriptFiles(testDir);

            assert.strictEqual(files.length, 3);
            assert(files.some(f => f.endsWith('main.js')));
            assert(files.some(f => f.endsWith('helper.js')));
            assert(files.some(f => f.endsWith('component.js')));
        } finally {
            await cleanupTestFixtures();
        }
    });

    test('should parse imports correctly', async () => {
        const resolver = new ModuleResolver('test/fixtures/modules');

        const content = `
import { named1, named2 } from './module1.js';
import defaultImport from './module2.js';
import * as namespace from './module3.js';
import './side-effect.js';
        `;

        const imports = resolver.parseImports(content);

        assert.strictEqual(imports.length, 4);

        // Named import
        assert.strictEqual(imports[0].type, 'named');
        assert.deepStrictEqual(imports[0].specifiers, ['named1', 'named2']);
        assert.strictEqual(imports[0].source, './module1.js');

        // Default import
        assert.strictEqual(imports[1].type, 'default');
        assert.deepStrictEqual(imports[1].specifiers, ['defaultImport']);
        assert.strictEqual(imports[1].source, './module2.js');

        // Namespace import
        assert.strictEqual(imports[2].type, 'namespace');
        assert.deepStrictEqual(imports[2].specifiers, ['namespace']);
        assert.strictEqual(imports[2].source, './module3.js');

        // Side effect import
        assert.strictEqual(imports[3].type, 'side-effect');
        assert.deepStrictEqual(imports[3].specifiers, []);
        assert.strictEqual(imports[3].source, './side-effect.js');
    });

    test('should parse exports correctly', async () => {
        const resolver = new ModuleResolver('test/fixtures/modules');

        const content = `
export function namedFunction() {}
export const namedConstant = 42;
export class NamedClass {}
export { renamedExport };
export default DefaultExport;
        `;

        const exports = resolver.parseExports(content);

        assert(exports.some(exp => exp.name === 'namedFunction' && !exp.isDefault));
        assert(exports.some(exp => exp.name === 'namedConstant' && !exp.isDefault));
        assert(exports.some(exp => exp.name === 'NamedClass' && !exp.isDefault));
        assert(exports.some(exp => exp.name === 'renamedExport' && !exp.isDefault));
        assert(exports.some(exp => exp.name === 'default' && exp.isDefault));
    });

    test('should resolve modules and dependencies', async () => {
        await setupTestFixtures();

        try {
            const resolver = new ModuleResolver(testDir);
            const modules = await resolver.resolveModules();

            assert.strictEqual(modules.length, 3);

            // Check that dependencies are resolved correctly
            const mainModule = modules.find(m => m.relativePath === 'main.js');
            assert(mainModule);
            assert.strictEqual(mainModule.dependencies.length, 2);

            // Check execution order - dependencies should come before dependents
            const moduleOrder = modules.map(m => m.relativePath);
            const helperIndex = moduleOrder.indexOf('utils/helper.js');
            const componentIndex = moduleOrder.indexOf('ui/component.js');
            const mainIndex = moduleOrder.indexOf('main.js');

            assert(helperIndex < componentIndex, 'helper.js should come before component.js');
            assert(componentIndex < mainIndex, 'component.js should come before main.js');

        } finally {
            await cleanupTestFixtures();
        }
    });

    test('should detect circular dependencies', async () => {
        const circularTestDir = './test/fixtures/circular';

        try {
            await fs.mkdir(circularTestDir, { recursive: true });

            // Create circular dependency: a.js -> b.js -> a.js
            await fs.writeFile(path.join(circularTestDir, 'a.js'), `
import { b } from './b.js';
export function a() { return b(); }
            `);

            await fs.writeFile(path.join(circularTestDir, 'b.js'), `
import { a } from './a.js';
export function b() { return a(); }
            `);

            const resolver = new ModuleResolver(circularTestDir);

            await assert.rejects(
                async () => await resolver.resolveModules(),
                (error) => {
                    assert(error instanceof BuildError);
                    assert.strictEqual(error.stage, 'module-resolution');
                    return /Circular dependency detected/.test(error.message);
                }
            );

        } finally {
            await fs.rm(circularTestDir, { recursive: true, force: true });
        }
    });

    test('should validate imports against exports', async () => {
        const invalidTestDir = './test/fixtures/invalid';

        try {
            await fs.mkdir(invalidTestDir, { recursive: true });

            // Create module with invalid import
            await fs.writeFile(path.join(invalidTestDir, 'main.js'), `
import { nonExistent } from './helper.js';
            `);

            await fs.writeFile(path.join(invalidTestDir, 'helper.js'), `
export function existingFunction() {}
            `);

            const resolver = new ModuleResolver(invalidTestDir);

            await assert.rejects(
                async () => await resolver.resolveModules(),
                (error) => {
                    assert(error instanceof BuildError);
                    assert.strictEqual(error.stage, 'module-resolution');
                    return /does not exist in target module/.test(error.message);
                }
            );

        } finally {
            await fs.rm(invalidTestDir, { recursive: true, force: true });
        }
    });
});
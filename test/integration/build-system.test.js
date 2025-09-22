import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { BuildManager } from '../../build/BuildManager.js';
import { BuildError } from '../../build/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureRoot = path.resolve(__dirname, '../fixtures/build/basic');

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else if (entry.isFile()) {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function createBuildEnvironment() {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'build-system-fixture-'));
    const srcDir = path.join(root, 'src');
    await copyDirectory(fixtureRoot, root);

    const outputDir = path.join(root, 'dist');
    await fs.mkdir(outputDir, { recursive: true });

    const successScript = path.join(root, 'quality-success.js');
    await fs.writeFile(successScript, 'process.exit(0);\n');

    const failScript = path.join(root, 'quality-fail.js');
    await fs.writeFile(failScript, 'process.exit(1);\n');

    const baseConfig = {
        srcDir,
        outputDir,
        outputFile: 'fixture.user.js',
        watch: {
            debounce: 100,
            ignored: []
        },
        quality: {},
        branch: {
            auto: false,
            urlTemplate: 'https://example.com/{{BRANCH}}/fixture.user.js'
        },
        build: {
            minify: false,
            sourceMaps: false,
            validateSyntax: true,
            enforcePolicy: true
        },
        logging: {
            level: 'error',
            timestamps: false,
            colors: false
        }
    };

    return {
        root,
        srcDir,
        outputDir,
        successScript,
        failScript,
        baseConfig,
        cleanup: async () => {
            await fs.rm(root, { recursive: true, force: true });
        }
    };
}

test('BuildManager.build produces bundled userscript from fixture', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);

    const config = {
        ...env.baseConfig,
        quality: {
            lint: {
                enabled: true,
                command: `node "${env.successScript}"`,
                skipOnWatch: false
            }
        }
    };

    const manager = new BuildManager(config);
    await manager.build();

    const outputPath = path.join(config.outputDir, config.outputFile);
    const output = await fs.readFile(outputPath, 'utf8');

    assert.match(output, /==UserScript==/, 'userscript header should exist');
    assert.match(output, /Fixture Craft Helper/, 'metadata should be embedded');
    assert.match(output, /formatMessage\('panel ready'\)/, 'fixture code should be concatenated');
});

test('BuildManager.build honours USERSCRIPT_DEV_URL overrides', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);
    t.after(() => {
        delete process.env.USERSCRIPT_DEV_URL;
    });

    process.env.USERSCRIPT_DEV_URL = 'http://localhost:4242/dev.user.js';

    const config = {
        ...env.baseConfig,
        quality: null
    };

    const manager = new BuildManager(config);
    await manager.build();

    const outputPath = path.join(config.outputDir, config.outputFile);
    const output = await fs.readFile(outputPath, 'utf8');

    assert.match(output, /@updateURL\s+http:\/\/localhost:4242\/dev\.user\.js/);
    assert.match(output, /@downloadURL\s+http:\/\/localhost:4242\/dev\.user\.js/);
});



test('BuildManager.build surfaces syntax errors with context', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);

    const brokenMain = path.join(env.srcDir, 'main.js');
    await fs.appendFile(brokenMain, '\nfunction broken(');

    const config = {
        ...env.baseConfig,
        quality: {
            lint: {
                enabled: true,
                command: `node "${env.successScript}"`,
                skipOnWatch: false
            }
        }
    };

    const manager = new BuildManager(config);

    await assert.rejects(() => manager.build(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'syntax-validation');
        return /syntax errors/.test(error.message);
    });
});



test('Size policy rejects oversized modules', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);

    const config = {
        srcDir: 'test/fixtures/size-check/src',
        outputDir: 'test/fixtures/size-check/dist',
        outputFile: 'fixture.user.js',
        quality: null,
        branch: {
            auto: false,
            urlTemplate: 'https://example.com/{{BRANCH}}/fixture.user.js'
        },
        build: {
            minify: false,
            sourceMaps: false,
            validateSyntax: true,
            enforcePolicy: true
        },
        logging: {
            level: 'error',
            timestamps: false,
            colors: false
        },
        maxFileLines: 300,
        maxFunctionLines: 50,
        recommendedFileLines: 200,
        recommendedFunctionLines: 30
    };

    const manager = new BuildManager(config);

    await assert.rejects(() => manager.build(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'size-policy');
        return /exceeds/.test(error.message);
    });
});
test('BuildManager.build fails when quality gate command fails', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);

    const config = {
        ...env.baseConfig,
        quality: {
            lint: {
                enabled: true,
                command: `node "${env.failScript}"`,
                skipOnWatch: false
            }
        }
    };

    const manager = new BuildManager(config);

    await assert.rejects(() => manager.build(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'quality:lint');
        return /failed with exit code/.test(error.message);
    });

    const outputPath = path.join(config.outputDir, config.outputFile);
    const exists = await fs.access(outputPath).then(() => true).catch(() => false);
    assert.strictEqual(exists, false, 'output file should not be produced');
});

test('BuildManager.build throws when source directory is missing', async (t) => {
    const env = await createBuildEnvironment();
    t.after(env.cleanup);

    const config = {
        ...env.baseConfig,
        srcDir: path.join(env.root, 'missing-src')
    };

    const manager = new BuildManager(config);

    await assert.rejects(() => manager.build(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'build');
        return /Source directory does not exist/.test(error.message);
    });
});

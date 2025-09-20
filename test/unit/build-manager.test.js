import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { BuildManager } from '../../build/BuildManager.js';

class TestBuildManager extends BuildManager {
    constructor(config) {
        super(config);
        this.executedCommands = [];
    }

    async executeQualityCommand(command, label) {
        this.executedCommands.push({ command, label });
        if (command === 'fail') {
            throw new Error('Simulated failure');
        }
        if (typeof command === 'function') {
            return command();
        }
        return true;
    }
}

async function createConfig() {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'build-manager-unit-'));
    const srcDir = path.join(tempDir, 'src');
    const outputDir = path.join(tempDir, 'dist');
    await fs.mkdir(srcDir, { recursive: true });
    const config = {
        srcDir,
        outputDir,
        outputFile: 'out.js',
        watch: {
            debounce: 50,
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

    return { config, tempDir };
}

test('runQualityChecks skips disabled checks', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    config.quality = {
        lint: {
            enabled: false,
            command: 'should-not-run',
            skipOnWatch: false
        }
    };

    const manager = new TestBuildManager(config);
    await manager.runQualityChecks();
    assert.strictEqual(manager.executedCommands.length, 0);
});

test('runQualityChecks skips commands in watch mode when configured', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    config.quality = {
        lint: {
            enabled: true,
            command: 'should-not-run',
            skipOnWatch: true
        }
    };

    const manager = new TestBuildManager(config);
    await manager.runQualityChecks({ isWatch: true });
    assert.strictEqual(manager.executedCommands.length, 0);
});

test('runQualityChecks surfaces command failures', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    config.quality = {
        lint: {
            enabled: true,
            command: 'fail',
            skipOnWatch: false
        }
    };

    const manager = new TestBuildManager(config);
    await assert.rejects(() => manager.runQualityChecks(), /Simulated failure/);
    assert.strictEqual(manager.executedCommands.length, 1);
});

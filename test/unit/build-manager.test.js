import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { BuildManager } from '../../build/BuildManager.js';
import { BuildError } from '../../build/errors.js';

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

class StubWatchBuildManager extends BuildManager {
    constructor(config) {
        super(config);
        this.buildCount = 0;
    }

    async build() {
        if (this.isBuilding) {
            this.log('warn', 'Build already in progress, skipping...');
            return false;
        }

        this.isBuilding = true;
        this.buildCount += 1;
        try {
            return true;
        } finally {
            this.isBuilding = false;
        }
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
    await assert.rejects(() => manager.runQualityChecks(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'quality:lint');
        return /Simulated failure/.test(error.message);
    });
    assert.strictEqual(manager.executedCommands.length, 1);
});

test('watch() respects configuration toggle', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    config.watch.enabled = false;

    const manager = new BuildManager(config);

    await assert.rejects(() => manager.watch(), (error) => {
        assert(error instanceof BuildError);
        assert.strictEqual(error.stage, 'watch');
        return /disabled/.test(error.message);
    });
});

test('watch() triggers rebuilds through configured watcher factory', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    await fs.writeFile(path.join(config.srcDir, 'placeholder.js'), 'export const noop = () => {};\n');

    config.watch.enabled = true;
    config.watch.debounce = 10;
    config.watch.paths = [config.srcDir];

    let fakeWatcher;

    class FakeWatcher {
        constructor() {
            this.handlers = new Map();
            this.closed = false;
        }

        on(event, handler) {
            this.handlers.set(event, handler);
            return this;
        }

        async close() {
            this.closed = true;
        }

        emit(event, payload) {
            const handler = this.handlers.get(event);
            if (handler) {
                handler(payload);
            }
        }
    }

    config.watch.createWatcher = async () => {
        fakeWatcher = new FakeWatcher();
        return fakeWatcher;
    };

    const manager = new StubWatchBuildManager(config);

    await manager.watch();
    assert.strictEqual(manager.buildCount, 1, 'initial build should run once');

    fakeWatcher.emit('change', path.join(config.srcDir, 'placeholder.js'));
    await new Promise((resolve) => setTimeout(resolve, config.watch.debounce + 10));

    assert.strictEqual(manager.buildCount, 2, 'change event should trigger rebuild');

    await manager.stopWatch();
    assert(fakeWatcher.closed, 'watcher should be closed when stopping watch mode');
});

test('describeQualityStatus outlines skip behaviour in watch mode', async (t) => {
    const { config, tempDir } = await createConfig();
    t.after(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    config.quality = {
        lint: {
            enabled: true,
            skipOnWatch: true,
            command: 'noop'
        },
        test: {
            enabled: false,
            command: 'noop'
        }
    };

    const manager = new BuildManager(config);

    const status = manager.describeQualityStatus(true);
    assert.match(status, /lint: skip/);
    assert.match(status, /test: disabled/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommandLine, applyCliOverrides } from '../../build/cli-options.js';

const sampleConfig = {
    logging: { level: 'info', timestamps: true, colors: true },
    quality: { lint: { enabled: true, command: 'lint' } }
};

test('parseCommandLine infers default build command', () => {
    const parsed = parseCommandLine([]);
    assert.strictEqual(parsed.command, 'build');
    assert.deepStrictEqual(parsed.flags.watch, false);
    assert.deepStrictEqual(parsed.errors.length, 0);
});


test('parseCommandLine handles explicit watch command and options', () => {
    const parsed = parseCommandLine(['watch', '--skip-quality', '--verbose']);
    assert.strictEqual(parsed.command, 'watch');
    assert(parsed.flags.skipQuality);
    assert(parsed.flags.verbose);
    assert.strictEqual(parsed.errors.length, 0);
});

test('parseCommandLine reports unknown options', () => {
    const parsed = parseCommandLine(['--unknown']);
    assert(parsed.errors.length > 0);
});

test('applyCliOverrides adjusts logging and quality', () => {
    const cli = {
        flags: { verbose: true, quiet: false, skipQuality: true },
        options: {},
        errors: []
    };
    const updated = applyCliOverrides(sampleConfig, cli);
    assert.strictEqual(updated.logging.level, 'debug');
    assert.strictEqual(updated.quality, null);
});

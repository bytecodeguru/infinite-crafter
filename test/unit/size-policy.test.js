import test from 'node:test';
import assert from 'node:assert/strict';
import { SizePolicy } from '../../build/size-policy.js';
import { BuildError } from '../../build/errors.js';

test('SizePolicy throws when file exceeds max lines', () => {
    const policy = new SizePolicy({ maxFileLines: 10, maxFunctionLines: 5, build: { enforcePolicy: true } });
    assert.throws(() => {
        policy.validateModule({ path: 'test.js', content: 'line\n'.repeat(20) });
    }, (error) => error instanceof BuildError && error.stage === 'size-policy');
});

test('SizePolicy throws when function exceeds max lines', () => {
    const policy = new SizePolicy({ maxFileLines: 100, maxFunctionLines: 3, build: { enforcePolicy: true } });
    const content = [
        'function demo() {',
        '    console.log(\'1\');',
        '    console.log(\'2\');',
        '    console.log(\'3\');',
        '    console.log(\'4\');',
        '}'
    ].join('\n');
    assert.throws(() => {
        policy.validateModule({ path: 'test.js', content });
    }, (error) => error instanceof BuildError && /Function demo/.test(error.message));
});


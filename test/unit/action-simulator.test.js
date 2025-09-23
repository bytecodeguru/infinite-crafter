import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createActionSimulator, ActionSimulator } from '../../src/auto-play/action-simulator.js';

function createFakeElement(events = []) {
    return {
        events,
        dispatchEvent(event) {
            this.events.push(event.type);
            return true;
        },
        getBoundingClientRect() {
            return { left: 10, top: 20, width: 100, height: 50 };
        }
    };
}

test('createActionSimulator returns ActionSimulator instance', () => {
    const simulator = createActionSimulator({ delayProvider: () => 0 });
    assert.ok(simulator instanceof ActionSimulator);
});

test('clickElement dispatches events in order', async () => {
    const events = [];
    const element = createFakeElement(events);
    const simulator = createActionSimulator({ delayProvider: () => 0 });

    await simulator.clickElement(element);

    assert.deepStrictEqual(events, ['mousemove', 'mousedown', 'mouseup', 'click']);
});

test('performSequence respects manual actions', async () => {
    const events = [];
    const element = createFakeElement(events);
    const simulator = createActionSimulator({ delayProvider: () => 0 });

    await simulator.performSequence([
        { type: 'move', target: element, immediate: true },
        { type: 'down', target: element },
        { type: 'wait', duration: 0 },
        { type: 'up', target: element }
    ]);

    assert.deepStrictEqual(events, ['mousemove', 'mousedown', 'mouseup']);
});

test('setDelayRange updates default delays', async () => {
    const recordedDelays = [];
    const simulator = createActionSimulator({
        delayProvider: (min, max) => {
            recordedDelays.push({ min, max });
            return 0;
        }
    });

    simulator.setDelayRange({ min: 5, max: 10 });
    await simulator.waitForDelay();

    assert.equal(recordedDelays.length, 1);
    assert.strictEqual(recordedDelays[0].min, 5);
    assert.strictEqual(recordedDelays[0].max, 10);
});

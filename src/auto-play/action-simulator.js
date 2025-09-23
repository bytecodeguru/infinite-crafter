/**
 * ActionSimulator module
 * Provides utilities for simulating mouse interactions with human-like timing.
 */

const DEFAULT_DELAY_RANGE = { min: 35, max: 85 };

const ACTION_SIM_DEFAULT_LOGGER = {
    log: (...args) => console.log('[ActionSimulator]', ...args),
    warn: (...args) => console.warn('[ActionSimulator]', ...args),
    error: (...args) => console.error('[ActionSimulator]', ...args)
};

function defaultDocument() {
    if (typeof window !== 'undefined' && window.document) {
        return window.document;
    }
    return null;
}

function defaultDelayProvider(min, max) {
    if (typeof min !== 'number') {
        min = DEFAULT_DELAY_RANGE.min;
    }
    if (typeof max !== 'number') {
        max = DEFAULT_DELAY_RANGE.max;
    }
    if (max < min) {
        max = min;
    }
    const range = max - min;
    if (range <= 0) {
        return min;
    }
    return min + Math.random() * range;
}

class ActionSimulator {
    constructor({ logger = ACTION_SIM_DEFAULT_LOGGER, document = defaultDocument(), delayProvider = defaultDelayProvider } = {}) {
        this.logger = logger;
        this.document = document;
        this.delayProvider = delayProvider;
        this.defaultDelayRange = { ...DEFAULT_DELAY_RANGE };
        this.pointerPosition = { x: 0, y: 0 };
    }

    setLogger(logger) {
        this.logger = logger;
    }

    setDelayRange(range = {}) {
        if (typeof range.min === 'number') {
            this.defaultDelayRange.min = Math.max(0, range.min);
        }
        if (typeof range.max === 'number') {
            this.defaultDelayRange.max = Math.max(this.defaultDelayRange.min, range.max);
        }
    }

    async clickElement(element, options = {}) {
        if (!element) {
            this.log('warn', 'clickElement called without a target element');
            return false;
        }

        const coords = this.resolveCoordinates({ target: element, options });

        if (!options.immediate) {
            await this.waitForDelay(options.beforeMove);
        }
        await this.movePointer({ target: element, coords, skipDelay: true });

        await this.waitForDelay(options.beforeMouseDown);
        await this.dispatchMouseEvent({ target: element, type: 'mousedown', coords, extra: { buttons: 1, button: 0 } });

        await this.waitForDelay(options.beforeMouseUp);
        await this.dispatchMouseEvent({ target: element, type: 'mouseup', coords, extra: { buttons: 0, button: 0 } });

        await this.waitForDelay(options.beforeClick);
        await this.dispatchMouseEvent({ target: element, type: 'click', coords, extra: { buttons: 0, button: 0, detail: 1 } });

        this.log('log', 'clickElement completed', { x: coords.x, y: coords.y, name: element?.dataset?.item || element?.textContent?.trim() });
        return true;
    }

    async moveMouseTo(x, y, options = {}) {
        const coords = { x, y };
        await this.movePointer({ coords, skipDelay: !!options.immediate, extra: options.extra, target: options.target });
        return coords;
    }

    async movePointer({ target, coords, skipDelay = false, extra = {} }) {
        const resolved = coords || this.resolveCoordinates({ target });

        if (!skipDelay) {
            await this.waitForDelay();
        }

        await this.dispatchMouseEvent({ target, type: 'mousemove', coords: resolved, extra: { movementX: resolved.x - this.pointerPosition.x, movementY: resolved.y - this.pointerPosition.y, ...extra } });
        this.pointerPosition = { x: resolved.x, y: resolved.y };
        return resolved;
    }

    async performSequence(actions = []) {
        for (const action of actions) {
            switch (action.type) {
                case 'move':
                    await this.movePointer({ target: action.target, coords: action.coords ? { x: action.coords.x, y: action.coords.y } : null, skipDelay: !!action.immediate, extra: action.extra });
                    break;
                case 'down':
                    await this.waitForDelay(action.before);
                    await this.dispatchMouseEvent({ target: action.target, type: 'mousedown', coords: this.resolveCoordinates({ target: action.target, options: action }), extra: { buttons: action.buttons ?? 1, button: action.button ?? 0 } });
                    break;
                case 'up':
                    await this.waitForDelay(action.before);
                    await this.dispatchMouseEvent({ target: action.target, type: 'mouseup', coords: this.resolveCoordinates({ target: action.target, options: action }), extra: { buttons: action.buttons ?? 0, button: action.button ?? 0 } });
                    break;
                case 'click':
                    await this.clickElement(action.target, action.options || {});
                    break;
                case 'wait':
                    await this.sleep(action.duration ?? 0);
                    break;
                default:
                    this.log('warn', 'Unknown action type', action);
                    break;
            }
        }
    }

    async waitForDelay(options = {}) {
        const { min, max } = this.getDelayRange(options);
        const ms = Math.max(0, Math.round(this.delayProvider(min, max)));
        if (ms > 0) {
            await this.sleep(ms);
        }
        return ms;
    }

    sleep(ms) {
        if (!ms) {
            return Promise.resolve();
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resolveCoordinates({ target, options = {} }) {
        if (options && typeof options.x === 'number' && typeof options.y === 'number') {
            return { x: options.x, y: options.y };
        }

        if (target && typeof target.getBoundingClientRect === 'function') {
            const rect = target.getBoundingClientRect();
            const x = rect.left + (rect.width / 2);
            const y = rect.top + (rect.height / 2);
            return { x, y, rect };
        }

        return { ...this.pointerPosition };
    }

    getDelayRange(options = {}) {
        const delay = options.delay || {};
        const min = Math.max(0, typeof delay.min === 'number' ? delay.min : (typeof options.minDelay === 'number' ? options.minDelay : this.defaultDelayRange.min));
        const max = Math.max(min, typeof delay.max === 'number' ? delay.max : (typeof options.maxDelay === 'number' ? options.maxDelay : this.defaultDelayRange.max));
        return { min, max };
    }

    dispatchTarget(target) {
        if (target && typeof target.dispatchEvent === 'function') {
            return target;
        }
        const doc = this.document || defaultDocument();
        if (!doc) {
            return null;
        }
        if (doc.body && typeof doc.body.dispatchEvent === 'function') {
            return doc.body;
        }
        return doc;
    }

    async dispatchMouseEvent({ target, type, coords, extra = {} }) {
        const eventTarget = this.dispatchTarget(target);
        if (!eventTarget) {
            this.log('warn', `dispatchMouseEvent skipped: no target available for ${type}`);
            return false;
        }

        const init = this.buildMouseEventInit(coords, extra);
        const event = this.createMouseEvent(type, init);

        this.log('log', `Dispatching ${type}`, init);
        return eventTarget.dispatchEvent(event);
    }

    buildMouseEventInit(coords = {}, extra = {}) {
        const x = Math.round(coords?.x ?? this.pointerPosition.x ?? 0);
        const y = Math.round(coords?.y ?? this.pointerPosition.y ?? 0);
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            screenX: x,
            screenY: y,
            ...extra
        };
    }

    createMouseEvent(type, init) {
        const doc = this.document || defaultDocument();
        if (typeof MouseEvent === 'function') {
            return new MouseEvent(type, init);
        }
        if (doc && typeof doc.createEvent === 'function') {
            const event = doc.createEvent('MouseEvents');
            event.initMouseEvent(
                type,
                init.bubbles,
                init.cancelable,
                init.view || doc.defaultView || doc.parentWindow,
                0,
                init.screenX || init.clientX,
                init.screenY || init.clientY,
                init.clientX,
                init.clientY,
                init.ctrlKey || false,
                init.altKey || false,
                init.shiftKey || false,
                init.metaKey || false,
                init.button || 0,
                init.relatedTarget || null
            );
            return event;
        }
        return { type, ...init };
    }

    log(level, message, details) {
        const logger = this.logger || ACTION_SIM_DEFAULT_LOGGER;
        const method = typeof logger[level] === 'function' ? logger[level] : logger.log;
        if (typeof method === 'function') {
            if (details !== undefined) {
                method.call(logger, message, details);
            } else {
                method.call(logger, message);
            }
        }
    }
}

export function createActionSimulator(options = {}) {
    return new ActionSimulator(options);
}

export { ActionSimulator };

/**
 * GameInterface module
 * Provides DOM access helpers for the Infinite Craft game UI.
 */

const SELECTORS = {
    sidebar: ['#sidebar', '.sidebar', '.sidebar-container', '.game-elements-sidebar', '[data-testid="sidebar"]'],
    sidebarItems: ['.item', '.element', '.sidebar-item', '.inventory-item', '[data-element]'],
    playArea: ['#board', '.board', '.play-area', '.game-board', '[data-testid="board"]'],
    nameNodes: ['.label', '.name', '.element-name', '.title', '[data-element-name]']
};

const DEFAULT_LOGGER = {
    log: (...args) => console.log('[GameInterface]', ...args),
    warn: (...args) => console.warn('[GameInterface]', ...args),
    error: (...args) => console.error('[GameInterface]', ...args)
};

function callLogger(logger, level, message, ...args) {
    if (!logger || typeof logger[level] !== 'function') {
        return;
    }
    logger[level](message, ...args);
}

function selectFirst(root, selectors) {
    if (!root) {
        return null;
    }
    for (const selector of selectors) {
        const element = root.querySelector(selector);
        if (element) {
            return element;
        }
    }
    return null;
}

function collectAll(root, selectors) {
    if (!root) {
        return [];
    }
    const elements = new Set();
    selectors.forEach(selector => {
        root.querySelectorAll(selector).forEach(element => elements.add(element));
    });
    return Array.from(elements);
}

function getElementName(element) {
    if (!element) {
        return '';
    }
    const datasetName = element.dataset?.element || element.dataset?.name;
    if (datasetName) {
        return datasetName.trim();
    }
    const attributeName = element.getAttribute?.('data-element-name');
    if (attributeName) {
        return attributeName.trim();
    }
    const nameNode = selectFirst(element, SELECTORS.nameNodes);
    if (nameNode && nameNode.textContent) {
        return nameNode.textContent.trim();
    }
    if (element.textContent) {
        return element.textContent.trim();
    }
    return '';
}

function isElementVisible(element) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
        return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

function getElementBounds(element) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
        return null;
    }
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };
}

function createElementInfo(element) {
    return {
        element,
        name: getElementName(element),
        bounds: getElementBounds(element)
    };
}

function makeTestResult(name, passed, successDetails, failureDetails) {
    return {
        name,
        passed,
        details: passed ? successDetails : failureDetails
    };
}

function defaultDocument() {
    if (typeof window !== 'undefined' && window.document) {
        return window.document;
    }
    return null;
}

class GameInterface {
    constructor({ logger = DEFAULT_LOGGER, doc = defaultDocument() } = {}) {
        this.logger = logger;
        this.document = doc;
    }
}

function getSidebarContainerMethod() {
    if (!this.document) {
        callLogger(this.logger, 'warn', 'Document not available, sidebar lookup skipped');
        return null;
    }
    const container = selectFirst(this.document, SELECTORS.sidebar);
    if (!container) {
        callLogger(this.logger, 'warn', 'Sidebar container not found', { selectorsTried: SELECTORS.sidebar });
    }
    return container;
}

function getSidebarElementsMethod() {
    const container = this.getSidebarContainer();
    if (!container) {
        return [];
    }
    const elements = collectAll(container, SELECTORS.sidebarItems).filter(isElementVisible);
    if (!elements.length) {
        callLogger(this.logger, 'warn', 'No sidebar elements detected', { selectorsTried: SELECTORS.sidebarItems });
    }
    return elements.map(createElementInfo);
}

function getPlayAreaContainerMethod() {
    if (!this.document) {
        callLogger(this.logger, 'warn', 'Document not available, play area lookup skipped');
        return null;
    }
    const container = selectFirst(this.document, SELECTORS.playArea);
    if (!container) {
        callLogger(this.logger, 'warn', 'Play area container not found', { selectorsTried: SELECTORS.playArea });
    }
    return container;
}

function getElementCountMethod() {
    return this.getSidebarElements().length;
}

function findElementByNameMethod(name) {
    if (!name) {
        return null;
    }
    const normalisedName = name.trim().toLowerCase();
    return this.getSidebarElements().find(({ name: elementName }) => elementName.toLowerCase() === normalisedName) || null;
}

function getAvailableElementNamesMethod() {
    return this.getSidebarElements().map(info => info.name).filter(Boolean);
}

function logGameStateMethod() {
    const count = this.getElementCount();
    const names = this.getAvailableElementNames();
    callLogger(this.logger, 'log', `Detected ${count} available elements`);
    if (names.length) {
        callLogger(this.logger, 'log', 'Sample elements:', names.slice(0, 10));
    }
}

function isGameReadyMethod() {
    return Boolean(this.getSidebarContainer() && this.getPlayAreaContainer());
}

function runBasicTestsMethod() {
    const sidebarContainer = this.getSidebarContainer();
    const sidebarElements = this.getSidebarElements();
    const playArea = this.getPlayAreaContainer();

    const results = [
        makeTestResult('sidebar-container', Boolean(sidebarContainer), 'Sidebar container detected', 'Sidebar container missing'),
        makeTestResult('sidebar-elements', sidebarElements.length > 0, `Found ${sidebarElements.length} sidebar elements`, 'No sidebar elements detected'),
        makeTestResult('play-area', Boolean(playArea), 'Play area container detected', 'Play area container missing')
    ];

    if (!results.every(result => result.passed)) {
        callLogger(this.logger, 'warn', 'GameInterface basic tests reported issues', results);
    } else {
        callLogger(this.logger, 'log', 'GameInterface basic tests passed');
    }

    return results;
}

GameInterface.prototype.getSidebarContainer = getSidebarContainerMethod;
GameInterface.prototype.getSidebarElements = getSidebarElementsMethod;
GameInterface.prototype.getPlayAreaContainer = getPlayAreaContainerMethod;
GameInterface.prototype.getElementCount = getElementCountMethod;
GameInterface.prototype.findElementByName = findElementByNameMethod;
GameInterface.prototype.getAvailableElementNames = getAvailableElementNamesMethod;
GameInterface.prototype.logGameState = logGameStateMethod;
GameInterface.prototype.isGameReady = isGameReadyMethod;
GameInterface.prototype.runBasicTests = runBasicTestsMethod;

export function createGameInterface(logger) {
    return new GameInterface({ logger });
}

export { GameInterface };

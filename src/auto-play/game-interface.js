/**
 * GameInterface module
 * Provides DOM access helpers for the Infinite Craft game UI.
 */

import { SELECTORS, collectAll, createElementInfo, findDuplicatesByName, normalizeName, selectFirst, toElementInfo, validateSidebarElement } from './sidebar-helpers.js';

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

function getSidebarElementsMethod(options = {}) {
    const container = this.getSidebarContainer();
    if (!container) {
        return [];
    }

    const { includeHidden = false, limit = null } = options;
    const infos = collectAll(container, SELECTORS.sidebarItems)
        .map((element, index) => createElementInfo(element, index))
        .filter(info => includeHidden || info.isVisible);

    if (!infos.length) {
        callLogger(this.logger, 'warn', 'No sidebar elements detected', { selectorsTried: SELECTORS.sidebarItems, includeHidden });
    }

    if (typeof limit === 'number' && limit > 0) {
        return infos.slice(0, limit);
    }

    return infos;
}

function getDraggableElementsMethod(options = {}) {
    return this.getSidebarElements(options).filter(info => info.isDraggable);
}

function getElementCountMethod(options = {}) {
    return this.getSidebarElements(options).length;
}

function findElementByNameMethod(name, options = {}) {
    if (!name) {
        return null;
    }
    const normalizedTarget = normalizeName(name).toLowerCase();
    if (!normalizedTarget) {
        return null;
    }
    const includeHidden = options.includeHidden !== undefined ? options.includeHidden : true;
    const elements = this.getSidebarElements({ ...options, includeHidden });
    return elements.find(info => (info.normalizedName || info.name || '').toLowerCase() === normalizedTarget) || null;
}

function findElementsByPredicateMethod(predicate, options = {}) {
    if (typeof predicate !== 'function') {
        return [];
    }
    return this.getSidebarElements(options).filter(info => {
        try {
            return Boolean(predicate(info));
        } catch (error) {
            callLogger(this.logger, 'warn', 'Predicate threw while evaluating element', { error, info });
            return false;
        }
    });
}

function findElementByPredicateMethod(predicate, options = {}) {
    return this.findElementsByPredicate(predicate, options)[0] || null;
}

function getAvailableElementNamesMethod(options = {}) {
    return this.getSidebarElements(options).map(info => info.name).filter(Boolean);
}

function isElementDraggableMethod(target) {
    const info = toElementInfo(target);
    if (!info) {
        return false;
    }
    return validateSidebarElement(info).isValid;
}

function validateSidebarElementMethod(target) {
    return validateSidebarElement(toElementInfo(target));
}

function getSidebarSnapshotMethod(options = {}) {
    const includeHidden = options.includeHidden !== undefined ? options.includeHidden : true;
    const elements = this.getSidebarElements({ ...options, includeHidden });
    const validations = elements.map(info => validateSidebarElement(info));
    const valid = validations.filter(result => result && result.isValid).map(result => result.info);
    const invalid = validations.filter(result => result && !result.isValid);

    return {
        timestamp: Date.now(),
        elements,
        valid,
        invalid,
        total: elements.length,
        validCount: valid.length,
        invalidCount: invalid.length,
        includeHidden
    };
}

function logSidebarSummaryMethod(options = {}) {
    const snapshot = this.getSidebarSnapshot(options);
    const message = `Sidebar summary: ${snapshot.validCount}/${snapshot.total} draggable elements`;
    callLogger(this.logger, 'log', message);

    if (snapshot.invalidCount > 0) {
        const sample = snapshot.invalid.slice(0, 5).map(result => result.info?.name || '(unknown)');
        callLogger(this.logger, 'warn', 'Invalid sidebar elements detected', { count: snapshot.invalidCount, sample });
    }

    return snapshot;
}

function isGameReadyMethod() {
    return Boolean(this.getSidebarContainer() && this.getPlayAreaContainer());
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

function getAvailableElementDataMethod(options = {}) {
    return this.getSidebarElements(options).map(info => ({ id: info.id, name: info.name, emoji: info.emoji }));
}

function logGameStateMethod(options = {}) {
    const count = this.getElementCount(options);
    const names = this.getAvailableElementNames(options);
    callLogger(this.logger, 'log', `Detected ${count} available elements`);
    if (names.length) {
        callLogger(this.logger, 'log', 'Sample elements:', names.slice(0, 10));
    }
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

function runSelectionDiagnosticsMethod(options = {}) {
    const snapshot = this.getSidebarSnapshot({ includeHidden: true, ...options });
    const issues = [];

    if (snapshot.total === 0) {
        issues.push('No sidebar elements detected');
    }

    const invisible = snapshot.elements.filter(info => !info.isVisible);
    if (invisible.length) {
        issues.push(`Found ${invisible.length} hidden sidebar elements`);
    }

    const undraggable = snapshot.elements.filter(info => !info.isDraggable);
    if (undraggable.length) {
        issues.push(`Found ${undraggable.length} non-draggable sidebar elements`);
    }

    const duplicates = findDuplicatesByName(snapshot.elements).slice(0, 5);
    if (duplicates.length) {
        issues.push(`Duplicate element names detected (${duplicates.join(', ')})`);
    }

    if (issues.length) {
        callLogger(this.logger, 'warn', 'Sidebar selection diagnostics reported issues', { issues, snapshot });
    } else {
        callLogger(this.logger, 'log', 'Sidebar selection diagnostics passed');
    }

    return { snapshot, issues };
}

GameInterface.prototype.getSidebarContainer = getSidebarContainerMethod;
GameInterface.prototype.getSidebarElements = getSidebarElementsMethod;
GameInterface.prototype.getDraggableElements = getDraggableElementsMethod;
GameInterface.prototype.getElementCount = getElementCountMethod;
GameInterface.prototype.findElementByName = findElementByNameMethod;
GameInterface.prototype.findElementsByPredicate = findElementsByPredicateMethod;
GameInterface.prototype.findElementByPredicate = findElementByPredicateMethod;
GameInterface.prototype.getAvailableElementNames = getAvailableElementNamesMethod;
GameInterface.prototype.isElementDraggable = isElementDraggableMethod;
GameInterface.prototype.validateSidebarElement = validateSidebarElementMethod;
GameInterface.prototype.getSidebarSnapshot = getSidebarSnapshotMethod;
GameInterface.prototype.logSidebarSummary = logSidebarSummaryMethod;
GameInterface.prototype.isGameReady = isGameReadyMethod;
GameInterface.prototype.getPlayAreaContainer = getPlayAreaContainerMethod;
GameInterface.prototype.getAvailableElementData = getAvailableElementDataMethod;
GameInterface.prototype.logGameState = logGameStateMethod;
GameInterface.prototype.runBasicTests = runBasicTestsMethod;
GameInterface.prototype.runSelectionDiagnostics = runSelectionDiagnosticsMethod;

export function createGameInterface(logger) {
    return new GameInterface({ logger });
}

export { GameInterface };

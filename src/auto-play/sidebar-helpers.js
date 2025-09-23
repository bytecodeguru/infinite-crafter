/**
 * Sidebar helper utilities for GameInterface
 * Provides DOM selectors, element mapping, and validation helpers.
 */

export const SELECTORS = {
    sidebar: ['#sidebar', '.sidebar', '.sidebar-container', '.game-elements-sidebar', '[data-testid="sidebar"]'],
    sidebarItems: ['.item', '.element', '.sidebar-item', '.inventory-item', '[data-element]'],
    playArea: [
        '#instances',
        '#instances-top',
        '#select-box',
        '#particles',
        '.container.infinite-craft',
        '[data-container][class*="infinite-craft"]',
        '#board',
        '.board',
        '.play-area',
        '.game-board',
        '[data-testid="board"]'
    ],
    nameNodes: ['.label', '.name', '.element-name', '.title', '[data-element-name]']
};

const DRAG_CLASS_BLOCKLIST = ['disabled', 'item-disabled'];

export function selectFirst(root, selectors) {
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

export function collectAll(root, selectors) {
    if (!root) {
        return [];
    }
    const elements = new Set();
    selectors.forEach(selector => {
        root.querySelectorAll(selector).forEach(element => elements.add(element));
    });
    return Array.from(elements);
}

function toPlainDataset(element) {
    if (!element || !element.dataset) {
        return {};
    }
    return Object.assign({}, element.dataset);
}

export function isElementVisible(element) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
        return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

export function getElementBounds(element) {
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

function getElementName(element) {
    if (!element) {
        return '';
    }
    const dataset = element.dataset || {};
    const datasetName = dataset.element || dataset.name || dataset.itemText || dataset.itemName || dataset.item;
    if (datasetName) {
        return datasetName.trim();
    }
    const attributeName = element.getAttribute?.('data-element-name') || element.getAttribute?.('data-item-text') || element.getAttribute?.('data-item');
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

function getElementEmoji(element) {
    if (!element) {
        return '';
    }
    const dataset = element.dataset || {};
    if (dataset.itemEmoji) {
        return dataset.itemEmoji;
    }
    const emojiNode = element.querySelector?.('.item-emoji');
    if (emojiNode && emojiNode.textContent) {
        return emojiNode.textContent.trim();
    }
    return '';
}

function hasBlockedClass(element) {
    return Boolean(element && DRAG_CLASS_BLOCKLIST.some(className => element.classList?.contains(className)));
}

function isPotentiallyDraggable(element) {
    if (!element) {
        return false;
    }
    if (typeof element.matches === 'function' && element.matches('[data-item]')) {
        return true;
    }
    const dataset = element.dataset || {};
    if (dataset.item !== undefined || dataset.draggable === 'true') {
        return true;
    }
    if (element.getAttribute?.('draggable') === 'true') {
        return true;
    }
    return false;
}

export function createElementInfo(element, index) {
    const dataset = toPlainDataset(element);
    const name = getElementName(element);
    const bounds = getElementBounds(element);
    const isVisible = isElementVisible(element);
    const isDraggable = isPotentiallyDraggable(element) && !hasBlockedClass(element);
    const identifier = dataset.itemId || dataset.id || element.id || null;

    return {
        element,
        index,
        id: identifier,
        name,
        emoji: getElementEmoji(element),
        dataset,
        bounds,
        isVisible,
        isDraggable
    };
}

export function toElementInfo(target) {
    if (!target) {
        return null;
    }
    if (target.element instanceof HTMLElement) {
        return target;
    }
    if (target instanceof HTMLElement) {
        return createElementInfo(target, -1);
    }
    return null;
}

export function validateSidebarElement(info) {
    if (!info) {
        return { isValid: false, issues: ['Element info missing'], info: null };
    }

    const issues = [];

    if (!info.name) {
        issues.push('Missing element name');
    }

    if (!info.isVisible) {
        issues.push('Element not visible');
    }

    if (!info.isDraggable) {
        issues.push('Element not draggable');
    }

    if (!info.bounds || typeof info.bounds.width !== 'number') {
        issues.push('Missing bounds');
    }

    return {
        isValid: issues.length === 0,
        issues,
        info
    };
}

export function findDuplicatesByName(elements) {
    const counts = elements.reduce((acc, info) => {
        const key = (info.name || '').toLowerCase();
        if (!key) {
            return acc;
        }
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts)
        .filter(([, count]) => count > 1)
        .map(([name]) => name);
}

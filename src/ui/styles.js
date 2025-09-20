/**
 * CSS styles injection
 * Combines panel and log styles and injects them into the document
 */

import { getPanelStyles } from './panel-styles.js';
import { getLogStyles } from './log-styles.js';

/**
 * Add CSS styles to the document
 */
export function addStyles() {
    const style = document.createElement('style');
    style.textContent = getPanelStyles() + getLogStyles();
    document.head.appendChild(style);
}
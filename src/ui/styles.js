/**
 * CSS styles injection
 * Combines panel and log styles and injects them into the document
 */

import { getPanelStyles } from './panel-styles.js';
import { getLogStyles } from './log-styles/index.js';
import { addStyleSheet } from '../utils/dom.js';

/**
 * Add CSS styles to the document
 */
export function addStyles() {
    const cssText = getPanelStyles() + getLogStyles();
    addStyleSheet(cssText);
}

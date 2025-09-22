/**
 * Main control panel creation
 * Creates and configures the draggable control panel overlay
 */

import { getVersionInfo } from '../core/version.js';
import { createElement } from '../utils/dom.js';

/**
 * Create the overlay control panel
 * @returns {HTMLElement} The created panel element
 */
export function createControlPanel() {
    const versionInfo = getVersionInfo();

    const versionDisplay = versionInfo.tag
        ? `<span class="version ${versionInfo.isDev ? 'dev-version' : ''}">${versionInfo.displayVersion} <span class="dev-tag">${versionInfo.tag}</span></span>`
        : `<span class="version">${versionInfo.displayVersion}</span>`;

    const panelHTML = `
        <div class="panel-header">
            <h3>Infinite Craft Helper</h3>
            ${versionDisplay}
        </div>
        <div class="panel-content">
            <p>Control panel ready!</p>
            <!-- Add your controls here -->
        </div>
        <div class="logs-section">
            <div class="logs-header">
                <h4>Logs</h4>
                <div class="logs-controls">
                    <button class="logs-toggle" title="Collapse/Expand logs">▼</button>
                    <button class="logs-copy" title="Copy logs to clipboard">Copy</button>
                    <button class="logs-clear" title="Clear all logs">Clear</button>
                </div>
            </div>
            <div class="logs-content">
                <div class="logs-list" id="logs-list">
                    <div class="logs-empty">No logs yet...</div>
                </div>
            </div>
        </div>
    `;

    const panel = createElement('div', {
        id: 'infinite-craft-control-panel',
        innerHTML: panelHTML,
        style: {
            position: 'fixed',
            top: '24px',
            left: '24px',
            width: '375px',
            minWidth: '375px',
            minHeight: '160px',
            height: 'auto',
            background: 'rgba(30, 30, 30, 0.95)',
            border: '2px solid #4a90e2',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            zIndex: '10000',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            resize: 'both',
            overflow: 'auto'
        }
    });

    return panel;
}

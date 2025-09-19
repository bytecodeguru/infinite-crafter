/**
 * Main control panel creation
 * Creates and configures the draggable control panel overlay
 */

import { getVersionInfo } from '../core/version.js';

/**
 * Create the overlay control panel
 * @returns {HTMLElement} The created panel element
 */
export function createControlPanel() {
    const versionInfo = getVersionInfo();
    const panel = document.createElement('div');
    panel.id = 'infinite-craft-control-panel';

    const versionDisplay = versionInfo.tag
        ? `<span class="version ${versionInfo.isDev ? 'dev-version' : ''}">${versionInfo.displayVersion} <span class="dev-tag">${versionInfo.tag}</span></span>`
        : `<span class="version">${versionInfo.displayVersion}</span>`;

    panel.innerHTML = `
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

    // Style the panel
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 250px;
        background: rgba(30, 30, 30, 0.95);
        border: 2px solid #4a90e2;
        border-radius: 8px;
        color: white;
        font-family: Arial, sans-serif;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    `;

    return panel;
}
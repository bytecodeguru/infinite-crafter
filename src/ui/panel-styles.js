/**
 * Panel styles
 * CSS styles for the main control panel structure and header
 */

/**
 * Get panel CSS styles
 * @returns {string} CSS styles for the panel
 */
export function getPanelStyles() {
    return `
        #infinite-craft-control-panel .panel-header {
            background: linear-gradient(135deg, #4a90e2, #357abd);
            padding: 16px 20px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        #infinite-craft-control-panel .panel-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
        }

        #infinite-craft-control-panel .version {
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 10px;
            border-radius: 14px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #infinite-craft-control-panel .version.dev-version {
            background: rgba(255, 165, 0, 0.25);
            border: 1px solid rgba(255, 165, 0, 0.4);
        }

        #infinite-craft-control-panel .dev-tag {
            background: #ff6b35;
            color: white;
            padding: 1px 6px;
            border-radius: 9px;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        #infinite-craft-control-panel .panel-content {
            padding: 20px;
            border-radius: 0;
        }

        /* When panel-content is the last element (no logs section) */
        #infinite-craft-control-panel .panel-content:last-child {
            border-radius: 0 0 6px 6px;
        }

        #infinite-craft-control-panel .panel-content p {
            margin: 0 0 14px 0;
            font-size: 15px;
            color: #e0e0e0;
        }

        #infinite-craft-control-panel .panel-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        #infinite-craft-control-panel .panel-button {
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 14px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        #infinite-craft-control-panel .panel-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.35);
            background: #5aa0f0;
        }

        #infinite-craft-control-panel .panel-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }

        #infinite-craft-control-panel .panel-button:disabled {
            background: rgba(255, 255, 255, 0.2);
            cursor: default;
            box-shadow: none;
            transform: none;
        }

        #infinite-craft-control-panel .panel-actions-hint {
            font-size: 12px;
            color: rgba(224, 224, 224, 0.7);
        }
    `;
}

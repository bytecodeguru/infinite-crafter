/**
 * Core layout styles for the logs section container, header, controls, and scroll area.
 * @returns {string} CSS rules covering structural layout.
 */
export function buildLogSectionStyles() {
    return `
        /* Logs Section Styles */
        #infinite-craft-control-panel .logs-section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.2);
            border-radius: 0 0 6px 6px;
        }

        /* Ensure logs section completes the panel's rounded corners */
        #infinite-craft-control-panel .logs-section:last-child {
            border-radius: 0 0 6px 6px;
        }

        #infinite-craft-control-panel .logs-section .logs-content:last-child {
            border-radius: 0 0 6px 6px;
        }

        #infinite-craft-control-panel .logs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        #infinite-craft-control-panel .logs-header h4 {
            margin: 0;
            font-size: 14px;
            color: #e0e0e0;
            font-weight: bold;
        }

        #infinite-craft-control-panel .logs-controls {
            display: flex;
            gap: 6px;
        }

        #infinite-craft-control-panel .logs-controls button {
            background: rgba(74, 144, 226, 0.8);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: background 0.2s ease;
            font-family: Arial, sans-serif;
            font-weight: normal;
        }

        #infinite-craft-control-panel .logs-controls button:hover {
            background: rgba(74, 144, 226, 1);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        #infinite-craft-control-panel .logs-controls button:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        #infinite-craft-control-panel .logs-controls button:disabled {
            background: rgba(100, 100, 100, 0.5);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        #infinite-craft-control-panel .logs-controls button:disabled:hover {
            background: rgba(100, 100, 100, 0.5);
            transform: none;
            box-shadow: none;
        }

        #infinite-craft-control-panel .logs-toggle {
            width: 20px;
            padding: 4px 2px !important;
            font-size: 10px !important;
            transition: transform 0.2s ease;
        }

        #infinite-craft-control-panel .logs-toggle.collapsed {
            transform: rotate(-90deg);
        }

        #infinite-craft-control-panel .logs-content {
            max-height: 150px;
            overflow-y: auto;
            overflow-x: hidden;
            transition: max-height 0.3s ease, opacity 0.2s ease;
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: rgba(74, 144, 226, 0.6) rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.1);
        }

        /* Webkit scrollbar styling - consistent with panel theme */
        #infinite-craft-control-panel .logs-content::-webkit-scrollbar {
            width: 6px;
        }

        #infinite-craft-control-panel .logs-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        #infinite-craft-control-panel .logs-content::-webkit-scrollbar-thumb {
            background: rgba(74, 144, 226, 0.6);
            border-radius: 3px;
            transition: background 0.2s ease;
        }

        #infinite-craft-control-panel .logs-content::-webkit-scrollbar-thumb:hover {
            background: rgba(74, 144, 226, 0.8);
        }

        #infinite-craft-control-panel .logs-content.collapsed {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
        }

        #infinite-craft-control-panel .logs-list {
            padding: 8px;
            min-height: 40px;
            font-family: Arial, sans-serif;
        }

        #infinite-craft-control-panel .logs-empty {
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
            margin: 4px;
        }
    `;
}

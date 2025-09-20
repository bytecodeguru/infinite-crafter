/**
 * Log styles
 * CSS styles for the logs section, entries, and controls
 */

/**
 * Get log CSS styles
 * @returns {string} CSS styles for the logs section
 */
export function getLogStyles() {
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

        #infinite-craft-control-panel .log-entry {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 6px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 11px;
            line-height: 1.4;
            border-radius: 3px;
            margin: 1px 0;
            transition: background 0.1s ease;
        }

        #infinite-craft-control-panel .log-entry:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        #infinite-craft-control-panel .log-entry:last-child {
            border-bottom: none;
        }

        #infinite-craft-control-panel .log-timestamp {
            color: #888;
            font-size: 10px;
            white-space: nowrap;
            min-width: 60px;
        }

        #infinite-craft-control-panel .log-level {
            font-size: 12px;
            min-width: 16px;
            text-align: center;
        }

        #infinite-craft-control-panel .log-message {
            flex: 1;
            word-break: break-word;
            color: #e0e0e0;
        }

        /* Log Level Colors - consistent with panel theme */
        #infinite-craft-control-panel .log-entry.error {
            border-left: 2px solid #ff6b6b;
            background: rgba(255, 107, 107, 0.05);
        }

        #infinite-craft-control-panel .log-entry.error .log-level {
            color: #ff6b6b;
        }

        #infinite-craft-control-panel .log-entry.error .log-message {
            color: #ffcccb;
        }

        #infinite-craft-control-panel .log-entry.warn {
            border-left: 2px solid #ffa726;
            background: rgba(255, 167, 38, 0.05);
        }

        #infinite-craft-control-panel .log-entry.warn .log-level {
            color: #ffa726;
        }

        #infinite-craft-control-panel .log-entry.warn .log-message {
            color: #ffe0b3;
        }

        #infinite-craft-control-panel .log-entry.info {
            border-left: 2px solid #4a90e2;
            background: rgba(74, 144, 226, 0.05);
        }

        #infinite-craft-control-panel .log-entry.info .log-level {
            color: #4a90e2;
        }

        #infinite-craft-control-panel .log-entry.info .log-message {
            color: #cce7ff;
        }

        #infinite-craft-control-panel .log-entry.debug {
            border-left: 2px solid #9e9e9e;
            background: rgba(158, 158, 158, 0.05);
        }

        #infinite-craft-control-panel .log-entry.debug .log-level {
            color: #9e9e9e;
        }

        #infinite-craft-control-panel .log-entry.debug .log-message {
            color: #bbb;
        }

        #infinite-craft-control-panel .log-entry.log {
            border-left: 2px solid #e0e0e0;
            background: rgba(224, 224, 224, 0.03);
        }

        #infinite-craft-control-panel .log-entry.log .log-level {
            color: #e0e0e0;
        }

        #infinite-craft-control-panel .log-entry.log .log-message {
            color: #e0e0e0;
        }

        /* Activity indicator styles - consistent with panel theme */
        #infinite-craft-control-panel .logs-activity-indicator {
            color: #ffa726;
            font-size: 12px;
            font-weight: normal;
            animation: pulse-activity 2s infinite;
            background: rgba(255, 167, 38, 0.1);
            padding: 2px 6px;
            border-radius: 10px;
            border: 1px solid rgba(255, 167, 38, 0.3);
        }

        @keyframes pulse-activity {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.7;
                transform: scale(0.98);
            }
        }
    `;
}
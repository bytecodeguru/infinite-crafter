/**
 * Styles that shape the visual presentation for log entries and message content.
 * @returns {string} CSS rules for individual log rows.
 */
export function buildLogEntryStyles() {
    return `
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
    `;
}

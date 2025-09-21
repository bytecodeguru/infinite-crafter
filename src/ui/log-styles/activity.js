/**
 * Activity indicator styling and animation for log updates.
 * @returns {string} CSS covering indicator state.
 */
export function buildLogActivityStyles() {
    return `
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

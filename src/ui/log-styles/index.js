import { buildLogSectionStyles } from './section.js';
import { buildLogEntryStyles } from './entries.js';
import { buildLogActivityStyles } from './activity.js';

/**
 * Get aggregated log CSS styles for the control panel.
 * @returns {string} Complete CSS payload for log UI components.
 */
export function getLogStyles() {
    return [
        buildLogSectionStyles(),
        buildLogEntryStyles(),
        buildLogActivityStyles()
    ].join('\n');
}

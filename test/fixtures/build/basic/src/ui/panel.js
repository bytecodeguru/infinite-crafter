import { Logger } from '../core/logger.js';
import { formatMessage } from '../utils/format.js';

export function initPanel() {
    const logger = new Logger();
    logger.log('Panel ready');

    return {
        status: formatMessage('panel ready'),
        logger
    };
}

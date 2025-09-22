/**
 * Log display utility methods
 * Handles scrolling, DOM manipulation, and helper functions
 */

/**
 * Add utility methods to LogDisplay prototype
 * @param {LogDisplay} LogDisplay - The LogDisplay class
 */
export function addUtilityMethods(LogDisplay) {
    // Scrolling and height management methods
    LogDisplay.prototype.scrollToNewest = function() {
        if (!this.logsContent || this.isCollapsed) {
            return;
        }

        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            try {
                // Scroll to top since newest logs are at the top
                this.logsContent.scrollTop = 0;
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Error scrolling to newest:', error);
            }
        });
    };

    LogDisplay.prototype.scrollToOldest = function() {
        if (!this.logsContent || this.isCollapsed) {
            return;
        }

        requestAnimationFrame(() => {
            try {
                // Scroll to bottom to show oldest logs
                this.logsContent.scrollTop = this.logsContent.scrollHeight;
            } catch (error) {
                this.originalConsole.error('[LogDisplay] Error scrolling to oldest:', error);
            }
        });
    };

    LogDisplay.prototype.ensureScrollingWorksInDraggablePanel = function() {
        if (!this.logsContent) {
            return;
        }

        // Prevent drag events from interfering with scrolling
        this.logsContent.addEventListener('mousedown', (e) => {
            // Stop propagation to prevent dragging when scrolling
            e.stopPropagation();
        });

        this.logsContent.addEventListener('wheel', (e) => {
            // Stop propagation to prevent dragging when scrolling with mouse wheel
            e.stopPropagation();
        });

        // Ensure touch scrolling works on mobile
        this.logsContent.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });

        this.logsContent.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    };

    LogDisplay.prototype.getScrollInfo = function() {
        if (!this.logsContent) {
            return null;
        }

        return {
            scrollTop: this.logsContent.scrollTop,
            scrollHeight: this.logsContent.scrollHeight,
            clientHeight: this.logsContent.clientHeight,
            isAtTop: this.logsContent.scrollTop === 0,
            isAtBottom: this.logsContent.scrollTop + this.logsContent.clientHeight >= this.logsContent.scrollHeight - 1
        };
    };
}
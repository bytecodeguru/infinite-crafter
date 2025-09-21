/**
 * Core log display functionality
 * Handles initialization, DOM setup, and basic display operations
 */

import { addControlMethods } from './log-display-controls.js';
import { addUtilityMethods } from './log-display-utils.js';
import { addRenderMethods } from './log-display-render.js';

/**
 * LogDisplay class for rendering and managing the logs UI
 */
export class LogDisplay {
    constructor(container, logManager) {
        this.container = container;
        this.logManager = logManager;

        // Store original console for internal logging to prevent recursion
        this.originalConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console)
        };

        this.isCollapsed = this.loadCollapseState();
        this.logsList = null;
        this.logsContent = null;
        this.toggleButton = null;
        this.copyButton = null;
        this.clearButton = null;
        this.activityIndicator = null;
        this.newLogsSinceCollapse = 0;
        this.hasBeenCleared = false;

        // Log level icons and styling
        this.logIcons = {
            error: '❌',
            warn: '⚠️',
            info: 'ℹ️',
            log: '📝',
            debug: '🔍'
        };

        this.originalConsole.log('[LogDisplay] Initialized with collapse state:', this.isCollapsed);
    }

    initialize() {
        try {
            // Get DOM elements
            this.logsList = this.container.querySelector('#logs-list');
            this.logsContent = this.container.querySelector('.logs-content');
            this.toggleButton = this.container.querySelector('.logs-toggle');
            this.copyButton = this.container.querySelector('.logs-copy');
            this.clearButton = this.container.querySelector('.logs-clear');

            if (!this.logsList || !this.logsContent || !this.toggleButton || !this.copyButton || !this.clearButton) {
                throw new Error('Required DOM elements not found');
            }

            // Create activity indicator
            this.createActivityIndicator();

            // Set up event listeners
            this.setupEventListeners();

            // Set up scrolling behavior for draggable panel
            this.ensureScrollingWorksInDraggablePanel();

            // Subscribe to log manager events
            this.logManager.subscribe((event, data) => {
                this.handleLogEvent(event, data);
            });

            // Apply saved collapse state
            this.applyCollapseState();

            // Initial render
            this.updateDisplay();

            this.originalConsole.log('[LogDisplay] Initialized successfully');
            return true;
        } catch (error) {
            this.originalConsole.error('[LogDisplay] Failed to initialize:', error);
            return false;
        }
    }

    // Collapse state persistence methods
    loadCollapseState() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('infinite-craft-helper-logs-collapsed');
                return saved === 'true';
            }
            return false;
        } catch (error) {
            this.originalConsole.warn('[LogDisplay] Failed to load collapse state:', error);
            return false;
        }
    }

    saveCollapseState() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('infinite-craft-helper-logs-collapsed', this.isCollapsed.toString());
            }
        } catch (error) {
            this.originalConsole.warn('[LogDisplay] Failed to save collapse state:', error);
        }
    }

    applyCollapseState() {
        if (this.isCollapsed) {
            this.logsContent.classList.add('collapsed');
            this.toggleButton.classList.add('collapsed');
            this.toggleButton.title = 'Expand logs';
        } else {
            this.logsContent.classList.remove('collapsed');
            this.toggleButton.classList.remove('collapsed');
            this.toggleButton.title = 'Collapse logs';
        }
        this.updateActivityIndicator();
    }

}

// Add control and utility methods to the LogDisplay class
addControlMethods(LogDisplay);
addUtilityMethods(LogDisplay);
addRenderMethods(LogDisplay);

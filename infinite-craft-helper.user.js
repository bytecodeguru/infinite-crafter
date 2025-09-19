// ==UserScript==
// @name         Infinite Craft Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Control panel overlay for Infinite Craft with GameInterface foundation
// @author       You
// @match        https://neal.fun/infinite-craft/*
// @match        https://neal.fun/infinite-craft
// @updateURL    https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/infinite-craft-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/infinite-craft-helper.user.js
// @supportURL   https://github.com/bytecodeguru/infinite-crafter/issues
// @homepageURL  https://github.com/bytecodeguru/infinite-crafter
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get version info from userscript metadata
    function getVersionInfo() {
        const version = '1.0.2';
        const isDevVersion = version.includes('-') || version.includes('dev') || version.includes('test');
        
        return {
            version: version,
            isDev: isDevVersion,
            displayVersion: isDevVersion ? version : `v${version}`,
            tag: isDevVersion ? 'DEV' : null
        };
    }

    // Create the overlay control panel
    function createControlPanel() {
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
        `;

        // Style the panel
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 280px;
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

    // Add CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #infinite-craft-control-panel .panel-header {
                background: linear-gradient(135deg, #4a90e2, #357abd);
                padding: 12px 16px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }

            #infinite-craft-control-panel .panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }

            #infinite-craft-control-panel .version {
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            #infinite-craft-control-panel .version.dev-version {
                background: rgba(255, 165, 0, 0.3);
                border: 1px solid rgba(255, 165, 0, 0.5);
            }

            #infinite-craft-control-panel .dev-tag {
                background: #ff6b35;
                color: white;
                padding: 1px 6px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            #infinite-craft-control-panel .panel-content {
                padding: 16px;
            }

            #infinite-craft-control-panel .panel-content p {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #e0e0e0;
            }
        `;
        document.head.appendChild(style);
    }

    // Make panel draggable
    function makeDraggable(panel) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = panel.querySelector('.panel-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // GameInterface class for DOM interaction and game state detection
    class GameInterface {
        constructor() {
            this.sidebarSelector = '.sidebar';
            this.playAreaSelector = '.container';
            this.elementSelector = '.item';
            this.elementTextSelector = '.item-text';
            
            console.log('[GameInterface] Initialized with selectors:', {
                sidebar: this.sidebarSelector,
                playArea: this.playAreaSelector,
                element: this.elementSelector,
                elementText: this.elementTextSelector
            });
        }

        // Basic DOM query methods
        getSidebar() {
            const sidebar = document.querySelector(this.sidebarSelector);
            console.log('[GameInterface] getSidebar():', sidebar ? 'Found' : 'Not found');
            return sidebar;
        }

        getPlayArea() {
            const playArea = document.querySelector(this.playAreaSelector);
            console.log('[GameInterface] getPlayArea():', playArea ? 'Found' : 'Not found');
            return playArea;
        }

        getAllElements() {
            const elements = document.querySelectorAll(this.elementSelector);
            console.log('[GameInterface] getAllElements(): Found', elements.length, 'elements');
            return Array.from(elements);
        }

        // Element counting and availability detection functions
        getAvailableElements() {
            const sidebar = this.getSidebar();
            if (!sidebar) {
                console.log('[GameInterface] getAvailableElements(): No sidebar found');
                return [];
            }

            const elements = sidebar.querySelectorAll(this.elementSelector);
            const availableElements = Array.from(elements).map(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return {
                    name: textElement ? textElement.textContent.trim() : 'Unknown',
                    domElement: element,
                    position: this.getElementBounds(element),
                    isNew: element.classList.contains('new') || false
                };
            });

            console.log('[GameInterface] getAvailableElements(): Found', availableElements.length, 'available elements');
            return availableElements;
        }

        getPlayAreaElements() {
            const playArea = this.getPlayArea();
            if (!playArea) {
                console.log('[GameInterface] getPlayAreaElements(): No play area found');
                return [];
            }

            const elements = playArea.querySelectorAll(this.elementSelector);
            const playAreaElements = Array.from(elements).map(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return {
                    name: textElement ? textElement.textContent.trim() : 'Unknown',
                    domElement: element,
                    position: this.getElementBounds(element),
                    isNew: element.classList.contains('new') || false
                };
            });

            console.log('[GameInterface] getPlayAreaElements(): Found', playAreaElements.length, 'play area elements');
            return playAreaElements;
        }

        getElementCount() {
            const total = this.getAllElements().length;
            const available = this.getAvailableElements().length;
            const inPlayArea = this.getPlayAreaElements().length;
            
            const counts = {
                total,
                available,
                inPlayArea
            };

            console.log('[GameInterface] getElementCount():', counts);
            return counts;
        }

        // Element detection and validation
        findElementByName(name) {
            const elements = this.getAllElements();
            const found = elements.find(element => {
                const textElement = element.querySelector(this.elementTextSelector);
                return textElement && textElement.textContent.trim() === name;
            });

            console.log('[GameInterface] findElementByName("' + name + '"):', found ? 'Found' : 'Not found');
            return found || null;
        }

        isElementDraggable(element) {
            if (!element) {
                console.log('[GameInterface] isElementDraggable(): Element is null');
                return false;
            }

            // Check if element has draggable attribute or is in sidebar
            const isDraggable = element.draggable !== false && 
                               !element.classList.contains('disabled') &&
                               element.offsetParent !== null; // Element is visible

            console.log('[GameInterface] isElementDraggable():', isDraggable);
            return isDraggable;
        }

        // Utility methods
        getElementBounds(element) {
            if (!element) {
                console.log('[GameInterface] getElementBounds(): Element is null');
                return null;
            }

            const bounds = element.getBoundingClientRect();
            const result = {
                x: bounds.left,
                y: bounds.top,
                width: bounds.width,
                height: bounds.height,
                centerX: bounds.left + bounds.width / 2,
                centerY: bounds.top + bounds.height / 2
            };

            console.log('[GameInterface] getElementBounds():', result);
            return result;
        }

        // Game state detection
        isGameReady() {
            const sidebar = this.getSidebar();
            const playArea = this.getPlayArea();
            const hasElements = this.getAvailableElements().length > 0;
            
            const ready = !!(sidebar && playArea && hasElements);
            console.log('[GameInterface] isGameReady():', ready, {
                hasSidebar: !!sidebar,
                hasPlayArea: !!playArea,
                hasElements
            });
            
            return ready;
        }

        isLoading() {
            // Check for common loading indicators
            const loadingIndicators = [
                '.loading',
                '.spinner',
                '[data-loading="true"]'
            ];

            const isLoading = loadingIndicators.some(selector => 
                document.querySelector(selector) !== null
            );

            console.log('[GameInterface] isLoading():', isLoading);
            return isLoading;
        }

        // Debug and verification methods
        logGameState() {
            console.log('[GameInterface] === GAME STATE DEBUG ===');
            console.log('Game Ready:', this.isGameReady());
            console.log('Loading:', this.isLoading());
            console.log('Element Counts:', this.getElementCount());
            console.log('Available Elements:', this.getAvailableElements().map(e => e.name));
            console.log('Play Area Elements:', this.getPlayAreaElements().map(e => e.name));
            console.log('[GameInterface] === END DEBUG ===');
        }

        // Test all basic functionality
        runBasicTests() {
            console.log('[GameInterface] === RUNNING BASIC TESTS ===');
            
            try {
                // Test DOM queries
                console.log('Test 1: DOM Queries');
                const sidebar = this.getSidebar();
                const playArea = this.getPlayArea();
                console.log('✓ Sidebar found:', !!sidebar);
                console.log('✓ Play area found:', !!playArea);

                // Test element detection
                console.log('Test 2: Element Detection');
                const allElements = this.getAllElements();
                const availableElements = this.getAvailableElements();
                const playAreaElements = this.getPlayAreaElements();
                console.log('✓ All elements:', allElements.length);
                console.log('✓ Available elements:', availableElements.length);
                console.log('✓ Play area elements:', playAreaElements.length);

                // Test counting
                console.log('Test 3: Element Counting');
                const counts = this.getElementCount();
                console.log('✓ Element counts:', counts);

                // Test game state
                console.log('Test 4: Game State');
                console.log('✓ Game ready:', this.isGameReady());
                console.log('✓ Game loading:', this.isLoading());

                // Test element search (if elements exist)
                if (availableElements.length > 0) {
                    console.log('Test 5: Element Search');
                    const firstElement = availableElements[0];
                    const found = this.findElementByName(firstElement.name);
                    console.log('✓ Element search for "' + firstElement.name + '":', !!found);
                    console.log('✓ Element draggable check:', this.isElementDraggable(found));
                }

                console.log('[GameInterface] ✅ ALL BASIC TESTS COMPLETED');
                return true;
            } catch (error) {
                console.error('[GameInterface] ❌ TEST FAILED:', error);
                return false;
            }
        }
    }

    // Initialize the script
    function init() {
        // Wait for the page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Add styles
        addStyles();

        // Create and add the control panel
        const panel = createControlPanel();
        document.body.appendChild(panel);

        // Make it draggable
        makeDraggable(panel);

        // Initialize GameInterface for testing
        console.log('Infinite Craft Helper v1.0.1-game-interface-foundation loaded successfully!');
        
        // Wait a moment for the game to fully load, then initialize GameInterface
        setTimeout(() => {
            console.log('[Init] Initializing GameInterface...');
            const gameInterface = new GameInterface();
            
            // Run basic tests to verify functionality
            gameInterface.runBasicTests();
            
            // Log current game state
            gameInterface.logGameState();
            
            // Make gameInterface available globally for debugging
            window.gameInterface = gameInterface;
            console.log('[Init] GameInterface available as window.gameInterface for debugging');
        }, 2000);
    }

    // Start the script
    init();
})();
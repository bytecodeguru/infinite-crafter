// ==UserScript==
// @name         Infinite Craft Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Control panel overlay for Infinite Craft
// @author       You
// @match        https://neal.fun/infinite-craft/*
// @match        https://neal.fun/infinite-craft
// @updateURL    https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/main/infinite-craft-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/main/infinite-craft-helper.user.js
// @supportURL   https://github.com/bytecodeguru/infinite-crafter/issues
// @homepageURL  https://github.com/bytecodeguru/infinite-crafter
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the overlay control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'infinite-craft-control-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Infinite Craft Helper</h3>
                <span class="version">v1.0.1</span>
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

        console.log('Infinite Craft Helper v1.0.1 loaded successfully!');
    }

    // Start the script
    init();
})();
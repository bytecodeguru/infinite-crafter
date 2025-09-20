/**
 * DOM utilities and helpers
 * Common DOM manipulation functions used throughout the application
 */

/**
 * Wait for DOM to be ready
 * @param {Function} callback - Function to call when DOM is ready
 */
export function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Create and append a style element to the document head
 * @param {string} cssText - CSS text content
 * @returns {HTMLStyleElement} The created style element
 */
export function addStyleSheet(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    return style;
}

/**
 * Safely append element to document body
 * @param {HTMLElement} element - Element to append
 * @returns {boolean} True if successful, false otherwise
 */
export function appendToBody(element) {
    if (document.body) {
        document.body.appendChild(element);
        return true;
    } else {
        console.warn('[DOM] document.body not available, element not added to DOM');
        return false;
    }
}

/**
 * Create a DOM element with optional properties
 * @param {string} tagName - HTML tag name
 * @param {Object} options - Optional properties
 * @param {string} options.className - CSS class name
 * @param {string} options.id - Element ID
 * @param {string} options.innerHTML - Inner HTML content
 * @param {Object} options.style - Style properties
 * @param {Object} options.dataset - Data attributes
 * @returns {HTMLElement} Created element
 */
export function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    
    if (options.className) {
        element.className = options.className;
    }
    
    if (options.id) {
        element.id = options.id;
    }
    
    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }
    
    if (options.style) {
        Object.assign(element.style, options.style);
    }
    
    if (options.dataset) {
        Object.assign(element.dataset, options.dataset);
    }
    
    return element;
}

/**
 * Escape HTML text to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Query selector with error handling
 * @param {string|HTMLElement} container - Container element or selector
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Found element or null
 */
export function safeQuerySelector(container, selector) {
    try {
        const containerElement = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!containerElement) {
            return null;
        }
        
        return containerElement.querySelector(selector);
    } catch (error) {
        console.warn('[DOM] Query selector failed:', selector, error);
        return null;
    }
}

/**
 * Add event listener with error handling
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 * @returns {Function|null} Cleanup function or null if failed
 */
export function addEventListenerSafe(element, event, handler, options = {}) {
    try {
        if (!element || typeof handler !== 'function') {
            console.warn('[DOM] Invalid element or handler for event listener');
            return null;
        }
        
        element.addEventListener(event, handler, options);
        
        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
        };
    } catch (error) {
        console.warn('[DOM] Failed to add event listener:', event, error);
        return null;
    }
}

/**
 * Create temporary element for clipboard operations
 * @param {string} text - Text to copy
 * @returns {HTMLTextAreaElement} Temporary textarea element
 */
export function createTempTextarea(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    return textarea;
}

/**
 * Remove element safely
 * @param {HTMLElement} element - Element to remove
 * @returns {boolean} True if removed successfully
 */
export function removeElement(element) {
    try {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            return true;
        }
        return false;
    } catch (error) {
        console.warn('[DOM] Failed to remove element:', error);
        return false;
    }
}
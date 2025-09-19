# Design Document

## Overview

The Control Panel Logging feature extends the existing Infinite Craft Helper userscript by adding a comprehensive logging system directly within the control panel. This design integrates seamlessly with the current architecture while providing real-time log capture, display, and clipboard functionality. The logging system intercepts console messages and presents them in a user-friendly interface that eliminates the need to open Chrome DevTools.

## Architecture

### Core Components

1. **LogCapture System**: Intercepts and captures console messages
2. **LogDisplay Component**: Renders logs within the control panel
3. **LogManager**: Manages log storage, filtering, and cleanup
4. **ClipboardHandler**: Handles copying logs to clipboard with formatting

### Integration Points

The logging system integrates with the existing userscript architecture:
- Extends the `createControlPanel()` function to include the logs section
- Adds new CSS styles via the `addStyles()` function
- Maintains compatibility with the existing draggable functionality
- Leverages the current IIFE wrapper and initialization pattern

## Components and Interfaces

### LogCapture System

```javascript
class LogCapture {
    constructor(logManager) {
        this.logManager = logManager;
        this.originalConsole = {};
        this.isCapturing = false;
    }
    
    startCapturing() {
        // Intercept console methods (log, warn, error, debug, info)
        // Forward to original console and capture for display
    }
    
    stopCapturing() {
        // Restore original console methods
    }
}
```

### LogManager

```javascript
class LogManager {
    constructor(maxLogs = 100) {
        this.logs = [];
        this.maxLogs = maxLogs;
        this.listeners = [];
    }
    
    addLog(level, message, timestamp) {
        // Add log entry and manage size limits
        // Notify listeners of new log
    }
    
    clearLogs() {
        // Clear all logs and notify listeners
    }
    
    getLogs() {
        // Return current logs array
    }
    
    subscribe(callback) {
        // Add listener for log updates
    }
}
```

### LogDisplay Component

```javascript
class LogDisplay {
    constructor(container, logManager) {
        this.container = container;
        this.logManager = logManager;
        this.isCollapsed = false;
        this.maxDisplayHeight = 200;
    }
    
    render() {
        // Create logs section HTML structure
        // Set up event listeners for collapse/expand and copy
    }
    
    updateDisplay() {
        // Refresh log entries display
        // Handle scrolling to show newest logs
    }
    
    formatLogForDisplay(log) {
        // Format individual log entry with styling
    }
    
    copyLogsToClipboard() {
        // Format all logs and copy to clipboard
        // Show visual feedback
    }
}
```

## Data Models

### Log Entry Structure

```javascript
{
    id: string,           // Unique identifier
    timestamp: Date,      // When the log was created
    level: string,        // 'log', 'warn', 'error', 'debug', 'info'
    message: string,      // The log message content
    args: Array,          // Original console arguments
    source: string        // 'userscript' or 'page' (if we want to distinguish)
}
```

### Log Level Styling

```javascript
const LOG_STYLES = {
    error: { color: '#ff6b6b', icon: '❌' },
    warn: { color: '#ffa726', icon: '⚠️' },
    info: { color: '#42a5f5', icon: 'ℹ️' },
    log: { color: '#e0e0e0', icon: '📝' },
    debug: { color: '#9e9e9e', icon: '🔍' }
};
```

## Error Handling

### Console Interception Safety
- Wrap console method overrides in try-catch blocks
- Ensure original console functionality is never broken
- Provide fallback if log capture fails
- Gracefully handle circular references in logged objects

### Memory Management
- Implement automatic log rotation when maxLogs is reached
- Clear logs on userscript reload/reinitialize
- Handle potential memory leaks from retained log objects

### UI Error Handling
- Handle clipboard API failures gracefully
- Provide fallback text selection if clipboard API unavailable
- Manage DOM manipulation errors during log display updates

## Testing Strategy

### Unit Testing Approach
Since this is a userscript, testing will be done through:

1. **Console Integration Tests**
   - Verify all console methods are properly intercepted
   - Test that original console functionality remains intact
   - Validate log capture accuracy and formatting

2. **UI Component Tests**
   - Test log display rendering with various log types
   - Verify collapse/expand functionality
   - Test scrolling behavior with many logs
   - Validate copy-to-clipboard functionality

3. **Memory and Performance Tests**
   - Test log rotation with maximum log limits
   - Verify memory cleanup on clear operations
   - Test performance with high-frequency logging

4. **Integration Tests**
   - Test compatibility with existing control panel functionality
   - Verify dragging works with expanded logs section
   - Test initialization and cleanup during page navigation

### Manual Testing Scenarios
- Generate various types of console messages
- Test with existing GameInterface logging
- Verify functionality across different browsers
- Test clipboard functionality with different content types

## Implementation Notes

### CSS Integration
The logs section will extend the existing panel styles:
- Use consistent color scheme and typography
- Implement smooth transitions for collapse/expand
- Ensure proper scrolling within the panel constraints
- Maintain visual hierarchy with existing panel elements

### Performance Considerations
- Debounce log display updates to prevent excessive DOM manipulation
- Use document fragments for efficient log entry rendering
- Implement virtual scrolling if log volume becomes excessive
- Minimize memory footprint of stored log objects

### Browser Compatibility
- Use modern clipboard API with fallback for older browsers
- Ensure console interception works across Chrome, Firefox, Safari, Edge
- Test backdrop-filter compatibility with logs section styling
- Validate userscript manager compatibility (Tampermonkey, Greasemonkey, Violentmonkey)
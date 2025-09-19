# Design Document

## Overview

The Control Panel Logging feature extends the existing Infinite Craft Helper userscript by adding a simple logging display directly within the control panel. This design provides a dedicated logging API for the userscript to display applicative messages, eliminating the need to open Chrome DevTools to see what the userscript is doing. The system focuses on simplicity and ease of use rather than comprehensive console interception.

## Architecture

### Core Components

1. **Logger API**: Simple logging functions for the userscript to call
2. **LogDisplay Component**: Renders logs within the control panel
3. **LogManager**: Manages log storage and cleanup

### Integration Points

The logging system integrates with the existing userscript architecture:
- Extends the `createControlPanel()` function to include the logs section
- Adds new CSS styles via the `addStyles()` function
- Maintains compatibility with the existing draggable functionality
- Leverages the current IIFE wrapper and initialization pattern

## Components and Interfaces

### Logger API

```javascript
const Logger = {
    log(message) {
        // Add info-level log entry
        logManager.addLog('info', message, new Date());
    },
    
    warn(message) {
        // Add warning-level log entry
        logManager.addLog('warn', message, new Date());
    },
    
    error(message) {
        // Add error-level log entry
        logManager.addLog('error', message, new Date());
    }
};
```

### LogManager

```javascript
class LogManager {
    constructor() {
        this.logs = [];
        this.listeners = [];
    }
    
    addLog(level, message, timestamp) {
        // Add log entry
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
        this.maxDisplayHeight = 150;
    }
    
    render() {
        // Create logs section HTML structure
        // Set up event listeners for collapse/expand, clear, and copy
    }
    
    updateDisplay() {
        // Refresh log entries display
        // Handle scrolling to show newest logs
    }
    
    formatLogForDisplay(log) {
        // Format individual log entry with basic styling
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
    info: { color: '#e0e0e0', icon: 'ℹ️' }
};
```

## Error Handling

### Memory Management
- Clear logs on userscript reload/reinitialize
- Keep log objects lightweight (just level, message, timestamp)

### UI Error Handling
- Handle clipboard API failures gracefully
- Provide fallback text selection if clipboard API unavailable
- Manage DOM manipulation errors during log display updates
- Handle edge cases with very long log messages

## Testing Strategy

### Manual Testing Approach
Since this is a userscript, testing will be done through:

1. **Logger API Tests**
   - Test Logger.log(), Logger.warn(), and Logger.error() functions
   - Verify messages appear correctly in the control panel
   - Test with various message types and lengths

2. **UI Component Tests**
   - Test log display rendering with different log levels
   - Verify collapse/expand functionality
   - Test scrolling behavior with many logs
   - Validate clear functionality
   - Test copy-to-clipboard functionality

3. **Memory and Performance Tests**
   - Verify memory cleanup on clear operations
   - Test performance with frequent logging

4. **Integration Tests**
   - Test compatibility with existing control panel functionality
   - Verify dragging works with expanded logs section
   - Test initialization during page load

### Manual Testing Scenarios
- Call Logger functions from different parts of the userscript
- Test with rapid successive log calls
- Verify functionality across different browsers
- Test UI responsiveness with many log entries

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
- Keep log storage lightweight with simple objects

### Browser Compatibility
- Use modern clipboard API with fallback for older browsers
- Use standard DOM APIs for maximum compatibility
- Test backdrop-filter compatibility with logs section styling
- Validate userscript manager compatibility (Tampermonkey, Greasemonkey, Violentmonkey)
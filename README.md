# Infinite Craft Helper

A Tampermonkey userscript that adds a draggable control panel overlay to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/), providing enhanced functionality and tools for the game.

## Features

- **Draggable Control Panel**: Moveable overlay positioned in the top-left corner
- **Modern UI Design**: Semi-transparent background with blur effects and gradient styling
- **Smart Version Display**: Automatically detects development vs production versions by analyzing both version format and script source URL
- **GameInterface Foundation**: Complete API for game interaction and automation
- **Element Detection & Analysis**: Automatically detects and analyzes all game elements
- **Game State Monitoring**: Real-time detection of game ready/loading states
- **Element Tracking**: Comprehensive monitoring of sidebar and play area elements
- **Position & Bounds Calculation**: Precise element positioning for automation
- **Advanced Logging System**: Built-in LogManager with log storage, rotation, and event system
- **Console Log Display**: Real-time console log capture and display within the control panel
- **Log Management**: Automatic log rotation, filtering by level, and memory management
- **Interactive Log Controls**: Collapse/expand, copy to clipboard, and clear logs functionality
- **Visual Log Levels**: Color-coded log entries with icons for error, warn, info, and debug messages
- **Debug Console**: Extensive logging and testing tools for development
- **Automated Testing Suite**: Built-in functionality tests for reliability
- **Extensible Framework**: Ready for additional control features and enhancements
- **Automatic Updates**: Seamless updates via GitHub integration

## Screenshots

The control panel appears as a sleek overlay that you can drag around the screen:

```
┌─────────────────────────────────────────┐
│ Infinite Craft Helper v1.0.4-dev   DEV │
├─────────────────────────────────────────┤
│ Control panel ready!                    │
│                                         │
│ GameInterface foundation loaded         │
│ Check console for debug tools          │
├─────────────────────────────────────────┤
│ Console Logs                    ▼ Copy Clear │
├─────────────────────────────────────────┤
│ 14:32:15 ℹ️ GameInterface initialized   │
│ 14:32:16 📝 Control panel ready         │
│ 14:32:17 ⚠️ Element not found: Water    │
│ 14:32:18 ❌ Failed to combine elements  │
└─────────────────────────────────────────┘
```

**Version Indicators:**
- **Production versions**: Clean version display (e.g., "v1.0.2")
- **Development versions**: Full version with orange "DEV" tag (e.g., "1.0.1-feature-name DEV")

## Installation

### Prerequisites

You need a userscript manager installed in your browser. We recommend:
- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

### Method 1: Direct Install from GitHub (Recommended)

**Production Version (Stable):**
1. **Click this link**: [Install Infinite Craft Helper](https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/main/infinite-craft-helper.user.js)
2. Your userscript manager will automatically detect the script and show an installation dialog
3. Click **Install** to add the script
4. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/) to see the control panel

**Development Version (Latest Features):**
1. **Click this link**: [Install Development Version](https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/infinite-craft-helper.user.js)
2. This includes the latest GameInterface foundation and upcoming features
3. May be less stable but includes cutting-edge functionality

### Method 2: Manual Installation

1. Open your userscript manager dashboard
2. Click **Create a new script** or **Add new script**
3. Copy the contents of [`infinite-craft-helper.user.js`](infinite-craft-helper.user.js)
4. Paste it into the script editor
5. Save the script (usually Ctrl+S or Cmd+S)
6. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/) to see the control panel

## Usage

1. Navigate to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/)
2. The control panel will automatically appear in the top-left corner
3. **Drag the panel**: Click and drag the header to move it around the screen
4. **View Console Logs**: All console messages appear in the logs section with timestamps and color-coded levels
5. **Manage Logs**: Use the collapse/expand button (▼), copy logs to clipboard, or clear all logs
6. **Debug Console**: Open browser developer tools (F12) to see detailed game analysis
7. **GameInterface API**: Access `window.gameInterface` in console for manual testing

### Developer Console Commands

Once the script loads, you can interact with the game interface and logging system through the console. The logging system automatically captures all console messages and displays them in the control panel, while also providing APIs for manual interaction:

#### GameInterface API
```javascript
// Get comprehensive game state analysis
gameInterface.logGameState()

// Count elements by location
gameInterface.getElementCount()
// Returns: { total: 15, available: 12, inPlayArea: 3 }

// Find specific elements by name
gameInterface.findElementByName("Fire")
// Returns: HTMLElement or null

// Get all available elements with metadata
gameInterface.getAvailableElements()
// Returns: Array of element objects with name, position, DOM reference

// Get elements currently in play area
gameInterface.getPlayAreaElements()

// Check game state
gameInterface.isGameReady()    // true if game is loaded and interactive
gameInterface.isLoading()     // true if game is still loading

// Element interaction utilities
const fireElement = gameInterface.findElementByName("Fire");
gameInterface.isElementDraggable(fireElement);  // Check if draggable
gameInterface.getElementBounds(fireElement);    // Get position/size

// Run comprehensive automated tests (disabled by default to prevent excessive logging)
gameInterface.runBasicTests()
// Returns true immediately - tests are disabled to keep console clean
```

#### LogManager API
```javascript
// Access the logging system
logManager.addLog('info', 'Custom log message')
logManager.addLog('error', 'Something went wrong', [additionalData])

// Get current logs
logManager.getLogs()           // Returns array of all log entries
logManager.getLogCount()       // Returns total number of logs
logManager.getLogsByLevel('error')  // Filter logs by level

// Log management
logManager.clearLogs()         // Clear all logs
logManager.getLogStats()       // Get statistics by log level

// Event system - subscribe to log events
const unsubscribe = logManager.subscribe((event, data) => {
    if (event === 'logAdded') {
        console.log('New log added:', data.toString());
    }
});

// Run comprehensive logging tests
logManager.runLogManagerTests()
// Tests log storage, rotation, events, and filtering with detailed output
```

#### LogCapture API
```javascript
// Access the console capture system
logCapture.startCapturing()    // Begin intercepting console messages
logCapture.stopCapturing()     // Stop intercepting console messages
logCapture.isCapturing()       // Check if currently capturing

// Run console capture tests
logCapture.runCaptureTests()
// Tests console interception, object logging, and circular reference handling
```

#### Console Log Display Features
The control panel includes a built-in console log viewer with the following features:

**Visual Log Levels:**
- ❌ **Error logs**: Red styling for critical issues
- ⚠️ **Warning logs**: Orange styling for warnings
- ℹ️ **Info logs**: Blue styling for informational messages
- 📝 **Standard logs**: Default styling for general messages
- 🔍 **Debug logs**: Muted styling for debug information

**Interactive Controls:**
- **Collapse/Expand**: Toggle button (▼) to show/hide the logs section
- **Copy to Clipboard**: Copy all logs in readable format with timestamps
- **Clear Logs**: Remove all current log entries
- **Auto-scroll**: Automatically shows newest log entries
- **Log Count**: Shows number of logs when collapsed

**Log Format:**
Each log entry displays:
- **Timestamp**: Precise time when the log was created (HH:MM:SS format)
- **Level Icon**: Visual indicator for the log level
- **Message**: The actual log content with proper formatting

## Development

### Project Structure

```
infinite-crafter/
├── .kiro/
│   └── scripts/
│       └── branch-helper.js       # Branch management utility
├── infinite-craft-helper.user.js  # Main userscript file
├── test-version.js                # Version management testing utility
└── README.md                      # This file
```

### Branch Helper Utility

The project includes a Node.js utility script to streamline branch-based development workflow. This tool automates the process of creating feature branches, updating userscript URLs, and managing versions.

#### Prerequisites

- Node.js installed on your system
- Git repository properly configured

#### Usage

**Setting up a new feature branch:**
```bash
node .kiro/scripts/branch-helper.js setup-feature <feature-name>
```

This command will:
1. Create and checkout a new feature branch (`feature/<feature-name>`)
2. Update userscript URLs to point to the feature branch
3. Set a development version (`1.0.1-<feature-name>`)
4. Commit and push the changes
5. Display the installation URL for testing

**Incrementing development version:**
```bash
node .kiro/scripts/branch-helper.js increment-dev
```

This command will:
1. Increment the dev version number (e.g., `1.1.0` -> `1.1.1`)
2. Only works on feature branches for safety

**Auto-commit with version increment:**
```bash
node .kiro/scripts/branch-helper.js auto-commit
```

This command will:
1. Increment the dev version automatically
2. Commit and push changes to the current feature branch
3. Useful for rapid iteration during development

**Preparing for production release:**
```bash
node .kiro/scripts/branch-helper.js prepare-release
```

This command will:
1. Update userscript URLs back to the main branch
2. Clean up version number for production
3. Prepare files for final commit and merge

**Testing version management:**
```bash
node test-version.js
```

This utility script will:
1. Display current branch and version information
2. Test version parsing and increment logic
3. Validate branch type detection
4. Useful for debugging version management issues

#### Example Workflow

```bash
# Start working on a new auto-play feature
node .kiro/scripts/branch-helper.js setup-feature auto-play

# The script outputs:
# Setting up feature branch: feature/auto-play
# Updated URLs to point to branch: feature/auto-play
# Updated version to: 1.0.1-auto-play
# Feature branch ready! Install userscript from:
# https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/auto-play/infinite-craft-helper.user.js

# Install the feature branch URL in Tampermonkey for testing
# Make your changes, test, and iterate...

# When ready for production:
node .kiro/scripts/branch-helper.js prepare-release
git add .
git commit -m "Prepare for release"
git checkout main
git merge feature/auto-play
git push origin main
```

#### Benefits

- **Automated URL Management**: No manual editing of userscript headers
- **Version Control**: Automatic version numbering for development and production
- **Testing Workflow**: Easy installation of feature branches for testing
- **Consistent Process**: Standardized workflow for all contributors
- **Development Safety**: Version increment commands only work on feature branches
- **Rapid Iteration**: Auto-commit feature for quick development cycles
- **Debug Tools**: Test utilities for validating version management logic

### Adding New Features

The control panel is designed to be easily extensible. To add new controls:

1. Modify the `panel-content` section in the `createControlPanel()` function
2. Add corresponding event listeners and functionality
3. Update the version in the `getVersionInfo()` function (the display will automatically adapt)
4. Commit and push changes for automatic distribution

#### Version Management for Features

When working on features, use descriptive version names:
```javascript
// In getVersionInfo() function
const version = '1.0.1-your-feature-name';  // Shows "DEV" tag automatically
```

The system will automatically:
- Display the full version with "DEV" tag
- Apply orange highlighting to indicate development status
- Switch to clean formatting when you use production versions (e.g., '1.0.2')

### GameInterface API

The script includes a comprehensive `GameInterface` class that provides a complete foundation for game automation:

#### Core Features:
- **Element Detection**: Find and analyze all game elements with metadata
- **DOM Queries**: Reliable selectors for sidebar and play area interactions
- **Game State Monitoring**: Real-time detection of game ready/loading states
- **Element Validation**: Verify draggable elements and interaction capabilities
- **Position Tracking**: Calculate precise element bounds and center points
- **Debug Tools**: Extensive logging and automated testing methods

#### Key Methods:
- `getAvailableElements()` - Get all elements in sidebar with names, positions, and states
- `getPlayAreaElements()` - Get all elements in play area with full metadata
- `findElementByName(name)` - Find specific element by exact name match
- `isGameReady()` - Check if game is fully loaded and interactive
- `isElementDraggable(element)` - Verify if element can be dragged
- `getElementBounds(element)` - Get precise position and dimensions
- `getElementCount()` - Count elements by location (total, available, play area)
- `logGameState()` - Comprehensive debug output of current game state
- `runBasicTests()` - Automated test suite for all functionality

#### Element Data Structure:
Each element returned by the API includes:
```javascript
{
    name: "Fire",              // Element name as displayed
    domElement: HTMLElement,   // Direct DOM reference
    position: {                // Calculated bounds
        x: 100, y: 200,
        width: 80, height: 40,
        centerX: 140, centerY: 220
    },
    isNew: false              // Whether element has 'new' class
}
```

### LogManager API

The script includes a robust logging system with the `LogManager` class for comprehensive log management:

#### Core Features:
- **Log Storage**: Efficient in-memory log storage with automatic rotation
- **Event System**: Subscribe to log events for real-time updates
- **Log Filtering**: Filter logs by level (error, warn, info, log, debug)
- **Memory Management**: Automatic log rotation to prevent memory leaks
- **Statistics**: Get detailed statistics about log distribution
- **Testing Suite**: Built-in tests for all logging functionality
- **Recursive Prevention**: Uses originalConsole methods to prevent infinite logging loops

#### Key Methods:
- `addLog(level, message, args)` - Add new log entry with level and optional arguments
- `getLogs()` - Get copy of all current logs (newest first)
- `getLogCount()` - Get total number of stored logs
- `getLogsByLevel(level)` - Filter logs by specific level
- `clearLogs()` - Clear all logs and notify listeners
- `subscribe(callback)` - Subscribe to log events (returns unsubscribe function)
- `getLogStats()` - Get statistics showing total and count by level
- `runLogManagerTests()` - Comprehensive test suite for all functionality

#### LogEntry Data Structure:
Each log entry includes:
```javascript
{
    id: "unique-id",           // Unique identifier for the log entry
    timestamp: Date,           // When the log was created
    level: "info",             // Log level (error, warn, info, log, debug)
    message: "Log message",    // The main log message
    args: [],                  // Additional arguments passed to the log
    source: "userscript"       // Source of the log entry
}
```

#### Event System:
```javascript
// Subscribe to log events
const unsubscribe = logManager.subscribe((event, data) => {
    switch(event) {
        case 'logAdded':
            console.log('New log:', data.toString());
            break;
        case 'logsCleared':
            console.log('Cleared', data.clearedCount, 'logs');
            break;
    }
});

// Unsubscribe when done
unsubscribe();
```

### Version Management

The script now includes intelligent version management that automatically handles development vs production versions:

#### Automatic Version Detection
The system uses dual detection methods for maximum reliability:

1. **Version Format Analysis**: Versions containing `-`, `dev`, or `test` (e.g., `1.0.1-feature-name`)
2. **URL Source Detection**: Scripts loaded from feature branch URLs (`/feature/`, `/fix/`, `/refactor/`)

**Development versions**: Triggered by either detection method
**Production versions**: Clean semantic versions loaded from main branch (e.g., `1.0.2`)

#### Visual Indicators
- **Development versions**: Display full version with orange "DEV" tag and highlighted styling
- **Production versions**: Clean "v1.0.2" format without special styling

#### Branch-Based Detection Benefits
- **Automatic**: No manual version editing required when switching branches
- **Reliable**: Works even if version format doesn't include dev indicators
- **Consistent**: Feature branches always show as development versions
- **Safe**: Prevents accidental production releases from feature branches

#### Updating Versions
1. Update the `version` constant in the `getVersionInfo()` function
2. The display and styling will automatically adapt based on the version format
3. Tampermonkey will automatically notify users of updates

#### Version Format Examples
```javascript
// Development versions (shows DEV tag)
const version = '1.0.1-auto-play';
const version = '1.0.2-dev';
const version = '1.1.0-test-feature';

// Production versions (clean display)
const version = '1.0.2';
const version = '1.1.0';
```

## Browser Compatibility

- ✅ Chrome (with Tampermonkey)
- ✅ Firefox (with Tampermonkey/Greasemonkey)
- ✅ Safari (with Tampermonkey)
- ✅ Edge (with Tampermonkey)

## Contributing

### Quick Start with Branch Helper

1. Fork this repository
2. Use the branch helper to set up your feature:
   ```bash
   node .kiro/scripts/branch-helper.js setup-feature amazing-feature
   ```
3. Install the generated feature branch URL in Tampermonkey for testing
4. Make your changes and test on neal.fun/infinite-craft
5. Push additional changes to your feature branch
6. When ready, prepare for release:
   ```bash
   node .kiro/scripts/branch-helper.js prepare-release
   git add .
   git commit -m "Prepare amazing feature for release"
   ```
7. Open a Pull Request

### Manual Process (Alternative)

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Manually update userscript URLs to point to your feature branch
4. Make your changes
5. Test the script on neal.fun/infinite-craft
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Issues and Support

- **Bug Reports**: [Create an issue](https://github.com/bytecodeguru/infinite-crafter/issues)
- **Feature Requests**: [Create an issue](https://github.com/bytecodeguru/infinite-crafter/issues)
- **Questions**: [Discussions](https://github.com/bytecodeguru/infinite-crafter/discussions)

## License

This project is open source and available under the [MIT License](LICENSE).

## Changelog

### v1.0.4-dev (Development)
- **CURRENT DEVELOPMENT BRANCH**: `feature/control-panel-logging`
- **NEW**: Complete console log display system integrated into control panel
- **NEW**: Real-time console message capture with LogCapture class
- **NEW**: Interactive logs section with collapse/expand functionality
- **NEW**: Copy logs to clipboard with formatted timestamps and levels
- **NEW**: Clear logs functionality with immediate UI updates
- **NEW**: Visual log level indicators with color-coded styling and icons
- **NEW**: Auto-scrolling to newest log entries with smooth animations
- **NEW**: LogDisplay class for comprehensive UI management
- **NEW**: Console interception system that preserves original console functionality
- **NEW**: Recursive logging prevention for system stability using originalConsole methods
- **NEW**: Advanced LogManager class with comprehensive log storage and rotation
- **NEW**: LogEntry data structure with timestamps, levels, and unique IDs
- **NEW**: Event-driven logging system with subscribe/unsubscribe functionality
- **NEW**: Automatic log rotation to prevent memory leaks (configurable max logs)
- **NEW**: Log filtering by level (error, warn, info, log, debug)
- **NEW**: Log statistics and analytics with getLogStats() method
- **NEW**: Global `window.logManager` API for manual testing and development
- **NEW**: Comprehensive LogManager test suite with automated validation
- **NEW**: Memory management with automatic cleanup and rotation
- **ENHANCED**: Enhanced version detection system that analyzes script source URL
- **ENHANCED**: Automatic development mode detection for feature branch installations
- **ENHANCED**: Smart version management with both version format and URL-based detection
- **ENHANCED**: Visual version indicators - "DEV" tag and orange styling for development versions
- **ENHANCED**: Dynamic version display formatting based on version type
- **ENHANCED**: Complete GameInterface class foundation for game interaction
- **ENHANCED**: Comprehensive DOM query methods for sidebar and play area elements
- **ENHANCED**: Element detection, counting, and validation utilities
- **ENHANCED**: Game state monitoring (ready/loading detection)
- **ENHANCED**: Element positioning and bounds calculation
- **ENHANCED**: Debug console with detailed logging and testing tools
- **ENHANCED**: Global `window.gameInterface` API for manual testing and development
- **ENHANCED**: GameInterface basic tests disabled by default to prevent excessive logging
- **ENHANCED**: Improved element tracking with name, position, and state data
- **ENHANCED**: Better error handling and logging throughout with recursive prevention
- **ENHANCED**: Control panel UI extended with logs section and responsive design
- **ENHANCED**: Code formatting improvements and consistent spacing throughout

### v1.0.1 (Production)
- Added GitHub integration for automatic updates
- Added support and homepage URLs
- Improved installation process
- **NEW**: Branch helper utility for streamlined development workflow
- **NEW**: Automated branch management with URL switching and version control
- Basic GameInterface foundation

### v1.0.0
- Initial release
- Basic draggable control panel
- Modern UI with semi-transparent design
- Foundation for future enhancements

---

**Note**: This userscript is not affiliated with neal.fun or the original Infinite Craft game. It's a community-created enhancement tool.
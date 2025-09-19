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
- **Console Log Display**: Built-in log display system within the control panel
- **Log Management**: Automatic log rotation, filtering by level, and memory management
- **Interactive Log Controls**: Collapse/expand, copy to clipboard, and clear logs functionality
- **Persistent Collapse State**: Logs section remembers its collapsed/expanded state across sessions
- **Activity Indicator**: Shows "(X new)" indicator when collapsed and new logs arrive
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
│ Logs                            ▼ Copy Clear │
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

**Option A: Pre-built Userscript (Recommended)**
1. Open your userscript manager dashboard
2. Click **Create a new script** or **Add new script**
3. Copy the contents of [`infinite-craft-helper.user.js`](infinite-craft-helper.user.js)
4. Paste it into the script editor
5. Save the script (usually Ctrl+S or Cmd+S)
6. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/) to see the control panel

**Option B: Build from Source**
1. Clone this repository: `git clone https://github.com/bytecodeguru/infinite-crafter.git`
2. Install dependencies: `npm install`
3. Build the userscript: `npm run build`
4. Install the generated file from `dist/infinite-craft-helper.user.js`

## Usage

1. Navigate to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/)
2. The control panel will automatically appear in the top-left corner
3. **Drag the panel**: Click and drag the header to move it around the screen
4. **View Logs**: Log messages added through the Logger API appear in the logs section with timestamps and color-coded levels
5. **Manage Logs**: Use the collapse/expand button (▼), copy logs to clipboard, or clear all logs
   - The logs section remembers your collapsed/expanded preference
   - When collapsed, an activity indicator shows "(X new)" for new log entries
6. **Debug Console**: Open browser developer tools (F12) to see detailed game analysis
7. **GameInterface API**: Access `window.gameInterface` in console for manual testing

### Developer Console Commands

Once the script loads, you can interact with the game interface and logging system through the console. The logging system provides APIs for adding log entries that appear in the control panel:

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

#### Logger API (Primary Logging Interface)
```javascript
// Simple logging functions for userscript use - these appear in the control panel
Logger.log('Information message')     // Add info-level log entry
Logger.warn('Warning message')        // Add warning-level log entry  
Logger.error('Error message')         // Add error-level log entry

// Logger is initialized during script startup and connected to LogManager
// Available globally as window.Logger for console testing
// All log entries added through Logger appear in the control panel logs section
// Before initialization, calls are logged to console with "Not initialized yet" prefix
```



#### LogDisplay API
```javascript
// Access the log display system (available as window.logDisplay)
logDisplay.toggleCollapse()           // Toggle logs section collapse/expand
logDisplay.copyLogsToClipboard()      // Copy all logs to clipboard
logDisplay.clearLogs()                // Clear all log entries
logDisplay.updateDisplay()            // Refresh the log display
logDisplay.runLogDisplayTests()       // Run comprehensive display tests

// Check display state
logDisplay.isCollapsed                // Boolean: is logs section collapsed
logDisplay.newLogsSinceCollapse       // Number: new logs since last collapse
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
- **Persistent State**: Remembers collapsed/expanded preference across browser sessions
- **Activity Indicator**: Shows "(X new)" when collapsed and new logs arrive
- **Copy to Clipboard**: Copy all logs in readable format with timestamps
- **Clear Logs**: Remove all current log entries
- **Auto-scroll**: Automatically shows newest log entries with smooth scrolling behavior and optimized display height
- **Log Count**: Shows number of logs when collapsed

**Manual Logging System:**
- **Direct Logging**: Use Logger.log(), Logger.warn(), Logger.error() to add entries to the log display
- **Clean Interface**: No automatic console interception - logs are added explicitly through the Logger API
- **Original Console Preserved**: All console functionality remains completely untouched

**Log Format:**
Each log entry displays:
- **Timestamp**: Precise time when the log was created (HH:MM:SS format)
- **Level Icon**: Visual indicator for the log level
- **Message**: The actual log content with proper formatting

**DOM Structure:**
The logging system creates the following DOM structure for developers:
```html
<div class="logs-section">
  <div class="logs-header">
    <h4>Console Logs</h4>
    <div class="logs-controls">
      <button class="logs-toggle">▼</button>
      <button class="logs-copy">Copy</button>
      <button class="logs-clear">Clear</button>
    </div>
  </div>
  <div class="logs-content">
    <div class="logs-list" id="logs-list">
      <div class="log-entry [level]">
        <span class="log-timestamp">[HH:MM:SS]</span>
        <span class="log-level">[icon]</span>
        <span class="log-message">[message]</span>
      </div>
    </div>
  </div>
</div>
```

## Development

### Multi-File Build System

The project includes a comprehensive build system that transforms modular ES6 source files into a single userscript while maintaining all functionality. This enables better code organization and maintainability.

#### Build System Features

- **Modular Development**: Split large userscript into focused, maintainable modules
- **ES6 Module Support**: Full import/export parsing with dependency resolution
- **Dependency Management**: Automatic dependency graph creation and topological sorting
- **Circular Dependency Detection**: Prevents build issues with clear error reporting
- **Import/Export Validation**: Ensures all imports resolve to existing exports
- **File Size Policy**: Enforced limits (250 lines per file, 50 lines per function)
- **Branch-Aware URLs**: Automatic URL generation based on Git branch
- **Watch Mode**: Automatic rebuilds on file changes during development
- **Build Validation**: Syntax checking and policy enforcement
- **Comprehensive Logging**: Configurable logging with timestamps and colors

#### Implementation Status

**✅ Completed Components:**
- ModuleResolver class with full ES6 import/export parsing
- Dependency graph creation and circular dependency detection
- BuildManager class with build orchestration framework
- Comprehensive error handling and logging system
- File system utilities and path resolution

**🚧 In Development:**
- File concatenation and userscript generation
- Branch-aware URL template system
- File size policy enforcement
- Watch mode for automatic rebuilds

**📋 Planned Features:**
- Source file structure creation
- npm script integration
- Comprehensive test suite
- Documentation and migration guides

#### Quick Start (When Complete)

```bash
# Install build dependencies
npm install

# Build the userscript from source files
npm run build

# Start watch mode for development
npm run build:watch

# Clean build artifacts
npm run clean
```

#### Build Configuration

The build system is configured via `build.config.js`:

```javascript
export default {
    // Source and output directories
    srcDir: './src',
    outputDir: './dist',
    outputFile: 'infinite-craft-helper.user.js',
    
    // File size policy enforcement
    maxFileLines: 250,
    maxFunctionLines: 50,
    recommendedFileLines: 200,
    recommendedFunctionLines: 30,
    
    // Watch mode for development
    watch: {
        enabled: false,
        debounce: 300,
        ignored: ['node_modules/**', 'dist/**', '.git/**']
    },
    
    // Branch-aware URL generation
    branch: {
        auto: true,
        urlTemplate: 'https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/{{BRANCH}}/infinite-craft-helper.user.js'
    },
    
    // Build options
    build: {
        minify: false,
        sourceMaps: false,
        validateSyntax: true,
        enforcePolicy: true
    },
    
    // Logging configuration
    logging: {
        level: 'info', // 'debug', 'info', 'warn', 'error'
        timestamps: true,
        colors: true
    }
};
```

#### Source File Organization

When using the build system, source files are organized in a modular structure:

```
src/
├── header.js                 # Userscript metadata and configuration
├── core/
│   ├── version.js           # Version management utilities
│   ├── logger.js            # LogManager and Logger API
│   └── game-interface.js    # Game interaction utilities
├── ui/
│   ├── control-panel.js     # Main control panel creation
│   ├── styles.js            # CSS styles injection
│   └── draggable.js         # Drag functionality
├── utils/
│   └── dom.js               # DOM utilities and helpers
└── main.js                  # Entry point and initialization
```

#### Build Process

The build system:
1. **Scans source directory** recursively for all JavaScript files
2. **Parses ES6 modules** using regex patterns for import/export statements
3. **Resolves dependencies** by matching import paths to actual files
4. **Validates imports** ensuring all imported names exist in target modules
5. **Detects circular dependencies** using depth-first search algorithm
6. **Calculates execution order** via topological sort of dependency graph
7. **Validates file sizes** against policy limits (warns if exceeded)
8. **Concatenates files** while preserving JavaScript scope
9. **Injects metadata** with branch-specific URLs and versions
10. **Generates userscript** that matches original functionality

#### Development Workflow

```bash
# Start a new feature with build system
git checkout -b feature/my-feature

# Set up watch mode for automatic rebuilds
npm run build:watch

# Edit source files in src/ directory
# Build system automatically rebuilds on changes

# Test the generated userscript
# Install from: dist/infinite-craft-helper.user.js

# When ready for production
npm run build
git add .
git commit -m "Complete my-feature implementation"
```

#### File Size Policy

The build system enforces code organization best practices:

- **Maximum file size**: 250 lines per source file
- **Recommended size**: 150-200 lines per file  
- **Function limits**: Maximum 50 lines per function, 30 lines recommended
- **Single responsibility**: Each file should have one clear purpose
- **Build-time validation**: Warnings for files exceeding limits
- **Automated suggestions**: Guidance for splitting large files

#### Branch Integration

The build system automatically:
- **Detects Git branch** and updates URLs accordingly
- **Generates development versions** for feature branches (e.g., `1.0.4-feature-name`)
- **Creates production versions** for main branch (e.g., `1.0.4`)
- **Updates userscript metadata** with correct updateURL and downloadURL

#### Error Handling

Comprehensive error reporting includes:
- **Import resolution errors** with specific file and import path details
- **Export validation errors** showing missing exports in target modules
- **Circular dependency detection** with complete dependency cycle paths
- **File system error handling** for missing files and permissions
- **Module parsing errors** with file location and error context
- **Build context information** with timestamps and detailed logging

### Testing

#### Build System Testing

The ModuleResolver can be tested independently:

```bash
# Run unit tests for ModuleResolver
npm test -- test/unit/module-resolver.test.js

# Test module resolution manually in Node.js
node -e "
import { ModuleResolver } from './build/ModuleResolver.js';
const resolver = new ModuleResolver('./src', { 
  log: (level, msg) => console.log(\`[\${level}] \${msg}\`)
});
// Test with sample source files when available
"
```

#### Application Testing

The project includes comprehensive testing infrastructure to ensure reliability and functionality:

#### Test Runner Script
Use the convenient test runner for all testing needs:

```bash
# First-time setup
node tests/run-tests.js install

# Run all tests
node tests/run-tests.js all

# Run specific test suites
node tests/run-tests.js userscript    # Core userscript functionality
node tests/run-tests.js logging      # Logging system tests
node tests/run-tests.js integration  # Integration tests

# Run tests with visible browser (for debugging)
node tests/run-tests.js headed

# Debug tests step by step
node tests/run-tests.js debug

# View test report
node tests/run-tests.js report
```

#### Playwright Testing
The project uses Playwright for automated browser testing with configuration in `playwright.config.js`. The test suite includes comprehensive userscript functionality tests with simplified code injection:

```bash
# Install Playwright (if not already installed)
npm install -D @playwright/test

# Run tests across all browsers
npx playwright test

# Run tests in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

**Test Infrastructure**: The Playwright tests use a simplified userscript injection approach that directly executes the script code without complex parsing, making the test suite more reliable and maintainable. The tests validate core functionality including:
- Control panel creation and visibility
- Version display accuracy
- Drag and drop functionality
- CSS styling and positioning
- Cross-browser compatibility

**Test Configuration:**
- **Chromium testing**: Optimized for fast, reliable testing on Chromium engine
- **Parallel execution**: Tests run in parallel for faster feedback
- **CI/CD ready**: Configured for continuous integration environments
- **HTML reporting**: Detailed test reports with screenshots and traces
- **Retry logic**: Automatic retries on CI for flaky test handling

**Current Test Status:**
- **Playwright Tests**: Fully aligned with current implementation and ready for use
- **HTML Tests**: Manual testing files for specific functionality
- **Built-in Tests**: Comprehensive test suites built into LogManager and LogDisplay classes
- **Manual Testing**: Primary testing method using browser console and live userscript



#### Running Tests
```bash
# Run all Playwright tests
npm test

# Run specific test file
npx playwright test tests/playwright/logging.spec.js

# Debug tests interactively
npx playwright test --debug

# Run tests in headed mode (visible browser)
npx playwright test --headed
```

### Project Structure

```
infinite-crafter/
├── .kiro/
│   ├── specs/
│   │   └── multi-file-build-system/  # Build system specification
│   └── scripts/
│       └── branch-helper.js          # Branch management utility
├── build/
│   ├── BuildManager.js               # Core build orchestration
│   ├── ModuleResolver.js             # ES6 module parsing and dependency resolution
│   └── build.js                      # Build script entry point
├── src/                              # Source files (when using build system)
│   ├── header.js                     # Userscript metadata template
│   ├── core/                         # Core functionality modules
│   ├── ui/                           # User interface components
│   ├── utils/                        # Utility functions
│   └── main.js                       # Application entry point
├── dist/                             # Built userscript output
│   └── infinite-craft-helper.user.js # Generated userscript
├── tests/                            # Test files directory
│   ├── playwright/                   # Playwright automated tests
│   │   ├── userscript.spec.js        # Core userscript functionality tests
│   │   ├── logging.spec.js           # Logging system test suite
│   │   └── integration.spec.js       # Integration tests
│   └── run-tests.js                  # Test runner script
├── build.config.js                   # Build system configuration
├── infinite-craft-helper.user.js     # Legacy single-file userscript
├── playwright.config.js              # Playwright test configuration
├── package.json                      # Project dependencies and scripts
└── README.md                         # This file
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

#### ModuleResolver API

The build system includes a sophisticated ModuleResolver class that handles ES6 module parsing and dependency resolution:

**Core Methods:**
- `resolveModules()` - Main resolution method returning modules in execution order
- `findJavaScriptFiles(dir)` - Recursively scans directory for .js files
- `parseModule(filePath)` - Parses individual module for imports/exports
- `validateImports()` - Ensures all imports resolve to existing exports
- `detectCircularDependencies()` - Finds circular dependency cycles
- `calculateExecutionOrder()` - Topological sort for proper module ordering

**Import/Export Support:**
- Named imports: `import { name } from 'module'`
- Default imports: `import name from 'module'`
- Namespace imports: `import * as name from 'module'`
- Side-effect imports: `import 'module'`
- Named exports: `export function name() {}`
- Default exports: `export default value`
- Re-exports: `export { name } from 'module'`

**Path Resolution:**
- Relative imports: `./file.js`, `../dir/file.js`
- Absolute imports: `/core/module.js` (from src root)
- Automatic .js extension handling
- External module skipping (node_modules, etc.)

**Error Detection:**
- Missing import files with clear error messages
- Undefined exports in target modules
- Circular dependency cycles with full path traces
- File system access errors with context

### Development Approaches

The project supports two development approaches:

#### Single-File Development (Legacy)
- **File**: `infinite-craft-helper.user.js`
- **Best for**: Small changes, quick fixes, simple features
- **Pros**: Direct editing, immediate testing, no build step required
- **Cons**: Large file size (1179+ lines), harder to maintain, no module organization

#### Multi-File Development (Recommended)
- **Directory**: `src/` with modular structure
- **Best for**: New features, major refactoring, collaborative development
- **Pros**: Better organization, enforced file size limits, ES6 modules, automated builds
- **Cons**: Requires build step, additional tooling setup

**Current Status**: The build system foundation is complete with ModuleResolver and BuildManager classes implemented. Module parsing, dependency resolution, and circular dependency detection are fully functional. File concatenation and userscript generation are in development.

**Migration Path**: The build system is designed to eventually replace the single-file approach. New features should preferably use the multi-file structure once file concatenation is complete.

### Adding New Features

The control panel is designed to be easily extensible.

#### Single-File Approach
To add new controls to the existing userscript:

1. Modify the `panel-content` section in the `createControlPanel()` function
2. Add corresponding event listeners and functionality
3. Update the version in the `getVersionInfo()` function (the display will automatically adapt)
4. Commit and push changes for automatic distribution

#### Multi-File Approach
To add new features using the build system:

1. **Create focused modules** in the appropriate `src/` subdirectory:
   - `src/core/` - Core functionality and APIs
   - `src/ui/` - User interface components
   - `src/utils/` - Utility functions and helpers

2. **Follow file size policy**:
   - Maximum 250 lines per file (recommended 150-200)
   - Maximum 50 lines per function (recommended 30)
   - Single responsibility per module

3. **Use ES6 imports/exports**:
   ```javascript
   // src/ui/my-feature.js
   import { Logger } from '../core/logger.js';
   
   export function createMyFeature() {
       Logger.log('Creating my feature...');
       // Feature implementation
   }
   ```

4. **Build and test**:
   ```bash
   npm run build:watch  # Auto-rebuild on changes
   # Test the generated dist/infinite-craft-helper.user.js
   ```

5. **Update version** in `package.json` and commit changes

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

**Testing Coverage:**
- Automated testing using Playwright on Chromium engine
- Userscript compatibility validated across all major browsers with userscript managers
- Continuous integration testing for reliability assurance

## Contributing

### Quick Start with Branch Helper

1. Fork this repository
2. Use the branch helper to set up your feature:
   ```bash
   node .kiro/scripts/branch-helper.js setup-feature amazing-feature
   ```
3. Install the generated feature branch URL in Tampermonkey for testing
4. **For multi-file development**: Set up watch mode for automatic builds:
   ```bash
   npm install
   npm run build:watch
   ```
5. Make your changes (either in single file or modular src/ structure)
6. Test on neal.fun/infinite-craft (build system auto-rebuilds on changes)
7. Push additional changes to your feature branch
8. When ready, prepare for release:
   ```bash
   node .kiro/scripts/branch-helper.js prepare-release
   npm run build  # Ensure final build is clean
   git add .
   git commit -m "Prepare amazing feature for release"
   ```
9. Open a Pull Request

### Manual Process (Alternative)

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Manually update userscript URLs to point to your feature branch
4. Make your changes
5. Test the script on neal.fun/infinite-craft
6. Run automated tests: `npx playwright test`
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Issues and Support

- **Bug Reports**: [Create an issue](https://github.com/bytecodeguru/infinite-crafter/issues)
- **Feature Requests**: [Create an issue](https://github.com/bytecodeguru/infinite-crafter/issues)
- **Questions**: [Discussions](https://github.com/bytecodeguru/infinite-crafter/discussions)

## License

This project is open source and available under the [MIT License](LICENSE).

## Changelog

### v1.0.4-dev (Development)
- **CURRENT DEVELOPMENT BRANCH**: `feature/game-interface-foundation`
- **NEW**: Multi-file build system with ES6 module support for better code organization
- **NEW**: BuildManager class for orchestrating build process with file watching and incremental builds
- **NEW**: Comprehensive build configuration system (`build.config.js`) with file size policy enforcement
- **NEW**: Branch-aware URL generation that automatically updates userscript metadata based on Git branch
- **NEW**: Watch mode for automatic rebuilds during development (`npm run build:watch`)
- **NEW**: File size validation with configurable limits (250 lines per file, 50 lines per function)
- **NEW**: Build system logging with configurable levels, timestamps, and colors
- **NEW**: Clean build artifacts functionality (`npm run clean`)
- **NEW**: Source file organization structure (src/core/, src/ui/, src/utils/)
- **NEW**: ES6 import/export dependency resolution and module concatenation
- **NEW**: Build-time syntax validation and error reporting with file location information
- **NEW**: Development workflow integration with npm scripts and automated tooling
- **NEW**: Playwright testing infrastructure with cross-browser automation
- **UPDATED**: Playwright tests aligned with current implementation (version selector and format validation)
- **NEW**: Comprehensive test suite with HTML test files for manual and automated testing
- **NEW**: CI/CD ready test configuration with parallel execution and retry logic
- **NEW**: HTML test reporting with screenshots and traces for debugging
- **NEW**: Playwright logging system tests (`tests/playwright/logging.spec.js`) for automated validation
- **NEW**: Complete console log display system integrated into control panel
- **REMOVED**: LogCapture class - console interception functionality removed to simplify logging system
- **NEW**: Interactive logs section with collapse/expand functionality
- **NEW**: Copy logs to clipboard with formatted timestamps and levels
- **NEW**: Clear logs functionality with immediate UI updates
- **NEW**: Visual log level indicators with color-coded styling and icons
- **NEW**: Auto-scrolling to newest log entries with smooth animations and optimized height management
- **NEW**: LogDisplay class for comprehensive UI management
- **NEW**: Persistent collapse state using localStorage to remember user preferences
- **NEW**: Activity indicator showing "(X new)" when logs section is collapsed and new logs arrive
- **NEW**: Enhanced state management with automatic activity tracking
- **SIMPLIFIED**: Removed console interception system - logging now uses direct Logger API calls only
- **NEW**: Advanced LogManager class with comprehensive log storage and rotation
- **NEW**: LogEntry data structure with timestamps, levels, and unique IDs
- **NEW**: Event-driven logging system with subscribe/unsubscribe functionality
- **NEW**: Automatic log rotation to prevent memory leaks (configurable max logs)
- **NEW**: Log filtering by level (error, warn, info, log, debug)
- **NEW**: Log statistics and analytics with getLogStats() method
- **NEW**: Global `window.logManager` API for manual testing and development
- **NEW**: Comprehensive LogManager test suite with automated validation
- **NEW**: Memory management with automatic cleanup and rotation
- **NEW**: Logger API with simple log(), warn(), and error() functions for userscript logging
- **NEW**: Proper Logger initialization pattern that connects to LogManager during script startup
- **SIMPLIFIED**: Streamlined initialization sequence without console capture complexity
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
- **ENHANCED**: Improved logs section scrolling with optimized height (150px max), smooth scroll behavior, and hidden horizontal overflow
- **ENHANCED**: Polished button interactions with hover effects, active states, and proper disabled button styling
- **ENHANCED**: Smooth CSS transitions and micro-interactions for better user experience
- **ENHANCED**: Consistent font family and styling across all logs section controls

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
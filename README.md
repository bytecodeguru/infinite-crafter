# Infinite Craft Helper

A Tampermonkey userscript that adds a draggable control panel overlay to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/), providing enhanced functionality and tools for the game.

## Features

- **Draggable Control Panel**: Moveable overlay positioned in the top-left corner
- **Modern UI Design**: Semi-transparent background with blur effects and gradient styling
- **Version Display**: Shows current script version in the panel header
- **Game Interface Detection**: Automatically detects and analyzes game elements and state
- **Element Tracking**: Monitors available elements in sidebar and play area
- **Debug Console**: Comprehensive logging and testing tools for development
- **Extensible Framework**: Ready for additional control features and enhancements
- **Automatic Updates**: Seamless updates via GitHub integration

## Screenshots

The control panel appears as a sleek overlay that you can drag around the screen:

```
┌─────────────────────────────┐
│ Infinite Craft Helper v1.0.1│
├─────────────────────────────┤
│ Control panel ready!        │
│                             │
│ <!-- Future controls here -->│
└─────────────────────────────┘
```

## Installation

### Prerequisites

You need a userscript manager installed in your browser. We recommend:
- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

### Method 1: Direct Install from GitHub (Recommended)

1. **Click this link**: [Install Infinite Craft Helper](https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/main/infinite-craft-helper.user.js)
2. Your userscript manager will automatically detect the script and show an installation dialog
3. Click **Install** to add the script
4. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/) to see the control panel

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
4. **Debug Console**: Open browser developer tools (F12) to see detailed game analysis
5. **GameInterface API**: Access `window.gameInterface` in console for manual testing

### Developer Console Commands

Once the script loads, you can interact with the game interface through the console:

```javascript
// Get current game state
gameInterface.logGameState()

// Count elements
gameInterface.getElementCount()

// Find specific elements
gameInterface.findElementByName("Fire")

// Get all available elements
gameInterface.getAvailableElements()

// Run comprehensive tests
gameInterface.runBasicTests()
```

## Development

### Project Structure

```
infinite-crafter/
├── .kiro/
│   └── scripts/
│       └── branch-helper.js       # Branch management utility
├── infinite-craft-helper.user.js  # Main userscript file
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

**Preparing for production release:**
```bash
node .kiro/scripts/branch-helper.js prepare-release
```

This command will:
1. Update userscript URLs back to the main branch
2. Increment the version number for production
3. Prepare files for final commit and merge

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

### Adding New Features

The control panel is designed to be easily extensible. To add new controls:

1. Modify the `panel-content` section in the `createControlPanel()` function
2. Add corresponding event listeners and functionality
3. Update the version number in the userscript header
4. Commit and push changes for automatic distribution

### GameInterface API

The script includes a comprehensive `GameInterface` class that provides:

- **Element Detection**: Find and analyze game elements
- **DOM Queries**: Reliable selectors for sidebar and play area
- **Game State Monitoring**: Check if game is ready or loading
- **Element Validation**: Verify draggable elements and positions
- **Debug Tools**: Comprehensive logging and testing methods

Key methods:
- `getAvailableElements()` - Get all elements in sidebar
- `getPlayAreaElements()` - Get all elements in play area
- `findElementByName(name)` - Find specific element by name
- `isGameReady()` - Check if game is fully loaded
- `runBasicTests()` - Run comprehensive functionality tests

### Version Management

- Update the `@version` field in the userscript header
- Update version displays in the code
- Tampermonkey will automatically notify users of updates

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

### v1.0.1
- Added GitHub integration for automatic updates
- Added support and homepage URLs
- Improved installation process
- **NEW**: GameInterface class for game state detection and element analysis
- **NEW**: Comprehensive DOM query methods for sidebar and play area
- **NEW**: Element counting, validation, and positioning utilities
- **NEW**: Debug console with detailed logging and testing tools
- **NEW**: Global `window.gameInterface` API for manual testing
- **NEW**: Branch helper utility for streamlined development workflow
- **NEW**: Automated branch management with URL switching and version control
- Foundation laid for auto-play engine development

### v1.0.0
- Initial release
- Basic draggable control panel
- Modern UI with semi-transparent design
- Foundation for future enhancements

---

**Note**: This userscript is not affiliated with neal.fun or the original Infinite Craft game. It's a community-created enhancement tool.
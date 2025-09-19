# Infinite Craft Helper

A Tampermonkey userscript that adds a draggable control panel overlay to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/), providing enhanced functionality and tools for the game.

## Features

- **Draggable Control Panel**: Moveable overlay positioned in the top-left corner
- **Modern UI Design**: Semi-transparent background with blur effects and gradient styling
- **Version Display**: Shows current script version in the panel header
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
4. The panel is ready for future enhancements and controls

## Development

### Project Structure

```
infinite-crafter/
├── infinite-craft-helper.user.js  # Main userscript file
└── README.md                      # This file
```

### Adding New Features

The control panel is designed to be easily extensible. To add new controls:

1. Modify the `panel-content` section in the `createControlPanel()` function
2. Add corresponding event listeners and functionality
3. Update the version number in the userscript header
4. Commit and push changes for automatic distribution

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

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test the script on neal.fun/infinite-craft
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

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

### v1.0.0
- Initial release
- Basic draggable control panel
- Modern UI with semi-transparent design
- Foundation for future enhancements

---

**Note**: This userscript is not affiliated with neal.fun or the original Infinite Craft game. It's a community-created enhancement tool.
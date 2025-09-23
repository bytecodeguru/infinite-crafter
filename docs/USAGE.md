# Usage Guide

## Getting Started
1. Install the userscript via Tampermonkey (see README installation section).
2. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/); the control panel appears in the top-left corner.
3. Drag the panel by its header, collapse/expand logs, copy entries, and clear history as needed.

## Developer Console Helpers
Once the script is loaded you can call these helpers from the browser console:

```javascript
// Inspect game state
window.gameInterface.logGameState();

// Count elements
window.gameInterface.getElementCount();

// Find an element
window.gameInterface.findElementByName('Fire');

// Run quick diagnostics
window.gameInterface.runBasicTests();

// View sidebar summary with validation data
window.gameInterface.logSidebarSummary();

// Pull a specific element
window.gameInterface.findElementByName('Fire');

// List draggable elements ready for automation
window.gameInterface.getDraggableElements();

// Simulate a click on a sidebar element (no delay)
await window.actionSimulator.clickElement(
  window.gameInterface.findElementByName('Water')?.element,
  { delay: { min: 0, max: 0 } }
);

// Access the logging API
window.Logger.log('Hello from the console');
```

The `LogManager` APIs (`logManager.addLog`, `logManager.getLogs`, etc.) are also attached to `window` for debugging.

GameInterface diagnostics now run automatically on page load; check the control panel logs or inspect `window.__infiniteCraftHelperDiagnostics` to see the latest results/attempts.

## Troubleshooting
- **Panel missing** – ensure the userscript is active and the page reloaded.
- **Logs warning about size policy** – see `docs/DEVELOPMENT.md` for guidance on refactoring large files or functions.
- **Build warnings** – run `npm run build` locally to reproduce and review console output.

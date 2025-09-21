# Infinite Craft Helper

Infinite Craft Helper is a Tampermonkey userscript that adds a draggable control panel overlay to [neal.fun/infinite-craft](https://neal.fun/infinite-craft/), giving quick access to logging, diagnostics, and automation hooks.

## Highlights
- Draggable, resizable control panel with collapsible log viewer
- Branch-aware version banner so you can distinguish production from feature builds
- GameInterface utilities exposed for console automation and element inspection
- Built-in logging framework with filtering, copy, and clear actions
- Automatic updates delivered from the GitHub repository

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. **Production build:** [Install from main](https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/main/dist/infinite-craft-helper.user.js)
3. **Latest features:** [Install from feature branch](https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/feature/game-interface-foundation/dist/infinite-craft-helper.user.js)
4. Visit [neal.fun/infinite-craft](https://neal.fun/infinite-craft/) and the control panel will appear automatically.

If you prefer to build locally:
```bash
git clone https://github.com/bytecodeguru/infinite-crafter.git
cd infinite-crafter
npm install
npm run build
# install dist/infinite-craft-helper.user.js with your userscript manager
```

## Usage & Development Docs
- **Usage tips and console helpers:** see [`docs/USAGE.md`](docs/USAGE.md)
- **Contributor workflow, CLI commands, size policy:** see [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
- **Roadmap and feature specs:** `.kiro/steering` and `.kiro/specs` directories

## License

MIT License. See [`LICENSE`](LICENSE) for details.

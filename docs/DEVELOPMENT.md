# Development Guide

## Repository Layout
- `src/` – modular source files (`main.js`, `header.js`, `core/`, `ui/`, `utils/`).
- `build/` – build system (`build.js`, CLI helpers, size policy, module resolver).
- `dist/` – bundled userscript output.
- `test/` – unit fixtures and Node tests (`test/unit/`).
- `tests/` – Playwright suites (`tests/playwright/`) and helpers.
- `.kiro/` – steering policies and feature specs; always update relevant tasks/design files.

## Working Loop
1. Review `.kiro/steering/*.md` and the relevant spec/task entry.
2. Capture the plan or updates in `tasks.md` before editing code.
3. Implement changes respecting size policy (300 lines/file, 50 lines/function) and lint rules (ESLint).
4. Run quality gates (`npm run lint`, `npm test`, `npm run build`) before hand-off.
5. Update specs/docs with findings and open follow-up tasks when needed.

## Build & CLI Commands
- `npm run build` / `node build/build.js` – single build.
- `npm run build:watch` / `node build/build.js watch [--skip-quality]` – debounced rebuilds; ensure `watch.enabled` is true in `build.config.js`, adjust `watch.paths` for extra directories, and only toggle `skipOnWatch` on quality gates with explicit approval.
- `npm run dev` – runs an initial build, launches the build watcher, and serves `dist/infinite-craft-helper.user.js` on `http://localhost:3000`; add `--skip-quality` to relax watch-time lint/tests when approved.
- `npm run clean` / `node build/build.js clean` – remove build artifacts.
- CLI accepts `--config <path>` for alternate configs and `--verbose/--quiet` logging levels.

## Size Policy & Warnings
- Build mode warns when files/functions exceed recommended limits; set `build.enforcePolicy: 'warn'|'strict'` in `build.config.js`.
- Strict mode surfaces `BuildError` with stage/file/line details; document intentional exceptions in specs.

## Testing
- Node tests: `npm test` (covers build system units/integration).
- Playwright suites: `node tests/run-tests.js <suite>` (`all`, `logging`, `integration`, `userscript`, etc.).
- Keep red tests only during TDD (failing test first) and resolve before commit.

## Commit & PR Etiquette
- Use Conventional Commits (`feat:`, `fix:`, etc.) with scoped summaries (`feat(ui): ...`).
- Provide build/test status, screenshots for UI changes, and spec links in PR descriptions.
- Do not introduce new dependencies or tools without prior user approval recorded in specs/tasks.

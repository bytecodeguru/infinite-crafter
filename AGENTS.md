# Repository Guidelines

## Steering & Specs Workflow
Start by reading `.kiro/steering/*.md`; they define product direction, branching policy, and tech constraints for every change. Specs in `.kiro/specs/<feature>/{requirements,design,tasks}.md` form the evolving plan—use them for active work, open tasks, and acceptance criteria before coding. Capture findings or plan updates inside those docs rather than ad-hoc notes. Align with open tasks or add a brief plan to the relevant `tasks.md` before editing code. Do not skip planning, even for quick fixes.

## Project Structure & Module Organization
Source modules sit in `src/` with ES module boundaries: `main.js` bootstraps, `header.js` holds metadata, `core/` covers logging and runtime helpers, `ui/` contains panel components, and `utils/` handles DOM helpers. Build tooling resides in `build/` (see `build/build.js` and `build.config.js`). Bundled artifacts land in `dist/`. Node-focused unit tests live in `test/unit/`; Playwright journeys live in `tests/playwright/`. Generated assets such as `playwright-report/` and `test-results/` are disposable.

## Build, Test, and Development Commands
Use `npm run build` to produce `dist/infinite-craft-helper.user.js`; `npm run build:watch` rebuilds on change and supports ongoing multi-file work. `npm run clean` removes generated files. `npm test` invokes Node’s built-in runner across `test/**/*.test.js`. Use `node tests/run-tests.js <suite>` for Playwright (`all`, `logging`, `integration`, `userscript`, `headed`, `report(-ci)`). Respect branch-aware URLs when publishing builds (see `.kiro/steering/branching.md`).

## Coding Style & Naming Conventions
Target Node 16+ and browsers supporting modern ES features. Use ES modules, four-space indentation, single quotes, camelCase identifiers, and kebab-case filenames. Classes stay PascalCase. Keep files under 300 lines and functions under 50 lines; if you exceed limits, document the exception in the relevant spec task. UI logic remains in `ui/`, shared helpers in `utils/`, and comments stay minimal and explanatory.

## Testing Guidelines
Mirror existing `*.test.js` naming and house fixtures in `test/fixtures`. Playwright suites should register descriptive `test.describe` blocks and reuse helper runners. Before shipping UI or build changes, run `npm test` plus the specific Playwright suite your change touches; record any skipped tests with a TODO in the spec tasks list.

## Commit & Pull Request Guidelines
Follow Conventional Commits (e.g., `feat(ui): add collapse animation`). Branch names should match the steering guidance (`feature/...`, `fix/...`). PRs must link relevant spec tasks, summarize changes, and attach UI screenshots when visuals shift. Confirm `npm run build`, `npm test`, and required Playwright suites complete; note any manual verification or remaining tasks in the PR description.

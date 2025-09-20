# Repository Guidelines

## Steering & Specs Workflow
Start by reading `.kiro/steering/*.md`; they define product direction, branching policy, and tech constraints for every change. Specs in `.kiro/specs/<feature>/{requirements,design,tasks}.md` are the living plan—review scope, tasks, and acceptance criteria before coding. Record discoveries inside those docs. Align with an existing task or add a concise plan to the matching `tasks.md`, noting the tests you expect to write.

## Project Structure & Module Organization
Source modules sit in `src/`: `main.js` bootstraps, `header.js` holds metadata, `core/` covers logging helpers, `ui/` contains panel components, and `utils/` houses DOM helpers. Build tooling resides in `build/` (see `build/build.js` and `build.config.js`). Bundled artifacts land in `dist/`. Node-focused unit tests live in `test/unit/`; Playwright journeys live in `tests/playwright/`. Generated assets such as `playwright-report/` and `test-results/` regenerate on demand.

## Build, Test, and Development Commands
Use `npm run build` for `dist/infinite-craft-helper.user.js`; `npm run build:watch` rebuilds on change during multi-file work. `npm run clean` removes generated files. `npm test` invokes Node’s built-in runner across `test/**/*.test.js`. Use `node tests/run-tests.js <suite>` for Playwright (`all`, `logging`, `integration`, `userscript`, `headed`, `report(-ci)`). Run the project lint command (`npm run lint` via ESLint) and resolve issues before committing; `npm run lint:format` stays available for the legacy whitespace check. Respect branch-aware URLs when publishing builds (see `.kiro/steering/branching.md`).

## Coding Style & Naming Conventions
Target Node 16+ and browsers supporting modern ES features. Use ES modules, four-space indentation, single quotes, camelCase identifiers, and kebab-case filenames. Classes stay PascalCase. Keep files under 300 lines and functions under 50 lines; if you exceed limits, document the exception in the relevant spec task. UI logic remains in `ui/`, shared helpers in `utils/`, and comments stay minimal and explanatory.

## Testing Guidelines
Mirror existing `*.test.js` naming and house fixtures in `test/fixtures`. Playwright suites should register descriptive `test.describe` blocks and reuse helper runners. Before shipping UI or build changes, run `npm test` plus the relevant Playwright suite; only leave red tests mid-TDD and fix them before committing. Record any skipped tests with a TODO in the spec tasks list.

## Commit & Pull Request Guidelines
Follow Conventional Commits (e.g., `feat(ui): add collapse animation`). Branch names should match the steering guidance (`feature/...`, `fix/...`). PRs must link relevant spec tasks, summarize changes, and attach UI screenshots when visuals shift. Confirm `npm run build`, `npm run lint`, `npm test`, and required Playwright suites complete; note any manual verification, documentation updates, or remaining follow-ups in the PR description.

# Migration Guide

This repository used to ship a single monolithic `infinite-craft-helper.user.js`. It is now split into ES module sources under `src/` with a build step. Follow these steps when migrating older changes:

1. **Find the new home** – map legacy sections to the modular layout (metadata in `src/header.js`, logging in `src/core/`, UI components in `src/ui/`, helpers in `src/utils/`).
2. **Port code** – move logic into the appropriate module and export/import as needed. Keep files under 300 lines and functions under 50 lines; the build emits `size-policy` warnings if limits are exceeded.
3. **Update imports** – replace global references with explicit ES module imports. Use relative paths from `src/` (e.g., `import { LogManager } from '../core/log-manager.js';`).
4. **Run the build** – execute `npm run build` (or `node build/build.js`) to generate `dist/infinite-craft-helper.user.js`. Check warnings and fix size-policy/lint issues.
5. **Validate behaviour** – run `npm test` for unit/integration coverage and `node tests/run-tests.js <suite>` for Playwright journeys if UI behaviour changed.
6. **Document changes** – update the relevant spec task in `.kiro/specs/.../tasks.md`, note any follow-up migration items, and link to this guide for reviewers.

If you still need the monolithic script, `git show <old-commit>:infinite-craft-helper.user.js` can retrieve historical versions, but all new work should land in the modular `src/` tree.

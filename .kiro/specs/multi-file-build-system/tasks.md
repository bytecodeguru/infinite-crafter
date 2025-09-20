# Implementation Plan

- [x] 1. Set up build system foundation
  - Create package.json with build dependencies (Node.js, file system utilities)
  - Create build.config.js with configuration options for source/output directories
  - Implement basic BuildManager class with build() method
  - _Requirements: 2.1, 2.4_

- [x] 2. Implement module resolution system
  - ✅ Create ModuleResolver class to parse ES6 import/export statements
  - ✅ Implement dependency graph creation and circular dependency detection
  - ✅ Write function to determine correct execution order for modules
  - ✅ Add comprehensive import/export validation
  - ✅ Implement path resolution for relative and absolute imports
  - ✅ Add detailed error reporting with file context
  - 🚧 Add unit tests for module resolution logic (test file exists, needs completion)
  - _Requirements: 2.2, 2.5, 4.3_

- [x] 3. Create source file structure and split existing userscript
  - ✅ Create src/ directory structure (core/, ui/, utils/, main.js)
  - ✅ Extract userscript metadata into src/header.js template
  - ✅ Split version management code into src/core/version.js
  - ✅ Move LogManager and Logger API to src/core/logger.js
  - _Requirements: 1.1, 1.3, 5.1, 5.2_

- [x] 4. Split UI components into focused modules
  - ✅ Extract control panel creation to src/ui/control-panel.js
  - ✅ Move CSS styles injection to src/ui/styles.js
  - ✅ Extract drag functionality to src/ui/draggable.js
  - ✅ Ensure each UI module is under 300 lines and has single responsibility
  - _Requirements: 1.1, 1.3, 5.2, 5.4_

- [x] 5. Create utility modules and main entry point
  - ⏭️ Extract DOM utilities to src/utils/dom.js (not needed - utilities integrated into existing modules)
  - ✅ Create src/main.js as entry point with initialization logic
  - ✅ Add ES6 import/export statements to all modules
  - ✅ Verify all modules follow file size policy (under 300 lines)
  - _Requirements: 1.1, 1.3, 5.1, 5.3_

- [x] 6. Implement file concatenation and userscript generation
  - ✅ Write function to resolve module dependencies and determine build order
  - ✅ Implement file concatenation logic that preserves JavaScript scope
  - ✅ Create userscript header injection with template variable replacement
  - ✅ Generate complete userscript file that matches original functionality
  - ✅ Add syntax validation for generated userscript
  - ✅ Implement IIFE wrapper for proper scope isolation
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 7. Add branch-aware URL generation
  - ✅ Implement Git branch detection in build system
  - ✅ Create URL template system for updateURL and downloadURL
  - ✅ Add version string modification for feature branches (add branch identifier)
  - ✅ Test URL generation for both main and feature branches
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 8. Implement file size validation and policy enforcement
  - Add file size checking during build process
  - Implement function line count validation
  - Create warning system for files exceeding size limits
  - Add build-time reporting of file sizes and policy violations
  - _Requirements: 5.5, 4.3_

- [ ] 9. Create watch mode for development
  - Implement file system watching using Node.js fs.watch or chokidar
  - Add debounced rebuild functionality on file changes
  - Create development server mode with automatic rebuild
  - Add clear console output showing build status and timing
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 10. Add comprehensive error handling
  - ✅ Introduced BuildError class carrying stage/file context and wrapped BuildManager logging
  - ✅ Promoted syntax validation and output writing to raise BuildError with stage metadata
  - ✅ Hardened ModuleResolver import/export checks with contextual failures
  - ✅ Added quality gate wrapping so lint/test failures surface actionable diagnostics
  - _Requirements: 4.3, 2.4_

- [x] 11. Create build scripts and npm integration
  - ✅ Add npm scripts for build, watch, and clean operations
  - ✅ Implement build.js CLI with commands, config overrides, and quality toggles
  - ✅ Add clean functionality to remove generated files
  - ✅ Implement verbose logging option for debugging builds
  - _Requirements: 2.1, 4.1, 4.4_

- [x] 12. Embed automated quality checks in build pipeline
  - ✅ Add linting and test commands to the build workflow so failures block distribution artifacts
  - ✅ Surface clear console output when quality gates fail and document override policy (user approval only)
  - ✅ Extend build.config.js to make lint/test commands configurable
  - ✅ Provide `npm run lint` script backed by custom lint runner
  - _Requirements: Quality Gate Policy, 4.3_

- [x] 12a. Evaluate adopting ESLint for expanded lint coverage
  - ✅ Migrated lint command to ESLint flat config with project conventions
  - ✅ Documented lint usage in README and AGENTS (plus fallback `npm run lint:format`)
  - ✅ Added design notes covering ESLint strategy and future test fixtures
  - _Follow-up from Task 12_

- [x] 13. Write comprehensive tests for build system
  - ✅ Added unit tests for BuildManager quality gates and ModuleResolver parsing/validation
  - ✅ Added integration tests that build from fixtures and assert output/errors
  - ✅ Introduced reusable fixtures under `test/fixtures/build/basic` for pipeline coverage
  - ✅ Covered error scenarios (quality gate failure, missing source, missing exports, circular imports)
  - _Requirements: 2.4, 4.3_

- [ ] 14. Validate generated userscript functionality
  - Compare generated userscript behavior with original single file
  - Test all existing features work identically (control panel, dragging, logging)
  - Verify userscript metadata is correctly generated
  - Test installation and updates work with Tampermonkey
  - _Requirements: 2.4, 3.1, 3.2_

- [ ] 15. Update development workflow and documentation
  - Update README.md with multi-file development instructions
  - Create migration guide for transitioning from single file
  - Update branch helper script to work with build system
  - Document file organization best practices and size policy
  - _Requirements: 5.1, 5.4, 5.5_
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
  - ✅ Ensure each UI module is under 250 lines and has single responsibility
  - _Requirements: 1.1, 1.3, 5.2, 5.4_

- [x] 5. Create utility modules and main entry point
  - ⏭️ Extract DOM utilities to src/utils/dom.js (not needed - utilities integrated into existing modules)
  - ✅ Create src/main.js as entry point with initialization logic
  - ✅ Add ES6 import/export statements to all modules
  - ✅ Verify all modules follow file size policy (under 250 lines)
  - _Requirements: 1.1, 1.3, 5.1, 5.3_

- [ ] 6. Implement file concatenation and userscript generation
  - Write function to resolve module dependencies and determine build order
  - Implement file concatenation logic that preserves JavaScript scope
  - Create userscript header injection with template variable replacement
  - Generate complete userscript file that matches original functionality
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 7. Add branch-aware URL generation
  - Implement Git branch detection in build system
  - Create URL template system for updateURL and downloadURL
  - Add version string modification for feature branches (add branch identifier)
  - Test URL generation for both main and feature branches
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

- [ ] 10. Add comprehensive error handling
  - Implement BuildError class with file location information
  - Add syntax validation for generated userscript
  - Create import/export validation to catch missing dependencies
  - Add error reporting with clear file and line information
  - _Requirements: 4.3, 2.4_

- [ ] 11. Create build scripts and npm integration
  - Add npm scripts for build, watch, and clean operations
  - Create build.js executable script with command-line options
  - Add clean functionality to remove generated files
  - Implement verbose logging option for debugging builds
  - _Requirements: 2.1, 4.1, 4.4_

- [ ] 12. Write comprehensive tests for build system
  - Create unit tests for BuildManager and ModuleResolver classes
  - Write integration tests for complete build process
  - Add fixture files for testing various module configurations
  - Test error scenarios (missing files, circular dependencies, syntax errors)
  - _Requirements: 2.4, 4.3_

- [ ] 13. Validate generated userscript functionality
  - Compare generated userscript behavior with original single file
  - Test all existing features work identically (control panel, dragging, logging)
  - Verify userscript metadata is correctly generated
  - Test installation and updates work with Tampermonkey
  - _Requirements: 2.4, 3.1, 3.2_

- [ ] 14. Update development workflow and documentation
  - Update README.md with multi-file development instructions
  - Create migration guide for transitioning from single file
  - Update branch helper script to work with build system
  - Document file organization best practices and size policy
  - _Requirements: 5.1, 5.4, 5.5_
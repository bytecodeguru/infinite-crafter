import js from '@eslint/js';
import globals from 'globals';

const ignores = [
    'dist/**',
    'node_modules/**',
    '.kiro/**',
    'playwright-report/**',
    'test-results/**'
];

export default [
    {
        ignores
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            indent: ['error', 4, { SwitchCase: 1 }],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'no-trailing-spaces': 'error',
            'no-tabs': 'error',
            'no-console': 'off'
        }
    },
    {
        files: ['tests/**/*.js', 'playwright.config.js'],
        languageOptions: {
            sourceType: 'script',
            globals: {
                ...globals.node,
                test: 'readonly',
                expect: 'readonly',
                page: 'readonly',
                browser: 'readonly'
            }
        },
        rules: {
            indent: ['error', 2, { SwitchCase: 1 }],
            'no-console': 'off',
            'no-redeclare': ['error', { builtinGlobals: false }]
        }
    },
    {
        files: ['build/**/*.js', 'scripts/**/*.js', 'build.config.js'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
];

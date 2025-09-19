#!/usr/bin/env node

/**
 * Test runner script for Infinite Craft Helper
 * This script provides an easy way to run different test suites
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function runCommand(cmd, cmdArgs = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${cmd} ${cmdArgs.join(' ')}`);
    const child = spawn(cmd, cmdArgs, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    switch (command) {
      case 'install':
        console.log('Installing Playwright and dependencies...');
        await runCommand('npm', ['install']);
        await runCommand('npx', ['playwright', 'install']);
        console.log('✅ Installation complete!');
        break;

      case 'all':
        console.log('Running all tests...');
        await runCommand('npx', ['playwright', 'test']);
        break;

      case 'userscript':
        console.log('Running userscript tests...');
        await runCommand('npx', ['playwright', 'test', 'userscript.spec.js']);
        break;

      case 'logging':
        console.log('Running logging tests...');
        await runCommand('npx', ['playwright', 'test', 'logging.spec.js']);
        break;

      case 'integration':
        console.log('Running integration tests...');
        await runCommand('npx', ['playwright', 'test', 'integration.spec.js']);
        break;

      case 'headed':
        console.log('Running tests in headed mode (visible browser)...');
        await runCommand('npx', ['playwright', 'test', '--headed']);
        break;

      case 'debug':
        console.log('Running tests in debug mode...');
        await runCommand('npx', ['playwright', 'test', '--debug']);
        break;

      case 'report':
        console.log('Opening test report...');
        await runCommand('npx', ['playwright', 'show-report']);
        break;

      case 'report-ci':
        console.log('Generating test report (no browser)...');
        await runCommand('npx', ['playwright', 'test', '--reporter=html']);
        console.log('Report generated at: playwright-report/index.html');
        break;

      case 'help':
      default:
        console.log(`
Infinite Craft Helper Test Runner

Usage: node tests/run-tests.js <command>

Commands:
  install     Install Playwright and dependencies
  all         Run all tests (default)
  userscript  Run userscript functionality tests
  logging     Run logging system tests
  integration Run integration tests
  headed      Run tests with visible browser
  debug       Run tests in debug mode
  report      Open HTML test report in browser
  report-ci   Generate HTML report without opening browser
  help        Show this help message

Examples:
  node tests/run-tests.js install
  node tests/run-tests.js all
  node tests/run-tests.js logging
  node tests/run-tests.js headed
  node tests/run-tests.js report-ci
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

main();
#!/usr/bin/env node

/**
 * Branch Helper Utility
 * Helps manage userscript URLs and versioning for branch-based development
 * Version Policy: 1.minor.dev
 * - Increment minor when creating a new feature branch
 * - Increment dev when pushing script changes on a feature branch
 */

const fs = require('fs');
const { execSync } = require('child_process');

const USERSCRIPT_FILE = 'infinite-craft-helper.user.js';
const GITHUB_REPO = 'bytecodeguru/infinite-crafter';

function getCurrentBranch() {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
}

function getCurrentVersion() {
    const content = fs.readFileSync(USERSCRIPT_FILE, 'utf8');
    const versionMatch = content.match(/@version\s+(.+)/);
    return versionMatch ? versionMatch[1].trim() : '1.0.0';
}

function parseVersion(version) {
    // Handle both production (1.0.0) and dev (1.0.0-feature-name) versions
    const cleanVersion = version.split('-')[0]; // Remove branch suffix if present
    const parts = cleanVersion.split('.');
    return {
        major: parseInt(parts[0]) || 1,
        minor: parseInt(parts[1]) || 0,
        dev: parseInt(parts[2]) || 0
    };
}

function createFeatureBranchVersion(baseVersion) {
    const parsed = parseVersion(baseVersion);
    // Increment minor for new feature branch, reset dev to 0
    return `${parsed.major}.${parsed.minor + 1}.0`;
}

function incrementDevVersion(currentVersion) {
    const parsed = parseVersion(currentVersion);
    // Increment dev number
    return `${parsed.major}.${parsed.minor}.${parsed.dev + 1}`;
}

function updateUserscriptUrls(branch) {
    const content = fs.readFileSync(USERSCRIPT_FILE, 'utf8');

    const updateUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${branch}/${USERSCRIPT_FILE}`;
    const downloadUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${branch}/${USERSCRIPT_FILE}`;

    const updatedContent = content
        .replace(/@updateURL\s+.*/, `// @updateURL    ${updateUrl}`)
        .replace(/@downloadURL\s+.*/, `// @downloadURL  ${downloadUrl}`);

    fs.writeFileSync(USERSCRIPT_FILE, updatedContent);
    console.log(`Updated URLs to point to branch: ${branch}`);
}

function updateVersion(version, isFeatureBranch = false) {
    // Add -dev suffix for feature branches
    const displayVersion = isFeatureBranch ? `${version}-dev` : version;
    
    const content = fs.readFileSync(USERSCRIPT_FILE, 'utf8');
    let updatedContent = content.replace(/@version\s+.*/, `// @version      ${displayVersion}`);

    // Also update the version in the getVersionInfo function
    updatedContent = updatedContent.replace(
        /const version = '[^']+';/,
        `const version = '${displayVersion}';`
    );

    fs.writeFileSync(USERSCRIPT_FILE, updatedContent);
    console.log(`Updated version to: ${displayVersion}`);
}

function isFeatureBranch(branch) {
    return branch.startsWith('feature/') || branch.startsWith('fix/') || branch.startsWith('refactor/');
}

function getMainBranchVersion() {
    try {
        // Get the version from main branch
        const mainContent = execSync(`git show main:${USERSCRIPT_FILE}`, { encoding: 'utf8' });
        const versionMatch = mainContent.match(/@version\s+(.+)/);
        return versionMatch ? versionMatch[1].trim() : '1.0.0';
    } catch (error) {
        console.log('Could not get main branch version, using default 1.0.0');
        return '1.0.0';
    }
}

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

console.log('Command:', command);
console.log('Arg:', arg);

switch (command) {
    case 'setup-feature':
        const featureName = arg;
        if (!featureName) {
            console.error('Please provide a feature name');
            process.exit(1);
        }

        const branchName = `feature/${featureName}`;
        console.log(`Setting up feature branch: ${branchName}`);

        // Get main branch version and increment minor
        const mainVersion = getMainBranchVersion();
        const newVersion = createFeatureBranchVersion(mainVersion);

        // Create and checkout branch
        execSync(`git checkout -b ${branchName}`);

        // Update URLs and version
        updateUserscriptUrls(branchName);
        updateVersion(newVersion, true);

        // Commit and push
        execSync(`git add ${USERSCRIPT_FILE}`);
        execSync(`git commit -m "Setup feature branch for ${featureName} - v${newVersion}"`);
        execSync(`git push origin ${branchName}`);

        console.log(`Feature branch ready! Version: ${newVersion}`);
        console.log(`Install userscript from:`);
        console.log(`https://raw.githubusercontent.com/${GITHUB_REPO}/${branchName}/${USERSCRIPT_FILE}`);
        break;

    case 'increment-dev':
        const currentBranch = getCurrentBranch();
        if (!isFeatureBranch(currentBranch)) {
            console.error('Can only increment dev version on feature branches');
            process.exit(1);
        }

        const currentVersion = getCurrentVersion();
        const newDevVersion = incrementDevVersion(currentVersion);

        console.log(`Incrementing dev version: ${currentVersion} -> ${newDevVersion}`);
        updateVersion(newDevVersion, true);

        console.log(`Version updated to: ${newDevVersion}`);
        break;

    case 'auto-commit':
        const branch = getCurrentBranch();
        if (!isFeatureBranch(branch)) {
            console.log('Not on a feature branch, skipping auto-commit');
            break;
        }

        // Increment dev version
        const oldVersion = getCurrentVersion();
        const autoNewVersion = incrementDevVersion(oldVersion);
        updateVersion(autoNewVersion, true);

        // Commit and push
        execSync(`git add ${USERSCRIPT_FILE}`);
        execSync(`git commit -m "Auto-increment dev version to ${autoNewVersion}"`);
        execSync(`git push origin ${branch}`);

        console.log(`Auto-committed version ${autoNewVersion} to ${branch}`);
        break;

    case 'prepare-release':
        console.log('Preparing for production release...');

        const releaseCurrentVersion = getCurrentVersion();
        const releaseParsed = parseVersion(releaseCurrentVersion);
        const releaseVersion = `${releaseParsed.major}.${releaseParsed.minor}.0`; // Clean version for release

        // Update URLs back to main
        updateUserscriptUrls('main');
        updateVersion(releaseVersion);

        console.log(`Ready to merge to main with version: ${releaseVersion}`);
        console.log('Run: git add . && git commit -m "Prepare for release"');
        break;

    default:
        console.log('Usage:');
        console.log('  node .kiro/scripts/branch-helper.js setup-feature <feature-name>');
        console.log('  node .kiro/scripts/branch-helper.js increment-dev');
        console.log('  node .kiro/scripts/branch-helper.js auto-commit');
        console.log('  node .kiro/scripts/branch-helper.js prepare-release');
}
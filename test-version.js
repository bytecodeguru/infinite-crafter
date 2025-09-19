const fs = require('fs');
const { execSync } = require('child_process');

function getCurrentBranch() {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
}

function getCurrentVersion() {
    const content = fs.readFileSync('infinite-craft-helper.user.js', 'utf8');
    const versionMatch = content.match(/@version\s+(.+)/);
    return versionMatch ? versionMatch[1].trim() : '1.0.0';
}

function parseVersion(version) {
    const cleanVersion = version.split('-')[0];
    const parts = cleanVersion.split('.');
    return {
        major: parseInt(parts[0]) || 1,
        minor: parseInt(parts[1]) || 0,
        dev: parseInt(parts[2]) || 0
    };
}

function incrementDevVersion(currentVersion) {
    const parsed = parseVersion(currentVersion);
    return `${parsed.major}.${parsed.minor}.${parsed.dev + 1}`;
}

function isFeatureBranch(branch) {
    return branch.startsWith('feature/') || branch.startsWith('fix/') || branch.startsWith('refactor/');
}

const currentBranch = getCurrentBranch();
console.log('Branch:', currentBranch);
console.log('Is feature branch:', isFeatureBranch(currentBranch));

if (!isFeatureBranch(currentBranch)) {
    console.log('ERROR: Can only increment dev version on feature branches');
} else {
    const currentVersion = getCurrentVersion();
    const newDevVersion = incrementDevVersion(currentVersion);
    console.log('Current version:', currentVersion);
    console.log('New version:', newDevVersion);
}
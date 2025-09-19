#!/usr/bin/env node

/**
 * Branch Helper Utility
 * Helps manage userscript URLs for branch-based development
 */

const fs = require('fs');
const { execSync } = require('child_process');

const USERSCRIPT_FILE = 'infinite-craft-helper.user.js';
const GITHUB_REPO = 'bytecodeguru/infinite-crafter';

function getCurrentBranch() {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
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

function updateVersion(version) {
    const content = fs.readFileSync(USERSCRIPT_FILE, 'utf8');
    const updatedContent = content.replace(/@version\s+.*/, `// @version      ${version}`);
    fs.writeFileSync(USERSCRIPT_FILE, updatedContent);
    console.log(`Updated version to: ${version}`);
}

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
    case 'setup-feature':
        const featureName = arg;
        if (!featureName) {
            console.error('Please provide a feature name');
            process.exit(1);
        }
        
        const branchName = `feature/${featureName}`;
        console.log(`Setting up feature branch: ${branchName}`);
        
        // Create and checkout branch
        execSync(`git checkout -b ${branchName}`);
        
        // Update URLs and version
        updateUserscriptUrls(branchName);
        updateVersion(`1.0.1-${featureName}`);
        
        // Commit and push
        execSync(`git add ${USERSCRIPT_FILE}`);
        execSync(`git commit -m "Setup feature branch for ${featureName}"`);
        execSync(`git push origin ${branchName}`);
        
        console.log(`Feature branch ready! Install userscript from:`);
        console.log(`https://raw.githubusercontent.com/${GITHUB_REPO}/${branchName}/${USERSCRIPT_FILE}`);
        break;
        
    case 'prepare-release':
        console.log('Preparing for production release...');
        
        // Update URLs back to main
        updateUserscriptUrls('main');
        updateVersion('1.0.2'); // Increment version
        
        console.log('Ready to merge to main. Run: git add . && git commit -m "Prepare for release"');
        break;
        
    default:
        console.log('Usage:');
        console.log('  node branch-helper.js setup-feature <feature-name>');
        console.log('  node branch-helper.js prepare-release');
}
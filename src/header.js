/**
 * Userscript metadata and configuration
 * This file contains the userscript header information that will be injected into the final build
 */

export const metadata = {
    name: 'Infinite Craft Helper',
    namespace: 'http://tampermonkey.net/',
    version: '{{VERSION}}',
    description: 'Control panel overlay for Infinite Craft with GameInterface foundation',
    author: 'You',
    match: [
        'https://neal.fun/infinite-craft/*',
        'https://neal.fun/infinite-craft'
    ],
    updateURL: '{{UPDATE_URL}}',
    downloadURL: '{{DOWNLOAD_URL}}',
    supportURL: 'https://github.com/bytecodeguru/infinite-crafter/issues',
    homepageURL: 'https://github.com/bytecodeguru/infinite-crafter',
    grant: 'none'
};
export const metadata = {
    name: 'Size Policy Fixture',
    namespace: 'http://tampermonkey.net/',
    version: '{{VERSION}}',
    description: 'Fixture to verify size policy checks',
    author: 'Test Suite',
    match: [
        'https://example.com/*'
    ],
    updateURL: '{{UPDATE_URL}}',
    downloadURL: '{{DOWNLOAD_URL}}',
    grant: 'none'
};

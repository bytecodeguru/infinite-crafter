/**
 * Version management utilities
 * Handles version information and display formatting
 */

/**
 * Get version info from userscript metadata
 * @returns {Object} Version information object
 */
export function getVersionInfo() {
    const gmInfo = typeof globalThis !== 'undefined' ? globalThis.GM_info : undefined;
    const gmVersion = gmInfo && gmInfo.script && gmInfo.script.version ? gmInfo.script.version : null;

    const injectedVersion = typeof window !== 'undefined' && window.__INFINITE_CRAFT_HELPER_VERSION__
        ? window.__INFINITE_CRAFT_HELPER_VERSION__
        : null;

    let version = gmVersion || injectedVersion || '{{VERSION}}';

    if (version === '{{VERSION}}') {
        version = 'dev-local';
    }

    const isDevVersion = /dev|test|-/.test(version);

    return {
        version,
        isDev: isDevVersion,
        displayVersion: isDevVersion ? version : `v${version}`,
        tag: isDevVersion ? 'DEV' : null
    };
}

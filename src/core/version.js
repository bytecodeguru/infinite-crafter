/**
 * Version management utilities
 * Handles version information and display formatting
 */

/**
 * Get version info from userscript metadata
 * @returns {Object} Version information object
 */
export function getVersionInfo() {
    const version = '{{VERSION}}';  // Will be replaced during build
    const isDevVersion = version.includes('-') || version.includes('dev') || version.includes('test');

    return {
        version: version,
        isDev: isDevVersion,
        displayVersion: isDevVersion ? version : `v${version}`,
        tag: isDevVersion ? 'DEV' : null
    };
}
export default {
    // Source and output directories
    srcDir: './src',
    outputDir: './dist',
    outputFile: 'infinite-craft-helper.user.js',

    // File size policy
    maxFileLines: 300,
    maxFunctionLines: 50,
    recommendedFileLines: 200,
    recommendedFunctionLines: 30,

    // Watch mode configuration
    watch: {
        enabled: false,
        debounce: 300,
        ignored: ['node_modules/**', 'dist/**', '.git/**']
    },

    // Branch and URL configuration
    branch: {
        auto: true,
        urlTemplate: 'https://raw.githubusercontent.com/bytecodeguru/infinite-crafter/{{BRANCH}}/infinite-craft-helper.user.js'
    },

    // Build options
    build: {
        minify: false,
        sourceMaps: false,
        validateSyntax: true,
        enforcePolicy: true
    },

    // Logging configuration
    logging: {
        level: 'info', // 'debug', 'info', 'warn', 'error'
        timestamps: true,
        colors: true
    }
};
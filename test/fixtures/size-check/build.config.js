export default {
    srcDir: './test/fixtures/size-check/src',
    outputDir: './test/fixtures/size-check/dist',
    outputFile: 'fixture.user.js',
    watch: {
        enabled: false,
        debounce: 100,
        ignored: []
    },
    quality: null,
    branch: {
        auto: false,
        urlTemplate: 'https://example.com/{{BRANCH}}/fixture.user.js'
    },
    build: {
        minify: false,
        sourceMaps: false,
        validateSyntax: true,
        enforcePolicy: false
    },
    logging: {
        level: 'warn',
        timestamps: false,
        colors: false
    }
};

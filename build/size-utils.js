export function lineCount(content) {
    if (!content) {
        return 0;
    }
    return content.split(/\r?\n/).length;
}

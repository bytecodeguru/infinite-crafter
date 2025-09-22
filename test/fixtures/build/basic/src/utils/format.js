export function formatMessage(message) {
    return `[formatted] ${message}`;
}

export function titleCase(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

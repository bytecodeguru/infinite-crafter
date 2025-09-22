import { initPanel } from './ui/panel.js';

export function bootstrap() {
    const panel = initPanel();
    return panel.status;
}

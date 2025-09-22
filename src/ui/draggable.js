/**
 * Drag functionality
 * Makes the control panel draggable by its header
 */

/**
 * Make panel draggable
 * @param {HTMLElement} panel - The panel element to make draggable
 */
export function makeDraggable(panel) {
    if (!panel) {
        console.warn('[makeDraggable] Panel is null, skipping drag setup');
        return;
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentLeft = parseFloat(panel.style.left) || panel.getBoundingClientRect().left;
    let currentTop = parseFloat(panel.style.top) || panel.getBoundingClientRect().top;

    const header = panel.querySelector('.panel-header');

    if (!header) {
        console.warn('[makeDraggable] Header not found, skipping drag setup');
        return;
    }

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === header || header.contains(e.target)) {
            startX = e.clientX - currentLeft;
            startY = e.clientY - currentTop;
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentLeft = e.clientX - startX;
            currentTop = e.clientY - startY;

            panel.style.left = `${currentLeft}px`;
            panel.style.top = `${currentTop}px`;
        }
    }

    function dragEnd() {
        isDragging = false;
    }
}

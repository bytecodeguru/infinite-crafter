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
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = panel.querySelector('.panel-header');

    if (!header) {
        console.warn('[makeDraggable] Header not found, skipping drag setup');
        return;
    }

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}
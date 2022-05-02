export function coordinatesToPercentage(draggableData) {
    const rect = $('#react-container')[0].getBoundingClientRect();
    const offsetX = draggableData.lastX;
    const offsetY = draggableData.lastY;

    return {
        x: offsetX / (rect.width - 2) * 100,
        y: offsetY / (rect.height - 2) * 100
    };
}
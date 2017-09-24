/**
 * Normalize given coordinate x and y to the range of [-1, 1]
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @param {number} width window width
 * @param {number} height widnow height
 */
export function normalize (x, y, width, height) {
    return {
        x: x / width * 2 - 1,
        y: -y / height * 2 + 1
    };
}
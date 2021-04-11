/**
 * Normalize given coordinate x and y to the range of [-1, 1]
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @param {number} width window width
 * @param {number} height widnow height
 * @return {object} normalized coordinate {x: number, y: number}
 */
export function normalize(x, y, width, height) {
  return {
    x: (x / width) * 2 - 1,
    y: (-y / height) * 2 + 1,
  };
}

/**
 * Calculate distance between two 2d points
 * @param {object} p1 point {x: number, y: number}
 * @param {object} p2 point {x: number, y: number}
 * @return {number} distance
 */
export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Calculate coordinate relative to the event target
 * @param {object} event event object
 * @return {object} 2d coordinate {x: number, y: number}
 */
export function relativeCoordinate(event) {
  const bounds = event.target.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

/**
 * Return random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns number random number
 */
export function random(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

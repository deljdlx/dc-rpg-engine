/**
 * Coordinates - Represents a 2D point with x and y values
 */
class Coordinates
{
  _x;
  _y;

  /**
   * Create coordinates
   * @param {Number|null} x - X coordinate
   * @param {Number|null} y - Y coordinate
   */
  constructor(x = null, y = null) {
    this._x = x;
    this._y = y;
  }

  /**
   * Add a value to a specific axis
   * @param {String} axis - 'x' or 'y'
   * @param {Number} value - Value to add
   * @returns {Number} New coordinate value
   */
  add(axis, value) {
    if(axis === 'x') {
      return this.x(this.x() + value);
    }

    if(axis === 'y') {
      return this.y(this.y() + value);
    }
  }


  /**
   * Get or set X coordinate
   * @param {Number|null} value - New X value or null to get current
   * @returns {Number} Current X coordinate
   */
  x(value = null) {
    if(value !== null) {
      this._x = Math.round(value);
    }
    return this._x;
  }

  /**
   * Get or set Y coordinate
   * @param {Number|null} value - New Y value or null to get current
   * @returns {Number} Current Y coordinate
   */
  y(value = null) {
    if(value !== null) {
      this._y = Math.round(value);
    }
    return this._y;
  }
}
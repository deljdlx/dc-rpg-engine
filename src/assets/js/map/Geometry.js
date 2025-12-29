/**
 * Geometry - Manages size and position for game elements
 */
class Geometry
{
  /**
   * @type {Number}
   */
  _width = Constants.DEFAULT_ELEMENT_WIDTH;

  /**
   * @type {Number}
   */
  _height = Constants.DEFAULT_ELEMENT_HEIGHT;
  /**
   * @type {Coordinates}
   */
  _coordinates;

  /**
   * Create a new geometry instance
   */
  constructor() {
    this._coordinates = new Coordinates();
  }

  /**
   * Create a copy of this geometry
   * @returns {Geometry} Cloned geometry
   */
  clone() {
    const cloned = new Geometry();
    cloned.x(this.x());
    cloned.y(this.y());
    cloned.width(this.width());
    cloned.height(this.height());
    return cloned;
  }

  /**
   * Get the coordinates object
   * @returns {Coordinates}
   */
  coordinates() {
    return this._coordinates;
  }

  /**
   * Get or set width
   * @param {Number|null} value - New width or null to get current
   * @returns {Number} Current width
   */
  width(value = null) {
    if(value !== null) {
      this._width = Math.round(value);
    }
    return this._width;
  }

  /**
   * Get or set height
   * @param {Number|null} value - New height or null to get current
   * @returns {Number} Current height
   */
  height(value = null) {
    if(value !== null) {
      this._height = Math.round(value);
    }
    return this._height;
  }

  /**
   * Get or set X position
   * @param {Number|null} value - New X or null to get current
   * @returns {Number} Current X position
   */
  x(value = null) {
    return this._coordinates.x(value);
  }

  /**
   * Get or set Y position
   * @param {Number|null} value - New Y or null to get current
   * @returns {Number} Current Y position
   */
  y(value = null) {
    return this._coordinates.y(value);
  }

  /**
   * Add a value to an axis
   * @param {String} axis - 'x' or 'y'
   * @param {Number} value - Value to add
   * @returns {Number} New coordinate value
   */
  add(axis, value) {
    return this._coordinates.add(axis, value);
  }

}

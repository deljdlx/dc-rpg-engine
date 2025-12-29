/**
 * BoundingBox - Represents a rectangular boundary for collision detection
 */
class BoundingBox
{

  /**
   * @type {Element}
   */
  _element;

  /**
   * @type {Number}
   */
  _x0 = null;

  /**
   * @type {Number}
   */
  _x1 = null;

  /**
   * @type {Number}
   */
  _y0 = null;

  /**
   * @type {Number}
   */
  _y1 = null;

  /**
   * @type {Boolean}
   */
  _collided = false;

  /**
   * Create a bounding box
   * @param {Element|null} element - Element to create bounds for
   */
  constructor(element = null) {
    if(element) {
      this._element = element
      this._x0 = element.x();
      this._y0 = element.y();
      this._x1 = element.x() + element.width();
      this._y1 = element.y() + element.height();
    }
  }

  /**
   * Get or set the collision state
   * @param {Boolean|null} value - New collision state or null to get current
   * @returns {Boolean} Current collision state
   */
  collided(value = null) {
    if(value !== null) {
      this._collided = value;
    }

    return this._collided;
  }

  /**
   * Update this bounding box to encompass another bounding box
   * @param {BoundingBox} boundingBox - The bounding box to include
   * @returns {BoundingBox} This bounding box for chaining
   */
  updateWithBoundingBox(boundingBox) {

    if(this.x0() === null || boundingBox.x0() < this.x0()) {
      this.x0(boundingBox.x0());
    }

    if(this.x1() === null ||boundingBox.x1() > this.x1()) {
      this.x1(boundingBox.x1());
    }

    if(this.y0() === null || boundingBox.y0() < this.y0()) {
      this.y0(boundingBox.y0());
    }

    if(this.y1() === null || boundingBox.y1() > this.y1()) {
      this.y1(boundingBox.y1());
    }

    return this
  }

  /**
   * Update this bounding box to include a child element's bounds
   * @param {Element} parentElement - Parent element
   * @param {Element} childElement - Child element to include
   */
  updateWithRelativeElement(parentElement, childElement) {
    if(
      (parentElement.getCollisionBoundingBox().x1() <
      childElement.getCollisionBoundingBox().x1() + childElement.x()
      || parentElement.getCollisionBoundingBox().x1() === null)
      && childElement.getCollisionBoundingBox().x1() !== null
    ) {
      parentElement.getCollisionBoundingBox().x1(
        childElement.getCollisionBoundingBox().x1() + childElement.x()
      )
    }

    if(
      (parentElement.getCollisionBoundingBox().x0() >
      childElement.getCollisionBoundingBox().x0() + childElement.x()
      || parentElement.getCollisionBoundingBox().x0() === null)
      && childElement.getCollisionBoundingBox().x0() !== null
    ) {
      parentElement.getCollisionBoundingBox().x0(
        childElement.getCollisionBoundingBox().x0() + childElement.x()
      )
    }

    if(
      (parentElement.getCollisionBoundingBox().y1() <
      childElement.getCollisionBoundingBox().y1() + childElement.y()
      || parentElement.getCollisionBoundingBox().y1() === null)
      && childElement.getCollisionBoundingBox().y1() !== null
    ) {
      parentElement.getCollisionBoundingBox().y1(
        childElement.getCollisionBoundingBox().y1() + childElement.y()
      )
    }

    if(
      (parentElement.getCollisionBoundingBox().y0() >
      childElement.getCollisionBoundingBox().y0() + childElement.y()
      || parentElement.getCollisionBoundingBox().y0() === null)
      && childElement.getCollisionBoundingBox().y0() !== null
    ) {
      parentElement.getCollisionBoundingBox().y0(
        childElement.getCollisionBoundingBox().y0() + childElement.y()
      )
    }
  }

  // ===========================
  /**
   * Check if this bounding box collides with another
   * @param {BoundingBox} boundingBox - The bounding box to check against
   * @returns {Boolean} True if the boxes collide
   */
  isCollided(boundingBox) {
    if(this.isUndefined() || boundingBox.isUndefined()) {
      return false;
    }

    return (
      this.offsetX0() <= boundingBox.offsetX1()
      && this.offsetX1() >= boundingBox.offsetX0()
      && this.offsetY0() <= boundingBox.offsetY1()
      && this.offsetY1() >= boundingBox.offsetY0()
    );
  }

  /**
   * Check if this bounding box is undefined (has null coordinates)
   * @returns {Boolean} True if any coordinate is null
   */
  isUndefined() {
    return this._x0 === null || this._x1 === null || this._y0 === null || this._y1 === null;
  }

  // ===========================

  /**
   * @returns {{x0: number, x1: number, y0: number, y1: number}}
   */
  offsets() {
    return {
      x0: this.offsetX0(),
      x1: this.offsetX1(),
      y0: this.offsetY0(),
      y1: this.offsetY1(),
    }
  }

  offsetX0() {
    return this.x0() + this._element.offsetX();
  }

  offsetX1() {
    return this.x1() + this._element.offsetX();
  }

  offsetY0() {
    return this.y0() + this._element.offsetY();
  }

  offsetY1() {
    return this.y1() + this._element.offsetY();
  }


  x0(value = null) {
    if(value !== null) {
      this._x0 = value;
    }
    return this._x0;
  }

  x1(value = null) {
    if(value !== null) {
      this._x1 = value;
    }
    return this._x1;
  }

  y0(value = null) {
    if(value !== null) {
      this._y0 = value;
    }
    return this._y0;
  }

  y1(value = null) {
    if(value !== null) {
      this._y1 = value;
    }
    return this._y1;
  }

  width(value = null) {
    if(value !== null) {
      this._x1 = this.x0() + value;
    }
    return this._x1 - this._x0;
  }

  height(value = null) {
    if(value) {
      this._y1 = this.y0() + value;
    }
    return this._y1 - this._y0;
  }

}
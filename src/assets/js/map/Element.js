class Element
{
  data = {};

  _application;

  manualZ = false;
  /**
   * @type {BoundingBox}
   */
  boundingBox;

  _collided = {
    collision: false,
    trigger: false,
  };

  /**
   * @type {Element}
   */
  // collisionZones = [];
  collisionZones = {
    collision: [],
    trigger: [],
  };

  collidedWith = {
    collision: [],
    trigger: [],
  };


  triggerZones = [];



  /**
   * @type {BoundingBox}
   */
   collisionBoundingBox;


  /**
   * @type {Geometry}
   */
  geometry;


  /**
   * @type {Element}
   */
  parent;

  /**
   * @type {Element[]}
   */
  children = [];

  childrenByName = {};

  /**
   * @type {Renderer}
   */
  renderer;

  /**
   * @type {Boolean}
   */
  _needUpdate = false;

  rendered = false;

  _relativeTo = null;

  /**
   * @type {boolean}
   */
  _staticPosition = false;
  _targetX;
  _targetY;
  _targetHitZone = 2;
  _onMoveEnd = () => null;
  _moving = false;
  _moveSpeed = 100;


  _eventPrefix = 'element.';
  _listeners = {};


  /**
   * Create a new element
   * @param {Number|null} x - Initial X position
   * @param {Number|null} y - Initial Y position
   * @param {Number|null} width - Element width
   * @param {Number|null} height - Element height
   */
  constructor(x = null, y = null, width = null, height = null)
  {

    this._application = Application.mainInstance;


    this.geometry = new Geometry();
    this.setRenderer(new Renderer(this));

    this.collisionBoundingBox = new BoundingBox(this);


    this.x(x);
    this.y(y);
    this.width(width);
    this.height(height);

    this.boundingBox = new BoundingBox(this);
  }

  /**
   * Clear the element's renderer and all children
   */
  clear() {
    this.getRenderer().clear();
    this.children.forEach(child => {
      child.clear();
    });
  }

  /**
   * Destroy the element and remove it from its parent
   */
  destroy() {
    if(this.parent) {
      this.parent.removeChild(this);
    }

    this.children = [];
    this.childrenByName = {};

    this.getRenderer().clear();
  }

  /**
   * Remove a child element
   * @param {Element} element - The element to remove
   */
  removeChild(element) {
    this.children = this.children.filter(child => child !== element);
    this.childrenByName = Object.keys(this.childrenByName).reduce((accumulator, name) => {
      if(this.childrenByName[name] !== element) {
        accumulator[name] = this.childrenByName[name];
      }
      return accumulator;
    }, {});
  }



  /**
   * Set the renderer for this element
   * @param {Renderer} renderer - The renderer instance
   * @returns {Element} This element for chaining
   */
  setRenderer(renderer) {
    this.renderer = renderer;
    this.dom = this.renderer.getDom();
    this.registerEvents();

    return this;
  }

  /**
   * Get the DOM element
   * @returns {HTMLElement}
   */
  getDom() {
    return this.dom;
  }

  /**
   * Set inner HTML content
   * @param {String} html - HTML content
   */
  setInnerHTML(html) {
    this.renderer.setInnerHTML(html);
  }

  /**
   * Add a CSS class to the element
   * @param {String} className - Class name to add
   */
  addClass(className) {
    this.renderer.addClass(className);
  }


  /**
   * Register DOM event handlers
   */
  registerEvents() {
    this.dom.addEventListener('click', (event) => {
      this.handle('element.click', {
        element: this,
        areaX: event.offsetX,
        areaY: event.offsetY,
        originalEvent: event,
      });
    })
  }


  // ===========================

  /**
   * Add an event listener to this element
   * @param {String} name - Event name
   * @param {Function} callback - Event handler function
   * @returns {Number} Index of the listener in the listeners array
   */
  addEventListener(name, callback) {
    if(typeof(this._listeners[name]) === 'undefined') {
      this._listeners[name] = [];
    }
    this._listeners[name].push(callback);

    return this._listeners[name].length - 1;
  }

  /**
   * Trigger an event on this element
   * @param {String} name - Event name
   * @param {Object} data - Event data
   */
  handle(name, data = {}) {
    if(typeof(this._listeners[name]) !== 'undefined') {
      this._listeners[name].map(callback => {
        callback(data);
      });
    }

    this.getApplication().handle(name, data);
  }

  // ===========================
  /**
   * Get the application instance
   * @returns {Application}
   */
  getApplication() {
    return this._application;
  }

  /**
   * Set the application instance
   * @param {Application} application
   * @returns {Application}
   */
  setApplication(application) {
    this._application = application;
    return application;
  }
  // ===========================

  /**
   * Get or set the static position flag
   * @param {Boolean|null} value - New value or null to get current value
   * @returns {Boolean} Current static position state
   */
  staticPosition(value = null) {
    if(value  !== null) {
      this._staticPosition = value;
    }
    return this._staticPosition;
  }

  /**
   * Get or set the movement speed
   * @param {Number|null} value - New speed or null to get current value
   * @returns {Number} Current move speed
   */
  moveSpeed(value = null) {
    if(value !== null) {
      this._moveSpeed = value;
    }

    return this._moveSpeed;
  }

  /**
   * Get or set the moving state
   * @param {Boolean|null} value - New state or null to get current state
   * @returns {Boolean} Whether the element is currently moving
   */
  isMoving(value = null) {
    if(value !== null) {
      this._moving = value;
    }

    return this._moving;
  }


  /**
   * Update the element's state and rendering
   */
  update() {
    if(this.isMoving() && this.y() < this._targetY) {
      this.direction = 'down';
      this.y(this.y() + this.moveSpeed());
    }
    else if(this.isMoving() && this.x() < this._targetX) {
      this.direction = 'right';
      this.x(this.x() + this.moveSpeed());
    }

    if(this.parent) {
      this.parent.updateCollisionBoundingBox(this);
    }

    if(this.needUpdate() || this.isMoving()) {
      if(
        Math.abs(this._targetX - this.x()) <= this._targetHitZone
        && Math.abs(this._targetY - this.y()) <= this._targetHitZone
        && this.isMoving()
      ) {
        this._moving = false;
        this._onMoveEnd(this);
      }

      this.getRenderer().update();
      this.getChildren().forEach(element => {
        element.update();
      });
    }
    this.needUpdate(false);
  }


  /**
   * Get the parent element
   * @returns {Element|null}
   */
  getParent() {
    return this.parent;
  }


  // ===========================

  /**
   * Get or set the element this one is positioned relative to
   * @param {Element|null} element - Element to position relative to, or null to get current
   * @returns {Element|null}
   */
  relativeTo(element = null) {
    if(element !== null) {
      this._relativeTo = element;
    }

    return this._relativeTo;
  }

  /**
   * Get the relative offsets from parent elements
   * @returns {{x: Number, y: Number}} Offset coordinates
   */
  getRelativeToOffsets() {
    if(!this._relativeTo) {
      return {
        x: 0,
        y: 0,
      }
    }

    const offsets = this._relativeTo.getRelativeToOffsets();
    return {
      x: offsets.x  + this.x(),
      y: offsets.y  + this.y(),
    };
  }


  /**
   * Get or set the element width
   * @param {Number|null} value - New width or null to get current value
   * @returns {Number} Current width
   */
  width(value = null) {
    return this.geometry.width(value);
  }

  /**
   * Get or set the element height
   * @param {Number|null} value - New height or null to get current value
   * @returns {Number} Current height
   */
  height(value = null) {
    return this.geometry.height(value);
  }

  /**
   * Get or set the element X position
   * @param {Number|null} value - New X position or null to get current value
   * @returns {Number} Current X position
   */
  x(value = null) {
    return this.geometry.x(value);
  }

  /**
   * Get or set the element Y position
   * @param {Number|null} value - New Y position or null to get current value
   * @returns {Number} Current Y position
   */
  y(value = null) {
    return this.geometry.y(value);
  }

  /**
   * Get the absolute X offset including all parent offsets
   * @returns {Number}
   */
  offsetX() {
    if(this.parent) {
      return this.x() + this.parent.offsetX();
    }

    return this.x();
  }

  /**
   * Get the absolute Y offset including all parent offsets
   * @returns {Number}
   */
  offsetY() {
    if(this.parent) {
      return this.y() + this.parent.offsetY();
    }

    return this.y();
  }

  /**
   * Create a new child element
   * @returns {Element} The newly created child element
   */
  createElement() {
    const element = new Element();
    element.setApplication(this.getApplication());
    this.children.push(element);

    element.setParent(this);
    element.relativeTo(this);

    return element;
  }

  /**
   * Add an element as a child at specified position
   * @param {Number} x - X position
   * @param {Number} y - Y position
   * @param {Element} element - Element to add
   * @param {String} name - Name identifier for the element
   * @returns {Element} The added element
   */
  addElement(x = 0, y = 0, element, name) {
    element.setApplication(this.getApplication());
    this.children.push(element);
    this.childrenByName[name] = element;

    element.setParent(this);
    element.relativeTo(this);

    element.x(x);
    element.y(y);

    this.updateCollisionBoundingBox(element);
    this.updateBoundingBox(element);

    if(this.parent) {
      this.parent.updateCollisionBoundingBox(this);
    }

    this.needUpdate(true);
    return element;
  }

  /**
   * Create a collision zone for this element
   * @param {Number} x - X offset of collision zone
   * @param {Number} y - Y offset of collision zone
   * @param {Number} width - Width of collision zone
   * @param {Number} height - Height of collision zone
   * @param {String} type - Type of collision ('collision' or 'trigger')
   * @returns {BoundingBox} The created collision zone
   */
  createCollisionZone(x = null, y = null, width = null, height = null, type = 'collision') {

    const zone = new BoundingBox(this);
    zone.x0(x);
    zone.y0(y);
    zone.width(width);
    zone.height(height);

    this.collisionZones[type].push(zone);

    this.collisionBoundingBox.updateWithBoundingBox(zone);

    if(this.parent) {
      this.parent.updateCollisionBoundingBox(this);
    }

    return zone;
  }


  createTriggerZone(x = null, y = null, width = null, height = null) {
    return this.createCollisionZone(x, y, width, height, 'trigger');
  }

  /**
   * @param {Element}
   */
  updateCollisionBoundingBox(element) {
    this.collisionBoundingBox.updateWithRelativeElement(this, element);
    if(this.parent) {
      this.parent.updateCollisionBoundingBox(this);
    }
  }

  /**
   * @param {Element}
   */
  updateBoundingBox(element) {
    const boundingBox = new BoundingBox();
    boundingBox.x0(element.x());
    boundingBox.y0(element.y());

    boundingBox.x1(element.x() + element.getBoundingBox().width());
    boundingBox.y1(element.y() + element.getBoundingBox().height());

    this.boundingBox.updateWithBoundingBox(boundingBox);
    if(this.parent) {
      this.parent.updateBoundingBox(this);
    }
  }

  // ===========================
  needUpdate(value = null) {
    if(value !== null) {
      this._needUpdate = value;
      if(this.parent) {
        this.parent.needUpdate(value);
      }
    }

    return this._needUpdate;
  }

  // ===========================

  collided(value = null, type = 'collision') {

    if(value !== null) {
      if(value !== this._collided[type]) {
        this._collided[type] = value;
        if(value === false) {
          this.collisionZones[type].forEach(zone => {
            zone.collided(false, type);
          });
        }

        if(this.parent) {
          this.parent.collided(value, type);
        }
        this.needUpdate(true);
      }
    }

    return this._collided[type];
  }

  getTrigger(element) {
    return this.getCollision(element, 'trigger');
  }


  getCollision(element, type = 'collision') {

    if(element === this) {
      return false;
    }

    const boundingBoxCollided = this.getCollisionBoundingBox().isCollided(
      element.getCollisionBoundingBox()
    );

    if(boundingBoxCollided) {
      const collided = element.collisionZones[type].reduce((collided, zone) => {

        const isCollided = this.getCollisionBoundingBox().isCollided(zone, type);
        if(!collided) {
          collided = isCollided;
        }
        zone.collided(isCollided, type);

        return collided
      }, false);

      if(collided) {

        if(!element.collided(null, type)) {
          this.collidedWith[type].push(element);

          this.handle(this._eventPrefix + type, {
            element: this,
            target: element,
          });

          element.handle(this._eventPrefix + type, {
            element: this,
            target: element,
          });
        }

        element.collided(true, type);
        this.collided(true, type);

        return [element];
      }

      const childCollisions = element.getChildren().map(child => {
        const result = this.getCollision(child, type);
        return result;
      }).filter(Boolean).reduce((accumulator, element) => element, []);

      if(childCollisions.length) {
        return childCollisions;
      }
    }
    element.clearCollision(type);

    return false;
  }

  clearCollision(type = 'collision') {

    this.collidedWith[type].forEach(element => {
      this.handle('element.' + type + '.end', {
        element: this,
        target: element,
      });
    });

    this.collidedWith[type].forEach(element => {
      element.handle('element.' + type + '.end', {
        element: element,
        target: this,
      });
    });
    this.collidedWith[type] = [];

    this.collided(false, type);
    this.getCollisionZones(type).forEach(zone => {
      if(zone.dom) {
        zone.collided(false, type);
      }

    });
    this.getChildren().forEach(child => {
      child.clearCollision(type);
    });
  }

  // ===========================

  /**
   * @param {Element} element
   * @returns {Element}
   */
  setParent(element) {
    this.parent = element;
    return this;
  }

  getChildren() {
    return this.children;
  }

  getChildByName(name) {
    if(typeof(this.childrenByName[name]) ==='undefined') {
      throw new Error('No element with name ' + name);
    }
    return this.childrenByName[name];
  }

  getAllChildren() {
    const children = [];
    this.getChildren().forEach(parent => {
      children.push(parent);
      // parent.relativeTo(this);

      parent.getAllChildren().forEach(child => {
        // child.relativeTo(parent);
        children.push(child);
      });
    });
    return children;
  }

  getCollisionZones(type = 'collision') {
    return this.collisionZones[type];
  }

  getCollisionBoundingBox() {
    return this.collisionBoundingBox;
  }

  getBoundingBox() {
    return this.boundingBox;
  }


  // ===========================

  /**
   * @returns {Renderer}
   */
  getRenderer() {
    return this.renderer;
  }

  /**
   * @returns {Boolean}
   */
  isRendered() {
    return this.rendered;
  }

  render() {
    this.rendered = true;
    // this.renderBoundingBox();
    return this.renderer.render();
  }

  renderBoundingBox() {
    this.renderer.renderBoundingBox();

    this.getChildren().forEach(element => {
      element.renderBoundingBox()
    });
  }

  renderCollisionZones() {
    return this.renderer.renderCollisionZones();
  }
}



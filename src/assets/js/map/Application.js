class Application
{

  _elementsClasses = {};
  _viewport;
  _container;
  _width;
  _height;


  listeners = {};

  apiGetAreaUrl = './backend/index.php';


  /**
   * Initialize the RPG engine application
   * @param {String} selector - CSS selector for the container element
   * @param {Number} width - Width of the viewport in pixels
   * @param {Number} height - Height of the viewport in pixels
   */
  constructor(selector, width, height) {
    this._container = document.querySelector(selector);
    this._width = width;
    this._height = height;

    Application.mainInstance = this;
    this._viewport = new Viewport(
      this,
      this._container,
      this._width,
      this._height,
    );
  }

  /**
   * Clear the viewport
   */
  clear() {
    this._viewport.clear();
  }

  /**
   * Register an event listener
   * @param {String} name - Event name
   * @param {Function} callback - Callback function
   * @returns {Number} Index of the registered listener
   */
  addEventListener(name, callback) {
    if(typeof(this.listeners[name]) === 'undefined') {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);

    return this.listeners[name].length - 1;
  }

  /**
   * Trigger an event by name
   * @param {String} name - Event name
   * @param {Object} data - Event data
   */
  handle(name, data = {}) {
    if(typeof(this.listeners[name]) !== 'undefined') {
      this.listeners[name].map(callback => {
        callback(data);
      });
    }
  }

  /**
   * Register a custom element class that can be instantiated by name
   * @param {String} name - Element name/identifier
   * @param {Function} constructorName - Constructor function for the element
   */
  registerElement(name, constructorName) {
    this._elementsClasses[name] = constructorName;
  }

  /**
   * Get all registered element names
   * @returns {Array<String>} Array of registered element names
   */
  getRegisteredElements() {
    return Object.keys(this._elementsClasses);
  }

  /**
   * Instantiate an element by its registered name
   * @param {String} name - Element name
   * @returns {Element|Boolean} The instantiated element or false if not found
   */
  instantiate(name) {
    if(typeof(this._elementsClasses[name]) === 'undefined') {
      console.error('Element with name ' + name + ' does not exist');
      return false;
    }
    return new this._elementsClasses[name];
  }

  /**
   * Initialize and run the application
   * @returns {Promise<void>}
   */
  async run() {
    await this._viewport.run();
    this._viewport.render();
    this._viewport.renderDebug();
  }

  /**
   * Get the viewport instance
   * @returns {Viewport}
   */
  getViewport() {
    return this._viewport;
  }


  /**
   * Fetch area data from the backend
   * @param {Number} x - Area X coordinate
   * @param {Number} y - Area Y coordinate
   * @returns {Promise<Object>} Area data
   */
  async fetchArea(x, y) {
    const data = `x=${x}&y=${y}`;
    return fetch(this.apiGetAreaUrl + '?' + data).then(response => response.json());
  }
}



/**
 * EventEmitter - A mixin for adding event handling capabilities to classes
 * Provides addEventListener and handle methods for event management
 */
class EventEmitter {
  
  /**
   * Initialize the event emitter
   */
  constructor() {
    this._listeners = {};
  }

  /**
   * Add an event listener
   * @param {String} name - Event name
   * @param {Function} callback - Event handler function
   * @returns {Number} Index of the listener in the listeners array
   */
  addEventListener(name, callback) {
    if (typeof this._listeners[name] === 'undefined') {
      this._listeners[name] = [];
    }
    this._listeners[name].push(callback);

    return this._listeners[name].length - 1;
  }

  /**
   * Remove an event listener by index
   * @param {String} name - Event name
   * @param {Number} index - Listener index returned by addEventListener
   * @returns {Boolean} True if listener was removed
   */
  removeEventListener(name, index) {
    if (typeof this._listeners[name] === 'undefined') {
      return false;
    }
    
    if (index >= 0 && index < this._listeners[name].length) {
      this._listeners[name].splice(index, 1);
      return true;
    }
    
    return false;
  }

  /**
   * Trigger an event
   * @param {String} name - Event name
   * @param {Object} data - Event data to pass to handlers
   */
  handle(name, data = {}) {
    if (typeof this._listeners[name] !== 'undefined') {
      this._listeners[name].forEach(callback => {
        callback(data);
      });
    }
  }

  /**
   * Remove all listeners for a specific event or all events
   * @param {String|null} name - Event name or null to clear all
   */
  clearEventListeners(name = null) {
    if (name === null) {
      this._listeners = {};
    } else {
      delete this._listeners[name];
    }
  }
}

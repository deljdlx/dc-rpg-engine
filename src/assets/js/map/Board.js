/**
 * Board - Manages the game world divided into areas
 * Handles dynamic loading and unloading of areas
 */
class Board extends Element
{
  areas = {};

  /**
   * Create a new board
   * @param {Viewport} viewport - The parent viewport
   */
  constructor(viewport) {
    super(0, 0, viewport.width(), viewport.height());
    this._viewport = viewport;
    this._application = viewport.getApplication();

    this.renderer = new BoardRenderer(this);
  }

  /**
   * Initialize the board with a 3x3 grid of areas
   */
  initialize() {
    for(let x = -1 ; x < 2 ; x++) {
      for(let y = -1 ; y < 2 ; y++) {
        this.createAreaAt(x, y);
      }
    }
  }

  /**
   * Clear the board and all areas
   */
  clear() {
    super.clear();
    this.renderer.clear();
    Object.keys(this.areas).map(x => {
      Object.keys(this.areas[x]).map(y => {
        this.areas[x][y].clear();
      });
    });
    this.render();
  }

  /**
   * Initialize board asynchronously by loading area data from backend
   * @param {Function} callback - Called for each loaded area
   * @returns {Promise<Array>} Promise resolving when all areas are loaded
   */
  async initializeAsync(callback) {
    let promises = []
    for(let x = -1 ; x < 2 ; x++) {
      for(let y = -1 ; y < 2 ; y++) {
        promises.push(this.loadAreaAsync(x, y, callback));
      }
    }

    return Promise.all(promises);
  }

  /**
   * Load an area asynchronously from backend
   * @param {Number} x - Area X coordinate
   * @param {Number} y - Area Y coordinate
   * @param {Function} callback - Called when area is loaded
   * @returns {Promise<Area>} The loaded area
   */
  async loadAreaAsync(x, y, callback) {
    if(!this.areaExistsAt(x, y)) {

      const area = this.createAreaAt(x, y);
      return this._application.fetchArea(x, y).then(data => {
        data.forEach(descriptor => {

          const element = this._application.instantiate(descriptor.element);

          if(element !== false) {
            area.addElement(
              descriptor.x,
              descriptor.y,
              element,
              descriptor.name,
            );
          }
        });
        callback(area);
        return area;
      });
    }
    return this.areas[x][y];
  }


  loadArea(x, y) {
    if(!this.areaExistsAt(x, y)) {
      const area = this.createAreaAt(x, y);

      this.getRenderer().update();

      return area;
    }

    return this.areas[x][y];
  }

  getAreaAt(x, y) {
    if(!this.areaExistsAt(x, y)) {
      this.loadArea(x, y);
    }

    return this.areas[x][y];
  }

  freeArea(x, y) {
    if(!this.areaExistsAt(x, y)) {
      return false;
    }
    const area = this.areas[x][y];
    area.getRenderer().clear();
    delete this.areas[x][y];

    return area;
  }

  areaExistsAt(x, y) {
    if(typeof(this.areas[x]) === 'undefined') {
      return false;
    }
    if(typeof(this.areas[x][y]) === 'undefined') {
      return false;
    }
    return true;
  }

  createAreaAt(x, y) {
    if(typeof(this.areas[x]) === 'undefined') {
      this.areas[x] = {};
    }
    if(typeof(this.areas[x][y]) === 'undefined') {
      this.areas[x][y] = {};
    }
    const area = new Area(this, x , y);
    this.areas[x][y] = area;
    this.addElement(x * this.width(), y * this.height(), area);
    return this.areas[x][y];
  }

  getAreas() {
    return this.areas;
  }
}


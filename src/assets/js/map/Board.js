class Board extends Element
{
  _areas = {};

  constructor(viewport) {
    super(0, 0, viewport.width(), viewport.height());
    this._viewport = viewport;
    this._application = viewport.getApplication();

    this.renderer = new BoardRenderer(this);
  }

  initialize() {
    for(let x = -1 ; x < 2 ; x++) {
      for(let y = -1 ; y < 2 ; y++) {
        this.createAreaAt(x, y);
      }
    }
  }

  clear() {
    super.clear();
    this.renderer.clear();
    Object.keys(this._areas).map(x => {
      Object.keys(this._areas[x]).map(y => {
        this._areas[x][y].clear();
      });
    });
    this.render();
  }

  async initializeAsync(callback) {
    let promises = []
    for(let x = -1 ; x < 2 ; x++) {
      for(let y = -1 ; y < 2 ; y++) {
        promises.push(this.loadAreaAsync(x, y, callback));
      }
    }

    return Promise.all(promises);
  }

  async loadAreaAsync(x, y, callback) {
    if(!this.areaExistsAt(x, y)) {

      const area = this.createAreaAt(x, y);
      return this._application.fetchArea(x, y).then(data => {
        data.forEach(descriptor => {

          const element = this._application.instanciate(descriptor.element);

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
    return this._areas[x][y];
  }


  update(timestamp) {
    super.update(timestamp);
    Object.keys(this._areas).map(x => {
      Object.keys(this._areas[x]).map(y => {
        this._areas[x][y].update(timestamp);
      });
    });
    this.render();
  }


  loadArea(x, y) {
    if(!this.areaExistsAt(x, y)) {
      const area = this.createAreaAt(x, y);

      this.getRenderer().update();

      return area;
    }

    return this._areas[x][y];
  }

  getAreaAt(x, y) {
    if(!this.areaExistsAt(x, y)) {
      this.loadArea(x, y);
    }

    return this._areas[x][y];
  }

  freeArea(x, y) {
    if(!this.areaExistsAt(x, y)) {
      return false;
    }
    const area = this._areas[x][y];
    area.getRenderer().clear();
    delete this._areas[x][y];

    return area;
  }

  areaExistsAt(x, y) {
    if(typeof(this._areas[x]) === 'undefined') {
      return false;
    }
    if(typeof(this._areas[x][y]) === 'undefined') {
      return false;
    }
    return true;
  }

  createAreaAt(x, y) {
    if(typeof(this._areas[x]) === 'undefined') {
      this._areas[x] = {};
    }
    if(typeof(this._areas[x][y]) === 'undefined') {
      this._areas[x][y] = {};
    }
    const area = new Area(this, x , y);
    this._areas[x][y] = area;
    this.addElement(x * this.width(), y * this.height(), area);
    return this._areas[x][y];
  }

  getAreas() {
    return this._areas;
  }
}


class Draggable {

  startX = 0;
  startY = 0;
  element = null;

  dragStarted = false;


  _listeners = {};



  constructor(element) {
    this.element = element;

    this.element.classList.add('draggable')

    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  onContextMenu(e) {
    this.handle('contextmenu', e);
  }

  onMouseDown(e) {
    let offsetX = this.element.offsetLeft;
    let offsetY = this.element.offsetTop;
    this.startX = e.clientX - offsetX;
    this.startY = e.clientY - offsetY;

    this.dragStarted = true;

    this.handle('mouseDown', e);
  }

  onMouseMove(e) {
    if(!this.dragStarted) {
      return;
    }

    const newPosX = e.clientX - this.startX;
    const newPosY = e.clientY - this.startY;

    this.element.style.left = newPosX + 'px';
    this.element.style.top = newPosY + 'px';

    this.handle('mouseMove', e);
  }


  onMouseUp(e) {
    this.dragStarted = false;
    this.handle('mouseUp', e);
  }

  // ===========================

  addEventListener(name, callback) {
    if(typeof(this._listeners[name]) === 'undefined') {
      this._listeners[name] = [];
    }
    this._listeners[name].push(callback);

    return this._listeners[name].length - 1;
  }

  handle(name, data = {}) {
    if(typeof(this._listeners[name]) !== 'undefined') {
      this._listeners[name].map(callback => {
        callback(data);
      });
    }
  }
}

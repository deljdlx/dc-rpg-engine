class Editor
{


  selectedSprite = 'Tree00';
  application;

  spritePanel;

  spriteContainers = [];

  currentArea;

  constructor(application) {

    this.application = application;


    this.spritePanel = document.querySelector('#sprite-panel');

    this.initializeSpritePanel();
    this.initializeAreaEvents();
    this.initializeMap();

  }

  initializeSpritePanel() {
    this.application.getRegisteredElements().forEach(elementName => {
      this.registerSprite(elementName);
    });
  }

  registerSprite(spriteName) {
    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('editor-sprite-container');

    const sprite = this.application.instantiate(spriteName);
    const element = sprite.render();
    spriteContainer.style.width = sprite.getBoundingBox().width() + 'px';
    spriteContainer.style.height = sprite.getBoundingBox().height() + 'px';
    spriteContainer.append(element);

    sprite.getAllChildren().forEach(child => {
      element.append(child.render());
    });

    spriteContainer.addEventListener('click', () => {
      this.selectedSprite = spriteName;
      this.spriteContainers.forEach(spriteContainer => {
        spriteContainer.classList.remove('selected');
      });
      spriteContainer.classList.add('selected');
    });

    this.spriteContainers.push(spriteContainer);
    this.spritePanel.append(spriteContainer);

  }

  generateUUID() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
      uuid += Math.floor(Math.random() * 16).toString(16);
    }
    uuid =
      uuid.substr(0, 8) +
      "-" +
      uuid.substr(8, 4) +
      "-" +
      uuid.substr(12, 4) +
      "-" +
      uuid.substr(16, 4) +
      "-" +
      uuid.substr(20, 12);
    return uuid;
  }



  initializeAreaEvents() {

    this.application.addEventListener('area.click', (event) => {
      const area = event.area;
      this.currentArea = area;


      const sprite = this.application.instantiate(this.selectedSprite);

      const x = event.areaX - sprite.width() / 2;
      const y = event.areaY - sprite.height() / 2;

      const element = area.addElement(
        x,
        y,
        sprite,
        this.generateUUID(),
      );

      area.getBoard().getRenderer().update();
      this.makeElementEditable(element);
      this.saveArea(area);
    });
  }

  initializeMap() {
    const viewport = this.application.getViewport();
    const board = viewport.getBoard();

    const areas = board.getAreas();

    for(let x in areas) {
      for(let y in areas[x]) {
        const area = areas[x][y];

        const elements = area.getChildren();
        elements.forEach(element => {
          this.makeElementEditable(element);
        });
      }
    }
  }

  makeElementEditable(element) {

    const draggable = new DraggableElement(element);
    draggable.addEventListener('mouseUp', data => {
      this.saveArea(element.getParent());
    });

    draggable.addEventListener('contextmenu', (data) => {
      data.event.preventDefault();
      data.element.destroy();
      this.saveArea(element.getParent());
    });

  }

  async saveArea(area) {

    const url = './backend/save.php';
    const data = {
      data: area.toJSON(),
      x: area.getCoordX(),
      y: area.getCoordY(),
    };


    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  }


}


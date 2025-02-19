class DockerNetworkViewer
{
  viewport;

  cellWidth = 150;
  cellHeight = 150;
  layoutWidth = window.innerWidth;
  layoutHeight = window.innerHeight;
  layoutMatrix = [];


  roadWidth = 50;
  roadHeight = 50;

  xCells = 0;
  yCells = 0;


  constructor(viewport) {
    this.viewport = viewport;
    // this.xCells = Math.ceil(this.layoutWidth / this.cellWidth);
    // this.yCells = Math.ceil(this.layoutHeight / this.cellHeight);

    this.xCells = 15;
    this.yCells = 15;

    const roadElement = new Ground00();
    this.roadWidth = roadElement.width();
    this.roadHeight = roadElement.height();

  }

  initContainersMatrix()  {
    let layoutMatrix = [];
    for (let x = 0; x < this.xCells; x++) {
      layoutMatrix[x] = [];
      for (let y = 0; y < this.yCells; y++) {
        layoutMatrix[x][y] = [];
      }
    }

    return layoutMatrix;
  };

  drawContainersMatrix() {
    const area = this.viewport.getBoard().getAreaAt(0, 0);

    for(let x = 0 ; x < this.xCells; x++) {
      for(let y = 0 ; y < this.yCells; y++) {
        const cell = document.createElement('div');
        cell.style.width = this.cellWidth + 'px';
        cell.style.height = this.cellHeight + 'px';
        cell.style.position = 'absolute';
        cell.style.left = x * this.cellWidth + 'px';
        cell.style.top = y * this.cellHeight + 'px';
        cell.style.border = '1px solid #f0f';
        cell.style.backgroundColor = 'rgba(0,0,0,0.1)';
        // cell.style.zIndex = 1000;

        cell.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
            ${x} - ${y}
          </div>
        `;
        area.getDom().appendChild(cell);
      }
    }
  }

  drawContainers(containers) {
    const board = this.viewport.getBoard();
    const area = board.getAreaAt(0, 0);

    const layoutMatrix = this.initContainersMatrix();

    let minX = BigInt(Number.MAX_SAFE_INTEGER);
    let minY = BigInt(Number.MAX_SAFE_INTEGER);
    let maxX = BigInt(Number.MIN_SAFE_INTEGER);
    let maxY = BigInt(Number.MIN_SAFE_INTEGER);


    containers.map((container, index) => {
      let containerId = container.Id;
      let containerLeft = BigInt('0x' + containerId.substring(0,32))
      let containerRight = BigInt('0x' + containerId.substring(32,64));
      minX = containerLeft < minX ? containerLeft : minX;
      minY = containerRight < minY ? containerRight : minY;
      maxX = containerLeft > maxX ? containerLeft : maxX;
      maxY = containerRight > maxY ? containerRight : maxY;
    });

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    containers.map((container, index) => {
      let containerId = container.Id;
      let containerLeft = BigInt('0x' + containerId.substring(0,32)) - minX;
      let containerTop = BigInt('0x' + containerId.substring(32,64)) - minY;

      let x = Number((containerLeft * BigInt(this.xCells)) / rangeX);
      let y = Number((containerTop * BigInt(this.yCells)) / rangeY);

      x = Math.min(x, this.xCells - 1);
      y = Math.min(y, this.yCells - 1);

      let tryCount = 0;
      while(layoutMatrix[x][y].length > 0 && tryCount < (x * y)) {
        if(tryCount % 4 === 0) {
          x += 1;
        }
        else if(tryCount % 4 == 1) {
          y += 1;
        }
        else if(tryCount % 4 == 2) {
          x -= 1;
        }
        else if(tryCount % 4 == 3) {
          y -= 1;
        }
        tryCount++;
      }

      let house = area.addElement(
        x * this.cellWidth,
        y * this.cellHeight,
        new House00()
      );

      if(!container.rpgEngine) {
        container.rpgEngine = {
          data: {
            element: house,
            coords: {
              x: x,
              y: y,
            }
          },
        };
      }

      house.addClass('state--' + container.State)
      house.setInnerHTML(`
        <div class="docker-container-name">
          ${container.Names[0]}
        </div>
      `);
      house.data.container = container;

      layoutMatrix[x][y].push(house);
    });

    this.drawRoads(containers);

    this.viewport.render();
  }


  drawRoads(containers) {

    const networks = {};

    containers.map((container, index) => {
      let containerNetWorks = container.NetworkSettings.Networks;
      containerNetWorks = Object.keys(containerNetWorks).map((networkName) => {
        if(!networks[networkName]) {
          networks[networkName] = [];
        }
        networks[networkName].push(container);
      });
    });


    let hasElementMatrix = {};

    Object.keys(networks).map((networkName) => {
      const connectedCells = [];
      networks[networkName].map((container, index) => {
        connectedCells.push(container.rpgEngine.data.coords);
      });

      const area = this.viewport.getBoard().getAreaAt(0, 0);
      let from = connectedCells[0];
      let fromContainer = networks[networkName][0];
      let offsetLeft = fromContainer.rpgEngine.data.element.width() / 2;
      let offsetTop = fromContainer.rpgEngine.data.element.height();

      for(let i = 1 ; i < connectedCells.length ; i++) {

        const toContainer = networks[networkName][i];
        let to = connectedCells[i];

        let xFromInPixels = from.x * this.cellWidth;
        let yFromInPixels = from.y * this.cellHeight;

        let xToInPixels = to.x * this.cellWidth;
        let yToInPixels = to.y * this.cellHeight;

        let xDiff = xToInPixels - xFromInPixels;
        let yDiff = yToInPixels - yFromInPixels;

        let xDirection = xDiff > 0 ? 1 : -1;
        let yDirection = yDiff > 0 ? 1 : -1;

        let currentRoadX = xFromInPixels;
        let currentRoadY = yFromInPixels;

        let noLockX = 0
        while (Math.abs(currentRoadX - xToInPixels) > this.roadWidth) {
          const key = currentRoadX + ':' + currentRoadY
          if(noLockX > 100) {
            console.error('loop detected on X');
            break;
          }
          noLockX++;

          const road = this.drawRoad(
            networkName,
            currentRoadX + offsetLeft,
            currentRoadY + offsetTop,
          )
          currentRoadX += this.roadWidth * xDirection;
          hasElementMatrix[key] = true;
        }

        let noLockY = 0
        while(Math.abs(currentRoadY - yToInPixels) >= this.roadHeight) {
          const key = currentRoadX + ':' + currentRoadY
          if(noLockY > 100) {
            console.error('loop detected on Y');
            break;
          }
          noLockY++;

          const road = this.drawRoad(
            networkName,
            currentRoadX + offsetLeft,
            currentRoadY + offsetTop,
          )

          currentRoadY += this.roadHeight * yDirection;
          hasElementMatrix[key] = true;
        }

        if(yDirection < 1) {
          const key = currentRoadX + ':' + currentRoadY
          const road = area.addElement(
            currentRoadX + offsetLeft,
            currentRoadY + offsetTop,
            new Ground00()
          );
          road.addClass('network');
          road.addClass('network--' + networkName);
          hasElementMatrix[key] = true;
        }
        from = connectedCells[i];
      }
    });
  };

  drawHorizontalRoads(networkName, fromX, toX, offsetLeft, offsetTop) {
    let noLockX = 0
    while (Math.abs(fromX - toX) > this.roadWidth) {
      if(noLockX > 100) {
        console.error('loop detected on X');
        break;
      }
      noLockX++;

      const road = area.addElement(
        currentRoadX + offsetLeft,
        currentRoadY + offsetTop,
        new Ground00()
      );
      road.addClass('network');
      road.addClass('network--' + networkName);
      currentRoadX += this.roadWidth * xDirection;
    }
  }

  drawRoad(networkName, x, y) {
    const area = this.viewport.getBoard().getAreaAt(0, 0);
    const road = area.addElement(
      x,
      y,
      new Ground00()
    );
    road.addClass('network');
    road.addClass('network--' + networkName);
    return road;
  }
}


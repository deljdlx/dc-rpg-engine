class DockerNetworkViewer
{
  application;
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

  memoryUsageThresholds = [
    {thresholds: 4 * 1024 *1024, caption: '4mb', humanCaption: 'xxs'},
    {thresholds: 8 * 1024 *1024, caption: '8mb', humanCaption: 'xs'},
    {thresholds: 16 * 1024 *1024, caption: '16mb', humanCaption: 's'},
    {thresholds: 32 * 1024 *1024, caption: '32mb', humanCaption: 'm'},
    {thresholds: 64 * 1024 *1024, caption: '64mb', humanCaption: 'xm'},
    {thresholds: 128 * 1024 *1024, caption: '128mb', humanCaption: 'xxm'},
    {thresholds: 256 * 1024 *1024, caption: '256mb', humanCaption: 'l'},
    {thresholds: 512 * 1024 *1024, caption: '512mb', humanCaption: 'xl'},
    {thresholds: 1024 * 1024 *1024, caption: '1024mb', humanCaption: 'xxl'},
    {thresholds: 2048 * 1024 *1024, caption: '2048mb', humanCaption: 'xxxl'},
  ]


  constructor(application, viewport) {
    this.application = application;
    this.viewport = viewport;

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

  getMemoryThreshold(usage) {
    let thresholdIndex = 0;
    this.memoryUsageThresholds.map((threshold) => {
      if(usage < threshold.thresholds) {
        return threshold;
      }
      thresholdIndex++;
    });

    return this.memoryUsageThresholds[thresholdIndex] ?? this.memoryUsageThresholds[this.memoryUsageThresholds.length - 1];
  }

  async drawContainers(containers) {
    const layoutMatrix = this.initContainersMatrix();

    let minX = BigInt(Number.MAX_SAFE_INTEGER);
    let minY = BigInt(Number.MAX_SAFE_INTEGER);
    let maxX = BigInt(Number.MIN_SAFE_INTEGER);
    let maxY = BigInt(Number.MIN_SAFE_INTEGER);


    Object.values(containers).map((container) => {
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

    const handledContainers = {};

    Object.values(containers).map(async (container) => {
      if(handledContainers[container.Id]) {
        return;
      }

      // let containerId = container.Id;
      // let containerLeft = BigInt('0x' + containerId.substring(0,32)) - minX;
      // let containerTop = BigInt('0x' + containerId.substring(32,64)) - minY;

      // let x = Number((containerLeft * BigInt(this.xCells)) / rangeX);
      // let y = Number((containerTop * BigInt(this.yCells)) / rangeY);

      // x = Math.min(x, this.xCells - 1);
      // y = Math.min(y, this.yCells - 1);

      const {x, y} = this.computeContainerCoords(
        container,
        minX,
        minY,
        maxX,
        maxY,
      );


      const composeName = container.getComposeName();
      if(composeName && 0) {
        const compose = this.application.getCompose(composeName);
        if(compose) {
          const friendContainers = compose.getContainers();

          if(Object.values(friendContainers).length > 1) {
            this.drawHouseGroup(layoutMatrix, friendContainers, x, y);
            return;
          }
        }
      }

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
      const house = await this.drawHouse(container, x, y);
      // house.addClass('smoke');
      layoutMatrix[x][y].push(house);
    });
  }

  computeContainerCoords(container, minX, minY, maxX, maxY) {
    let containerId = container.Id;
    let containerLeft = BigInt('0x' + containerId.substring(0,32)) - minX;
    let containerTop = BigInt('0x' + containerId.substring(32,64)) - minY;

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    let x = Number((containerLeft * BigInt(this.xCells)) / rangeX);
    let y = Number((containerTop * BigInt(this.yCells)) / rangeY);

    x = Math.min(x, this.xCells - 1);
    y = Math.min(y, this.yCells - 1);

    return {x, y};
  }

  async drawHouseGroup(layoutMatrix, containers) {

  }

  async drawHouse(container, x, y) {
    const board = this.viewport.getBoard();
    const area = board.getAreaAt(0, 0);

    let house = area.addElement(
      x * this.cellWidth,
      y * this.cellHeight,
      new House00()
    );

    container.setRpgEngineData({
      element: house,
      coords: {
        x: x,
        y: y,
      }
    });

    const stats = await this.application.getContainerStats(container.Id);

    const memoryUsage = stats.memory_stats.usage;
    if(memoryUsage) {
      const memoryThreshold = this.getMemoryThreshold(memoryUsage);
      house.addClass('memory--' + memoryThreshold.humanCaption);
      house.addClass('memory--' + memoryThreshold.caption);
    }

    house.addClass('container');
    for(let networkName in container.NetworkSettings.Networks) {
      house.addClass('network--' + networkName);
    }

    house.addClass('state--' + container.State)
    house.setInnerHTML(`
      <div class="docker-container-name">
        ${container.Names[0]}
      </div>
    `);
    house.data.container = container;

    return house;
  }


  drawRoads(containers) {

    const networks = {};

    Object.values(containers).map((container, index) => {
      let containerNetWorks = container.NetworkSettings.Networks;
      containerNetWorks = Object.keys(containerNetWorks).map((networkName) => {
        if(!networks[networkName]) {
          networks[networkName] = [];
        }
        networks[networkName].push(container);
      });
    });


    const roadsMatrix = {};

    Object.keys(networks).map((networkName) => {
      const connectedCells = [];
      networks[networkName].map((container, index) => {
        connectedCells.push(container.rpgEngine.data.coords);
      });

      if(!networks[networkName][0]) {
        return;
      }

      let from = connectedCells[0];
      let fromContainer = networks[networkName][0];
      if(!fromContainer.rpgEngine.data.element) {
        return;
      }

      let offsetLeft = fromContainer.rpgEngine.data.element.width() / 2;
      let offsetTop = fromContainer.rpgEngine.data.element.height();


      for(let i = 1 ; i < connectedCells.length ; i++) {
        if(!networks[networkName][i]) {
          continue;
        }
        const toContainer = networks[networkName][i];
        let to = connectedCells[i];

        let xFromInPixels = from.x * this.cellWidth;
        let yFromInPixels = from.y * this.cellHeight;

        let xToInPixels = to.x * this.cellWidth;
        let yToInPixels = to.y * this.cellHeight;

        xFromInPixels = this.drawHorizontalRoads(
          networkName,
          xFromInPixels, xToInPixels,
          yFromInPixels,
          offsetLeft, offsetTop,
          roadsMatrix
        );

        this.drawHVerticalRoads(
          networkName,
          yFromInPixels, yToInPixels,
          xFromInPixels,
          offsetLeft, offsetTop,
          roadsMatrix
        )
        from = connectedCells[i];
      }
    });

    this.drawRoadTrees(roadsMatrix);
  };

  drawRoadTrees(matrix) {
    const area = this.viewport.getBoard().getAreaAt(0, 0);

    const width = this.roadWidth;
    const height = this.roadHeight;

    Object.keys(matrix).map((x) => {
      Object.keys(matrix[x]).map((y) => {
        const road = matrix[x][y];

        if(Math.random() > 0.8) {
          if(
            (matrix[x + width] && matrix[x + width][y])
            || (matrix[x -width] && matrix[x - width][y])

            // || (matrix[x + width] && matrix[x + width][y - height]) ||
            // || (matrix[x + width] && matrix[x + width][y]) ||
            // || (matrix[x + width] && matrix[x + width][y + height]) ||

            // || (matrix[x - width] && matrix[x - width][y - height]) ||
            // || (matrix[x - width] && matrix[x - width][y]) ||
            // || (matrix[x - width] && matrix[x - width][y + height])
          ){
            return;
          }
          const tree = area.addElement(
            parseInt(x),
            parseInt(y) + height * 2,
            new Tree00()
          );
        }
      });
    });
  }

  drawHorizontalRoads(
    networkName,
    xFromInPixels, xToInPixels,
    yFromInPixels,
    offsetLeft, offsetTop,
    roadsMatrix
  ) {
    let xDiff = xToInPixels - xFromInPixels;
    let xDirection = xDiff > 0 ? 1 : -1;

    let noLockX = 0
    while (Math.abs(xFromInPixels - xToInPixels) > this.roadWidth) {
      if(noLockX > 100) {
        console.error('loop detected on X');
        break;
      }
      noLockX++;
      const road = this.drawRoad(
        networkName,
        xFromInPixels + offsetLeft,
        yFromInPixels + offsetTop,
      )

      if(!roadsMatrix[xFromInPixels]) {
        roadsMatrix[xFromInPixels] = {};
      }
      roadsMatrix[xFromInPixels][yFromInPixels] = road;

      xFromInPixels += this.roadWidth * xDirection;
    }
    return xFromInPixels;
  }

  drawHVerticalRoads(
    networkName,
    yFromInPixels, yToInPixels,
    xFromInPixels,
    offsetLeft, offsetTop,
    roadsMatrix
  ) {
    let yDiff = yToInPixels - yFromInPixels;
    let yDirection = yDiff > 0 ? 1 : -1;


    let noLockY = 0
    while(Math.abs(yFromInPixels - yToInPixels) >= this.roadHeight) {
      if(noLockY > 100) {
        console.error('loop detected on Y');
        break;
      }
      noLockY++;

      const road = this.drawRoad(
        networkName,
        xFromInPixels + offsetLeft,
        yFromInPixels + offsetTop,
      )

      if(!roadsMatrix[xFromInPixels]) {
        roadsMatrix[xFromInPixels] = {};
      }
      roadsMatrix[xFromInPixels][yFromInPixels] = road;

      yFromInPixels += this.roadHeight * yDirection;
    }

    if(yDirection < 1) {
      const road = this.drawRoad(
        networkName,
        xFromInPixels + offsetLeft,
        yFromInPixels + offsetTop,
      )
      if(!roadsMatrix[xFromInPixels]) {
        roadsMatrix[xFromInPixels] = [];
      }
      roadsMatrix[xFromInPixels][yFromInPixels] = road;
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


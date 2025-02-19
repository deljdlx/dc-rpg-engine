


document.addEventListener('DOMContentLoaded', async () => {

  const MAP_CONFIGURATION = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // zoom / unzoom on mouse wheel
  document.querySelector('#viewport').addEventListener('wheel', (event) => {
    const firstChild = document.querySelector('#viewport').firstElementChild;
    if(!firstChild) {
      return;
    }

    const scale = firstChild.style.transform.match(/scale\((.*)\)/);
    let currentScale = 1;

    if(scale) {
      currentScale = parseFloat(scale[1]);
    }

    if(event.deltaY > 0) {
      firstChild.style.transform = `scale(${parseFloat(currentScale) - 0.05})`;
    } else {
      firstChild.style.transform = `scale(${parseFloat(currentScale) + 0.05})`;
    }
  });


  document.querySelector('#viewport').addEventListener('mousedown', (event) => {
    const firstChild = document.querySelector('#viewport').firstElementChild;
    if (!firstChild) {
        return;
    }

    const offsetX = event.clientX - firstChild.offsetLeft;
    const offsetY = event.clientY - firstChild.offsetTop;

    function onMouseMove(event) {
        firstChild.style.left = (event.clientX - offsetX) + 'px';
        firstChild.style.top = (event.clientY - offsetY) + 'px';
    }

    document.body.addEventListener('mousemove', onMouseMove);

    document.body.addEventListener('mouseup', () => {
        document.body.removeEventListener('mousemove', onMouseMove);
    }, { once: true }); // Supprime `mouseup` après un seul appel
});





  const application = new Application(
    '#viewport',
    MAP_CONFIGURATION.width,
    MAP_CONFIGURATION.height,
  );


  application.registerElement('FenceGroup00', FenceGroup00);
  application.registerElement('House00', House00);
  application.registerElement('House01', House01);
  application.registerElement('Fountain00', Fountain00);

  application.registerElement('Woman00', Woman00);
  application.registerElement('Man00', Man00);

  application.registerElement('Flower00', Flower00);
  application.registerElement('Tree00', Tree00);
  application.registerElement('Sunflower00', Sunflower00);
  application.registerElement('Ground00', Ground00);



  const gameConsole = new GameConsole(application, '#game-console');
  gameConsole.addEntry('<em>Hello my friend, what can I do for you ?</em>');

  application.addEventListener('map.update', (event) => {
    // console.log(event);
  });


  application.addEventListener('element.collision', (event) => {
    event.target.getRenderer().getDom().classList.add('collided');
    event.target.getRenderer().getDom().classList.add('shake');
    setTimeout(() => {
      event.target.getRenderer().getDom().classList.remove('shake');
    }, 500);
    gameConsole.addEntry('collision');

    console.log(event.target);
  });


  application.addEventListener('element.click', (event) => {
    console.log(event.element.data.container);
  });



  application.addEventListener('element.collision.end', (event) => {
    event.target.getRenderer().getDom().classList.remove('collided');
  });

  application.addEventListener('element.trigger', (event) => {
    event.target.getRenderer().getDom().classList.add('collided');
  });

  application.addEventListener('element.trigger.end', (event) => {
    event.target.getRenderer().getDom().classList.remove('collided');
  });

  const viewport = application.getViewport();
  const board = viewport.getBoard();

  board.initialize();

  for(let i = 0; i < 50 ; i++) {

    const x = Math.random() * 1800;
    const y = Math.random() * window.innerHeight;

    const area = board.getAreaAt(0, 0);
    area.addElement(x, y, new Sunflower00());

  }

  viewport.render();
  viewport.run();

  const response = await fetch('/api/docker/containers/json?all=true');
  const containers = await response.json();
  let dockerViewer = new DockerNetworkViewer(viewport);
  dockerViewer.drawContainers(containers);
  // dockerViewer.drawContainersMatrix();
});



console.log('%cbootstrap.js :: 118 =============================', 'color: #f00; font-size: 1rem');
console.log("STARTED");






  /*
  board.initialize();
  const area = board.getAreaAt(0, 0);
  for(let i = 0 ; i < 8 ; i++) {
    area.addElement(384 - i * 50, 263, new Ground00());
  }

  area.addElement(300, 50, new House01());
  area.addElement(300, 300, new House01());
  area.addElement(50, 50, new FenceGroup00());
  area.addElement(200, 360, new Fountain00());
  area.addElement(100, 260, new Character(0, 0, 48 * 3));

  for(let x = 0 ; x < 20 ; x++) {
    area.addElement(
      70 + Math.random() * 200,
      60 + Math.random() * 150,
      new Sunflower00()
    );
  }
  */


  // viewport.render();
  // viewport.run();


  // application.run();

  /*
  const MAP_CONFIGURATION = {
    width: 400,
    height: 400,
  }

  const board = new Board(MAP_CONFIGURATION.width * 3, MAP_CONFIGURATION.height * 3);

  const area = board.getAreaAt(0, 0);


  for(let i = 0 ; i < 8 ; i++) {
    area.addElement(384 - i * 50, 263, new Ground00());
  }

  area.addElement(300, 50, new House01());
  area.addElement(300, 300, new House01());
  area.addElement(50, 50, new FenceGroup00());

  area.addElement(200, 360, new Fountain00());

  area.addElement(100, 260, new Character(0, 0, 48 * 3));


  for(let x = 0 ; x < 20 ; x++) {
    area.addElement(
      70 + Math.random() * 200,
      60 + Math.random() * 150,
      new Sunflower00()
    );
  }


  const viewport = new Viewport(
    document.querySelector('#viewport'),
    board,
    0,
    0,
    MAP_CONFIGURATION.width,
    MAP_CONFIGURATION.height,
  );
  viewport.render();
  viewport.run();
  */


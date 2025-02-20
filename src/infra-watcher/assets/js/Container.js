class Container
{

  rpgEngine = {
    data: {
      element: null,
      coords: {
        x: null,
        y: null,
      }
    },
  };


  constructor(descriptor) {
    Object.assign(this, descriptor);
  }

  setRpgEngineData(data) {
    this.rpgEngine.data = data;
  }

  getId() {
    return this.Id;
  }

  getLabel(label) {
    return this.Labels[label] ??  null;
  }

  getComposeName() {
    return this.getLabel('com.docker.compose.project')
  }
}
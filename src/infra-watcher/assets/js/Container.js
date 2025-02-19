class Container
{
  constructor(descriptor) {
    // merge descriptor with this
    Object.assign(this, descriptor);
  }
}
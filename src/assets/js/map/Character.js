class Character extends Element
{

  animationIndex = 0;
  direction;

  spriteSheetOffsetLeft = 0;
  spriteSheetOffsetTop = 0;


  tickInterval = 7;
  tick = 0;

  constructor(x = null, y = null, spriteSheetOffsetLeft = 0, spriteSheetOffsetTop = 0) {
    super(x, y, Constants.CHARACTER_WIDTH, Constants.CHARACTER_HEIGHT);

    this.spriteSheetOffsetLeft = spriteSheetOffsetLeft;
    this.spriteSheetOffsetTop = spriteSheetOffsetTop;

    this.createCollisionZone(
      Constants.CHARACTER_COLLISION_OFFSET_X,
      Constants.CHARACTER_COLLISION_OFFSET_Y,
      Constants.CHARACTER_COLLISION_WIDTH,
      Constants.CHARACTER_COLLISION_HEIGHT
    );
    this.setRenderer(new CharacterRenderer(this));
  }

  getSpriteSheetOffsetLeft() {
    return this.spriteSheetOffsetLeft;
  }

  getSpriteSheetOffsetTop() {
    return this.spriteSheetOffsetTop;
  }

  getDirection() {
    return this.direction;
  }

  getAnimationIndex() {
    return this.animationIndex;
  }

  update() {
    const tickInterval = Math.round(this.moveSpeed() / 80);
    this.tick = (++this.tick % tickInterval);
    if(this.tick === 0) {
      this.animationIndex = (++this.animationIndex % 3);
    }
    this.getRenderer().update();
  }

  setDirection(direction) {
    this.direction = direction;
  }

  quickReaction(content) {
    this.getRenderer()._domQuickReaction.innerHTML = content;
    this.getRenderer()._domQuickReaction.classList.add('quickReaction--enable');
    return this;
  }

  clearQuickReaction() {
    this.getRenderer()._domQuickReaction.innerHTML = '';
    this.getRenderer()._domQuickReaction.classList.remove('quickReaction--enable');
    return this;
  }
}

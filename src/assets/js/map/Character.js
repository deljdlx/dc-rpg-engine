class Character extends Element
{

  _isMain = false;
  _timestamp = 0 ;

  animationIndex = 0;
  direction;

  spriteSheetOffsetLeft = 0;
  spriteSheetOffsetTop = 0;


  tickInterval = 7;
  tick = 0;

  constructor(x = null, y = null, spriteSheetOffsetLeft = 0, spriteSheetOffsetTop = 0) {
    super(x, y, 48, 48);

    this.spriteSheetOffsetLeft = spriteSheetOffsetLeft;
    this.spriteSheetOffsetTop = spriteSheetOffsetTop;

    this.createCollisionZone(16, 24, 14, 12);
    this.setRenderer(new CharacterRenderer(this));
  }

  isMain(value = null) {
    if(value === null) {
      return this._isMain;
    }
    else {
      this._isMain = value;
    }
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

  update(timestamp) {
    if(!this._timestamp) {
      this._timestamp = timestamp;
    }

    const tickInterval = Math.round(1000 / this.moveSpeed() / 2);
    this.tick = (++this.tick % tickInterval);
    if(this.tick === 0) {
      this.animationIndex = (++this.animationIndex % 3);
    }

    if(this.isMoving() && this.y() < this._targetY) {
      this.direction = 'down';
      this.y(this.y() + this.moveSpeed());
    }
    else if(this.isMoving() && this.x() < this._targetX) {
      this.direction = 'right';
      this.x(this.x() + this.moveSpeed());
    }


    if(this.isMoving()) {
      this.needUpdate(true);
      if(
        Math.abs(this._targetX - this.x()) <= this._targetHitZone
        && Math.abs(this._targetY - this.y()) <= this._targetHitZone
        && this.isMoving()
      ) {
        this._moving = false;
        this._onMoveEnd(this);
      }
    }

    super.update(timestamp);
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
    console.log('%cCharacter.js :: 62 =============================', 'color: #f00; font-size: 1rem');
    console.log("ICI");
    return this;
  }
}

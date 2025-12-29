/**
 * Character - Represents a character in the game world
 * Handles character rendering, animation, and collision
 */
class Character extends Element
{

  animationIndex = 0;
  direction;

  spriteSheetOffsetLeft = 0;
  spriteSheetOffsetTop = 0;


  tickInterval = 7;
  tick = 0;

  /**
   * Create a new character
   * @param {Number|null} x - Initial X position
   * @param {Number|null} y - Initial Y position
   * @param {Number} spriteSheetOffsetLeft - Sprite sheet X offset
   * @param {Number} spriteSheetOffsetTop - Sprite sheet Y offset
   */
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

  /**
   * Get sprite sheet left offset
   * @returns {Number}
   */
  getSpriteSheetOffsetLeft() {
    return this.spriteSheetOffsetLeft;
  }

  /**
   * Get sprite sheet top offset
   * @returns {Number}
   */
  getSpriteSheetOffsetTop() {
    return this.spriteSheetOffsetTop;
  }

  /**
   * Get current movement direction
   * @returns {String|undefined} Direction ('up', 'down', 'left', 'right')
   */
  getDirection() {
    return this.direction;
  }

  /**
   * Get current animation frame index
   * @returns {Number}
   */
  getAnimationIndex() {
    return this.animationIndex;
  }

  /**
   * Update character animation
   */
  update() {
    const tickInterval = Math.round(this.moveSpeed() / 80);
    this.tick = (++this.tick % tickInterval);
    if(this.tick === 0) {
      this.animationIndex = (++this.animationIndex % 3);
    }
    this.getRenderer().update();
  }

  /**
   * Set character movement direction
   * @param {String} direction - Direction to face ('up', 'down', 'left', 'right')
   */
  setDirection(direction) {
    this.direction = direction;
  }

  /**
   * Display a quick reaction message above character
   * @param {String} content - HTML content to display
   * @returns {Character} This character for chaining
   */
  quickReaction(content) {
    this.getRenderer()._domQuickReaction.innerHTML = content;
    this.getRenderer()._domQuickReaction.classList.add('quickReaction--enable');
    return this;
  }

  /**
   * Clear the quick reaction message
   * @returns {Character} This character for chaining
   */
  clearQuickReaction() {
    this.getRenderer()._domQuickReaction.innerHTML = '';
    this.getRenderer()._domQuickReaction.classList.remove('quickReaction--enable');
    return this;
  }
}

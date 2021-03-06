/**
 * Sets initial particle texture.
 *
 * @cat particles.modifiers
 * @extends Modifier
 */
/* @echo EXPORT */
class InitialTexture extends Modifier {
  /**
   * Creates new InitialTexture instance.
   *
   * @param {...(number|FloatScatter)} values Min and max indexes from texture list.
   */
  constructor(...values) {
    super();

    /** @type {FloatScatter} Modifier's object to get values from.  */
    this.scatter = FloatScatter.fromObject(...values);
  }

  /**
   * @inheritDoc
   */
  update(emitter, particle, dt) {
    particle.textureIndex = Math.round(this.scatter.getValue());
  }
}
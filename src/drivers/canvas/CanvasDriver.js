/**
 * Video driver responsible for rendering game objects onto HTML canvas element.
 *
 * @extends VideoNullDriver
 * @cat drivers.canvas
 */
/* @echo EXPORT */
class CanvasDriver extends VideoNullDriver {
  /**
   * Creates new instance of CanvasDriver
   *
   * @param {HTMLElement} containerElement The DOM element to draw into.
   * @param {number} width                 The width of the viewport.
   * @param {number} height                The height of the viewport.
   */
  constructor(containerElement, width, height) {
    super(containerElement, width, height);

    /** @private @type {CanvasRenderingContext2D} */
    this.mCtx = null;

    this.__createCanvas();

    /** @inheritDoc */
    this.mRendererMap = {
      DisplayObject: DisplayObjectRendererCanvas,
      Sprite: SpriteRendererCanvas,
      Emitter: EmitterRendererCanvas,
      Text: TextRendererCanvas,
      BitmapText: BitmapTextRendererCanvas,
      Graphics: GraphicsRendererCanvas
    };
  }

  /**
   * @inheritDoc
   */
  getRenderTarget(width, height) {
    return new RenderTargetCanvas(width, height);
  }

  /**
   * @ignore
   * @private
   * @return {void}
   */
  __createCanvas() {
    let scale = this.mStageScaleFactor;

    let cvs = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    cvs.style.position = 'absolute';
    cvs.id = 'canvas';

    cvs.width = this.mClientWidth * scale;
    cvs.height = this.mClientHeight * scale;
    cvs.style.width = this.mClientWidth + 'px';
    cvs.style.height = this.mClientHeight + 'px';

    this.mContainerElement.appendChild(cvs);

    this.mCtx = /** @type {CanvasRenderingContext2D} */ (cvs.getContext('2d'));
  }

  /**
   * @ignore
   * @private
   * @param {Message} msg
   * @param {Rectangle} rect
   * @returns {void}
   */
  __onResize(msg, rect) {
    super.__onResize(msg, rect);

    // canvas will reset state after changing size
    this.mGlobalBlendMode = null;
    this.mGlobalAlpha = -1;

    let scale = this.mStageScaleFactor;
    this.mCtx.canvas.width = this.mClientWidth * scale;
    this.mCtx.canvas.height = this.mClientHeight * scale;
    this.mCtx.canvas.style.width = this.mClientWidth + 'px';
    this.mCtx.canvas.style.height = this.mClientHeight + 'px';
  }

  /**
   * @inheritDoc
   */
  drawTexture(texture) {
    if (texture.isValid === false)
      return;

    let scale = this.mStageScaleFactor;

    let sourceX = texture.region.x;
    let sourceY = texture.region.y;
    let sourceWidth = texture.region.width;
    let sourceHeight = texture.region.height;

    let destX = texture.untrimmedRegion.x * scale;
    let destY = texture.untrimmedRegion.y * scale;
    let destWidth = texture.renderWidth * scale;
    let destHeight = texture.renderHeight * scale;

    this.mCtx.drawImage(texture.native, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
  }

  /**
   * @inheritDoc
   */
  drawTextureWithOffset(texture, ox, oy) {
    if (texture.isValid === false)
      return;

    let scale = this.mStageScaleFactor;

    let sourceX = texture.region.x;
    let sourceY = texture.region.y;
    let sourceWidth = texture.region.width;
    let sourceHeight = texture.region.height;

    let destX = (ox + texture.untrimmedRegion.x) * scale;
    let destY = (oy + texture.untrimmedRegion.y) * scale;
    let destWidth = texture.renderWidth * scale;
    let destHeight = texture.renderHeight * scale;

    this.mCtx.drawImage(texture.native, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
  }

  /**
   * @inheritDoc
   */
  beginClip(clipRect, px, py) {
    let r = this.mStageScaleFactor;

    this.mCtx.save();
    this.mCtx.beginPath();
    this.mCtx.rect((clipRect.x + px) * r, (clipRect.y + py) * r, clipRect.width * r, clipRect.height * r);

    this.mCtx.clip();
  }

  /**
   * @inheritDoc
   */
  endClip() {
    this.mCtx.restore();
  }

  /**
   * @inheritDoc
   */
  setTransform(m) {
    const v = m.value;

    Debug.assert(!isNaN(v[0]), 'a-element cannot be NaN');
    Debug.assert(!isNaN(v[1]), 'b-element cannot be NaN');
    Debug.assert(!isNaN(v[2]), 'c-element cannot be NaN');
    Debug.assert(!isNaN(v[3]), 'd-element cannot be NaN');
    Debug.assert(!isNaN(v[4]), 'tx-element cannot be NaN');
    Debug.assert(!isNaN(v[5]), 'ty-element cannot be NaN');

    this.mTransform = m;

    let scale = this.mStageScaleFactor;

    if (this.mSnapToPixels === true)
      this.mCtx.setTransform(v[0], v[1], v[2], v[3], (v[4] * scale) | 0, (v[5] * scale) | 0);
    else
      this.mCtx.setTransform(v[0], v[1], v[2], v[3], v[4] * scale, v[5] * scale);

  }

  /**
   * @inheritDoc
   */
  set globalAlpha(value) {
    if (value == this.mGlobalAlpha)
      return;

    this.mGlobalAlpha = value;
    this.mCtx.globalAlpha = value;
  }

  /**
   * @inheritDoc
   */
  set globalBlendMode(blendMode) {
    if (blendMode === BlendMode.AUTO)
      return;

    blendMode = CanvasBlendMode[blendMode];

    if (this.mGlobalBlendMode === blendMode)
      return;

    this.mGlobalBlendMode = blendMode;
    this.mCtx.globalCompositeOperation = blendMode;
  }

  /**
   * @inheritDoc
   */
  clear() {
    // TODO: clear only changed region
    this.mCtx.setTransform(1, 0, 0, 1, 0, 0);

    let viewport = Black.instance.viewport;
    if (viewport.isTransperent === false) {
      this.mCtx.fillStyle = VideoNullDriver.hexColorToString(viewport.backgroundColor);
      this.mCtx.fillRect(0, 0, this.mCtx.canvas.width, this.mCtx.canvas.height);
    } else {
      this.mCtx.clearRect(0, 0, this.mCtx.canvas.width, this.mCtx.canvas.height);
    }

    super.clear();
  }

  /**
   * @inheritDoc
   */
  getTextureFromCanvas(canvas) {
    return new Texture(canvas);
  }
}
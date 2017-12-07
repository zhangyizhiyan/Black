/**
 * This class is used to create display text.
 *
 * @cat display.text
 * @extends DisplayObject
 */
/* @echo EXPORT */
class BitmapTextField extends DisplayObject {
  /**
   * @param {string|BitmapFontData} font     The name of the bitmap font
   * @param {string=} text                   Text to be displayed inside this text field
   * @param {TextInfo=} style TextInfo object
   */
  constructor(font, text = '') {
    super();

    if (font !== null && font.constructor === String)
      this.mData = AssetManager.default.getBitmapFont(/** @type {string} */(font));
    else
      this.mData = /** @type {BitmapFontData} */ (font);

    /**
     * @private
     * @type {string}
     */
    this.mText = text;

    /**
     * @private
     * @type {boolean}
     */
    this.mAutoSize = true;

    /**
     * @private
     * @type {boolean}
     */
    this.mMultiline = false;

    /**
     * @private
     * @type {number}
     */
    this.mLineHeight = 1.2;

    /**
     * @private
     * @type {Rectangle}
     */
    this.mBounds = new Rectangle();

    /**
     * @private
     * @type {Rectangle}
     */
    this.mTextBounds = new Rectangle();

    /**
     * @private
     * @type {number}
     */
    this.mFieldWidth = 0;

    /**
     * @private
     * @type {number}
     */
    this.mFieldHeight = 0;
  }

  getRenderer() {
    return Black.instance.video.getRenderer('BitmapText');
  }

  onRender(driver, parentRenderer) {
    let renderer = this.mRenderer;

    let oldDirty = this.mDirty;

    if (this.mDirty & DirtyFlag.RENDER) {
      renderer.transform = this.finalTransformation;
      renderer.alpha = this.mAlpha * parentRenderer.alpha;
      renderer.blendMode = this.blendMode === BlendMode.AUTO ? parentRenderer.blendMode : this.blendMode;
      renderer.visible = this.mVisible;

      this.mDirty ^= DirtyFlag.RENDER;
    }

    if (this.mDirty & DirtyFlag.RENDER_CACHE) {
      renderer.text = this.text;
      renderer.data = this.mData;
      renderer.multiline = this.mMultiline;
      renderer.lineHeight = this.mLineHeight;
      renderer.fieldWidth = this.mFieldWidth;
      renderer.fieldHeight = this.mFieldHeight;
      renderer.autoSize = this.mAutoSize;
      renderer.bounds = this.onGetLocalBounds();

      if (renderer.isRenderable === true)
        this.mDirty ^= DirtyFlag.RENDER_CACHE;
    }

    renderer.dirty = oldDirty;

    return driver.registerRenderer(renderer);
  }

  /**
   * @protected
   * @override
   * @ignore
   * @param {Rectangle=} outRect
   *
   * @return {Rectangle}
   */
  onGetLocalBounds(outRect = undefined) {
    outRect = outRect || new Rectangle();

    if (this.mDirty & DirtyFlag.RENDER_CACHE) {
      let text = this.text;
      if (this.mMultiline === false)
        text = text.replace(/\n/g, '');

      TextMetricsEx.measureBitmap(text, this.mData, this.mLineHeight, this.mTextBounds);
    }

    if (this.mAutoSize === false) {
      outRect.width = this.mFieldWidth;
      outRect.height = this.mFieldHeight;
    } else {
      outRect.width = this.mTextBounds.width;
      outRect.height = this.mTextBounds.height;
    }

    return outRect;
  }

  /**
   * @param {boolean} value
   * @ignore
   *
   * @return {void}
   */
  set multiline(value) {
    this.mMultiline = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }

  /**
   * Get/Set multiLine value switcher.
   *
   * @return {boolean}
   */
  get multiline() {
    return this.mMultiline;
  }

  /**
   * @param {number} value
   * @ignore
   *
   * @return {void}
   */
  set lineHeight(value) {
    this.mLineHeight = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }

  /**
   * Get/Set lines vertical offset. From top previous to top next line.
   *
   * @return {number}
   */
  get lineHeight() {
    return this.mLineHeight;
  }

  /**
   * Specifies the width of the text field. If autoSize set as false
   *
   * @return {number}
   */
  get fieldWidth() {
    return this.mFieldWidth;
  }

  /**
   * @param {number} value
   * @ignore
   *
   * @return {void}
   */
  set fieldWidth(value) {
    if (value === this.mFieldWidth)
      return;

    this.mFieldWidth = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }

  /** Specifies the height of the text field, if autoSize set as false
   *
   * @return {number}
   */
  get fieldHeight() {
    return this.mFieldHeight;
  }


  /**
   * @param {number} value
   * @ignore
   *
   * @return {void}
   */
  set fieldHeight(value) {
    if (value === this.mFieldHeight)
      return;

    this.mFieldHeight = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }

  /**Text to be displayed inside this text field.

   * @return {string}
   */
  get text() {
    return this.mText;
  }

  /**
   * @param {string} value
   * @ignore
   *
   * @return {void}
   */
  set text(value) {
    if (this.mText === value)
      return;

    this.mText = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }

  /**
   * Determines whether the size of the field will adjust to the size of the text. Note: if this set as true, you need to specify fieldHeight and fieldWidth manually
   *
   * @return {boolean}
   */
  get autoSize() {
    return this.mAutoSize;
  }

  /**
   * @param {boolean} value
   * @ignore
   *
   * @return {void}
   */
  set autoSize(value) {
    if (this.mAutoSize === value)
      return;

    this.mAutoSize = value;
    this.setDirty(DirtyFlag.RENDER_CACHE, false);
  }
}

TextField.__cache = null;
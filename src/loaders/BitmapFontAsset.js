/**
 * Bitmap Font Asset responsible for loading font image file and corresponding xml file.
 *
 * @cat loaders
 * @extends Asset
 */
/* @echo EXPORT */
class BitmapFontAsset extends Asset {
  /**
   * Creates new AtlasTextureAsset instance.
   *
   * @param {string} name     Name of the asset.
   * @param {string} imageUrl Image URL.
   * @param {string} xmlUrl   XML URL.
   */
  constructor(name, imageUrl, xmlUrl) {
    super(name, imageUrl);

    /** @private @type {TextureAsset} */
    this.mTextureAsset = new TextureAsset(name, imageUrl);
    this.mTextureAsset.on(Message.COMPLETE, this.onImageLoaded, this);

    /** @private @type {XMLAsset} */
    this.mXMLAsset = new XMLAsset(name, xmlUrl);
    this.mXMLAsset.on(Message.COMPLETE, this.onXMLLoaded, this);
  }

  /**
   * @ignore
   * @private
   * @returns {void}
   */
  onImageLoaded() {
    this.mXMLAsset.load();
  }

  /**
   * @ignore
   * @private
   * @returns {void}
   */
  onXMLLoaded() {
    this.onLoaded();
  }

  /**
   * @inheritDoc
   */
  onLoaded() {
    let xml = this.mXMLAsset.data;
    let texture = this.mTextureAsset.data;

    this.mData = BitmapFontAsset.parse(xml, texture);
    super.onLoaded();
  }

  /**
   * @inheritDoc
   */
  load() {
    this.mTextureAsset.load();
  }

  /**
   *
   * @param {Document} xml
   * @param {Texture} texture
   * @returns {BitmapFontData}
   */
  static parse(xml, texture) {
    let data = new BitmapFontData();
    data.texture = texture;
    data.xml = xml;

    let info = xml.getElementsByTagName('info')[0];
    let common = xml.getElementsByTagName('common')[0];

    data.name = info.getAttribute('face');
    data.size = parseInt(info.getAttribute('size'), 10);
    data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10);
    data.baseline = parseInt(common.getAttribute('base'), 10);
    data.chars = {};

    let letters = xml.getElementsByTagName('char');

    for (let i = 0; i < letters.length; i++) {
      let letter = letters[i];
      let charCode = parseInt(letter.getAttribute('id'), 10);
      let x = parseInt(letter.getAttribute('x'), 10) + texture.region.x;
      let y = parseInt(letter.getAttribute('y'), 10) + texture.region.y;
      let w = parseInt(letter.getAttribute('width'), 10);
      let h = parseInt(letter.getAttribute('height'), 10);
      let xo = parseInt(letter.getAttribute('xoffset'), 10);
      let yo = parseInt(letter.getAttribute('yoffset'), 10);
      let xa = parseInt(letter.getAttribute('xadvance'), 10);
      let textureRect = new Rectangle(x, y, w, h);

      let charData = new BitmapFontCharData();
      charData.texture = new Texture(texture.native, textureRect);
      charData.xOffset = xo;
      charData.yOffset = yo;
      charData.width = w;
      charData.height = h;
      charData.xAdvance = xa;

      data.chars[charCode] = charData;
    }

    let kernings = xml.getElementsByTagName('kerning');

    for (let i = 0; i < kernings.length; i++) {
      let kerning = kernings[i];
      let first = parseInt(kerning.getAttribute('first'), 10);
      let second = parseInt(kerning.getAttribute('second'), 10);
      let amount = parseInt(kerning.getAttribute('amount'), 10);

      if (data.chars[second])
        data.chars[second].kerning[first] = amount;
    }

    return data;
  }
}

/* @echo EXPORT */
class BitmapFontData {
  constructor() {
    /** @type {Texture} */
    this.texture = null;

    /** @type {Document} */
    this.xml = null;

    /** @type {string} */
    this.name = '';

    /** @type {number} */
    this.size = 0;

    /** @type {number} */
    this.lineHeight = 0;

    /** @type {Object.<number, BitmapFontCharData>} */
    this.chars = {};

    /** @type {number} */
    this.baseline = 0;
  }
}

/* @echo EXPORT */
class BitmapFontCharData {
  constructor() {
    /** @type {Texture} */
    this.texture = null;

    /** @type {number} */
    this.xOffset = 0;

    /** @type {number} */
    this.yOffset = 0;

    /** @type {number} */
    this.width = 0;

    /** @type {number} */
    this.height = 0;

    /** @type {number} */
    this.xAdvance = 0;

    /** @type {Object.<number, number>} */
    this.kerning = {};
  }
}
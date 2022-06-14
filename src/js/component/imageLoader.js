/**
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Image loader
 */
import Component from '@/interface/component';
import { Promise } from '@/util';
import { componentNames, rejectMessages } from '@/consts';

const imageOption = {
  padding: 0,
  crossOrigin: 'Anonymous',
};

/**
 * ImageLoader components
 * @extends {Component}
 * @class ImageLoader
 * @param {Graphics} graphics - Graphics instance
 * @ignore
 */
class ImageLoader extends Component {
  constructor(graphics) {
    super(componentNames.IMAGE_LOADER, graphics);
  }

  /**
   * Load image from url
   * @param {?string} imageName - File name
   * @param {?(fabric.Image|string)} img - fabric.Image instance or URL of an image
   * @returns {Promise}
   */
  load(imageName, img) {
    let promise;
    if (!imageName && !img) {
      // Back to the initial state, not error.
      const canvas = this.getCanvas();
      canvas.backgroundImage = null;
      canvas.renderAll();

      promise = new Promise((resolve) => {
        this.setCanvasImage('', null);
        resolve();
      });
    } else {
      promise = this._setBackgroundImage(img).then((oImage) => {
        this.setCanvasImage(imageName, oImage);
        this.adjustCanvasDimension(oImage);

        return oImage;
      });
    }

    return promise;
  }

  /**
   * Set background image
   * @param {?(fabric.Image|String)} img fabric.Image instance or URL of an image to set background to
   * @returns {Promise}
   * @private
   */
  _setBackgroundImage(img) {
    if (!img) {
      return Promise.reject(rejectMessages.loadImage);
    }

    return new Promise((resolve, reject) => {
      const canvas = this.getCanvas();
      canvas.setDimensions({
        width: this.graphics.cssMaxWidth * 2,
        height: this.graphics.cssMaxHeight * 2,
      });
      fabric.Image.fromURL(img, (_img, isError) => {
        const scale = Math.min(canvas.width / _img.width, canvas.height / _img.height, 2);
        _img.set({
          scaleX: scale,
          scaleY: scale,
        });
        canvas.setBackgroundImage(
          _img,
          () => {
            const oImage = canvas.backgroundImage;
            if (oImage && oImage.getElement()) {
              resolve(oImage);
            } else {
              reject(rejectMessages.loadingImageFailed);
            }
          });
      })
      
    });
  }
}

export default ImageLoader;

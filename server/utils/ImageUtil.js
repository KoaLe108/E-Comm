const ImageUtil = {
  getProductImageSrc(image) {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
      return image;
    }
    return 'data:image/jpg;base64,' + image;
  }
};

module.exports = ImageUtil;

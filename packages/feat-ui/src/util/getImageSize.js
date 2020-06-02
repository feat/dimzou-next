export default function getImageSize(url, getImage = false) {
  return new Promise((resolve, reject) => {
    let timer = null;
    let img = new Image();
    const start = +new Date();

    img.src = url;
    function clear() {
      clearInterval(timer);
      timer = null;
      img = null;
    }
    function check() {
      if (img.width > 0 || img.height > 0) {
        clear();
        resolve({ width: img.width, height: img.height });
      } else if (+new Date() - start > 1500) {
        clear();
        console.log(`fail to get image size ${url}`);
        reject(false);
      }
    }


    if (getImage) {
      img.onload = function () { resolve(img); };
    } else {
      timer = setInterval(check, 40);
    }
  });
}

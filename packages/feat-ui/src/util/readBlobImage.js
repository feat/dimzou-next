export default function readBlobImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const { result } = event.target;
      if (result) {
        resolve(result);
      } else {
        reject(new Error("fail to transform!"));
      }
    };
    reader.readAsDataURL(file);
  });
}

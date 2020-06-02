export default function (file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onabort = () => reject('file reading was aborted');
    reader.onerror = () => reject('file reading has failed');

    reader.readAsDataURL(file);
  });
}

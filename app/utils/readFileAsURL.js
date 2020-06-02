export default function(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onabort = () => reject(new Error('file reading was aborted'));
    reader.onerror = () => reject(new Error('file reading has failed'));

    reader.readAsDataURL(file);
  });
}

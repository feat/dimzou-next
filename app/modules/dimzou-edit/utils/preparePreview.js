import readFileAsURL from '@/utils/readFileAsURL';

export default function preparePreview(file) {
  if (file.preview) {
    return Promise.resolve();
  }

  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
    file.preview = url;
  });
}

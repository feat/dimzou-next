export default function ssoAction(url) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    const frame = document.createElement('frame');
    frame.src = url;
    frame.onload = () => {
      // console.log('loaded');
      clearTimeout(timer);
      resolve();
    };
    document.querySelector('body').appendChild(frame);
  });
}

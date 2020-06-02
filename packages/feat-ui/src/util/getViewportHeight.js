export default function () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

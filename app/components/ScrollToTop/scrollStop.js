export default function scrollStop(callback, once = false) {
  // Make sure a valid callback was provided
  if (!callback || typeof callback !== 'function') return;

  // Setup scrolling variable
  let isScrolling;

  const listener = () => {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      if (once) {
        window.removeEventListener('scroll', listener);
      }
      // Run the callback
      callback();
    }, 66);
  };

  // Listen for scroll events
  window.addEventListener('scroll', listener, false);
}

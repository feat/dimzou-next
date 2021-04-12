import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function HashSpy(props) {
  const domRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    const getActiveHash = () => {
      const elements = domRef.current?.querySelectorAll(props.selector);
      //   const vh = Math.max(
      //     document.documentElement.clientHeight || 0,
      //     window.innerHeight || 0,
      //   );
      //   const viewportRange = [80, vh];
      const activeRegion = 80 + 80;
      const boxes = Array.prototype.map.call(elements, (el) =>
        el.getBoundingClientRect(),
      );
      const nodes = Array.prototype.map.call(elements, (el, index) => {
        const box = boxes[index];
        const nextTop = boxes[index + 1]?.top || Infinity;
        return [el, index, box.top, nextTop];
      });
      let nextNode;
      if (nodes.length === 0) {
        nextNode = undefined;
      } else {
        nextNode = nodes.find(
          (item) => item[2] < activeRegion && item[3] > activeRegion,
        )?.[0];
      }
      if (activeRef.current === nextNode) {
        return;
      }
      activeRef.current = nextNode;
      props.onChange(nextNode);
    };
    getActiveHash();
    window.addEventListener('scroll', getActiveHash);

    return () => {
      window.removeEventListener('scroll', getActiveHash);
    };
  }, []);

  return props.children(domRef);
}

HashSpy.propTypes = {
  onChange: PropTypes.func,
  selector: PropTypes.string,
};

export default HashSpy;

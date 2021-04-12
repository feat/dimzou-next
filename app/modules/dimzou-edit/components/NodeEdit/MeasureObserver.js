import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function MeasureObserver(props) {
  const domRef = useRef(null);
  // const throttleMeasure = useMemo(() => throttle(props.measure, 200), [
  //   props.measure,
  // ]);
  useEffect(
    () => {
      const images =
        (domRef.current && domRef.current.querySelectorAll('figure img')) || [];
      for (let i = 0, { length } = images; i < length; i += 1) {
        const imageNode = images[i];
        imageNode.addEventListener('load', props.measure, {
          once: true,
        });
      }
      props.measure();
      return () => {
        for (let i = 0, { length } = images; i < length; i += 1) {
          const imageNode = images[i];
          imageNode.removeEventListener('load', props.measure, {
            once: true,
          });
        }
      };
    },
    [props.customKey, props.measure],
  );
  useEffect(
    () => {
      const nodes = [];
      const callback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            Array.prototype.forEach.call(mutation.addedNodes, (node) => {
              const images =
                node.querySelectorAll && node.querySelectorAll('figure img');
              if (!images) {
                return;
              }
              for (let i = 0, { length } = images; i < length; i += 1) {
                const imageNode = images[i];
                imageNode.addEventListener('load', props.measure, {
                  once: true,
                });
                nodes.push(imageNode);
              }
            });
          }
        });
        props.measure();
      };
      const observer = new MutationObserver(callback);
      observer.observe(domRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      return () => {
        observer.disconnect();
        nodes.forEach((imageNode) => {
          imageNode.removeEventListener('load', props.measure, {
            once: true,
          });
        });
      };
    },
    [props.measure],
  );

  return (
    <div className={props.className} style={props.style} ref={domRef}>
      {props.children}
    </div>
  );
}

MeasureObserver.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.element,
  measure: PropTypes.func,
  customKey: PropTypes.any,
};

export default MeasureObserver;

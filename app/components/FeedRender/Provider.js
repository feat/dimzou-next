import { createContext, useState, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

export const FeedRenderContext = createContext({});

export default function FeedRenderContextProvider(props) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef();
  const { children, id, style, className, ...contextProps } = props;
  const context = useMemo(
    () => ({
      ...contextProps,
      containerWidth: width,
    }),
    [width],
  );

  useEffect(() => {
    const updateWidth = () => {
      const newWidth =
        containerRef.current &&
        containerRef.current.getBoundingClientRect().width;
      setWidth(newWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <FeedRenderContext.Provider value={context}>
      <div ref={containerRef} id={id} className={className} style={style}>
        {children}
      </div>
    </FeedRenderContext.Provider>
  );
}

FeedRenderContextProvider.propTypes = {
  children: PropTypes.any,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
  renderAvatar: PropTypes.func,
  mapData: PropTypes.func, // example: (data, name) => ({ title, body, cover, author, isDraft, isTranslation, ... })
};

export const WithFeedRenderContext = (Component) => (props) => (
  <FeedRenderContext.Consumer>
    {(value) => <Component {...props} renderContext={value} />}
  </FeedRenderContext.Consumer>
);

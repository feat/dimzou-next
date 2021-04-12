import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import './style.scss';

const scrollCache = {
  data: {},
  set(key, value) {
    this.data[key] = value;
  },
  get(key) {
    return this.data[key];
  },
};

const ScrollBox = React.forwardRef((props, ref) => {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const {
    scrollToLoad,
    hasMore,
    scrollToLoadDelta,
    loadingHint,
    loading,
    className,
    children,
    loadMore,
    ...restProps
  } = props;

  useEffect(
    () => {
      if (scrollToLoad && hasMore) {
        const dom = wrapRef.current;
        const tryToLoadMore = debounce(() => {
          const { scrollTop, clientHeight, scrollHeight } = dom;
          const shouldLoadMore =
            scrollHeight - scrollTop - clientHeight < scrollToLoadDelta;
          if (shouldLoadMore) {
            if (!loadMore) {
              logging.warn('Should set loadMore props');
              return;
            }
            if (loading) {
              return;
            }
            props.loadMore();
          }
        }, 100);
        dom.addEventListener('scroll', tryToLoadMore);
        return () => {
          dom.removeEventListener('scroll', tryToLoadMore);
        };
      }
      return undefined;
    },
    [scrollToLoad, hasMore, loadMore],
  );

  useEffect(() => {
    const updateInnerWidth = () => {
      if (wrapRef.current && innerRef.current) {
        innerRef.current.style.width = `${wrapRef.current.offsetWidth}px`;
      }
    };
    updateInnerWidth();
    window.addEventListener('resize', updateInnerWidth);
    return () => {
      window.removeEventListener('resize', updateInnerWidth);
    };
  });

  useEffect(() => {
    if (props.scrollCacheKey) {
      const position = scrollCache.get(props.scrollCacheKey);
      if (position) {
        // wrapRef.current.scrollTo(position.x, position.y);
        requestAnimationFrame(() => {
          if (wrapRef.current) {
            wrapRef.current.scrollLeft = position.x;
            wrapRef.current.scrollTop = position.y;
          }
        });
      }
    }
  }, []);

  return (
    <div
      ref={(n) => {
        wrapRef.current = n;
        if (ref) {
          if (typeof ref === 'function') {
            ref(n);
          } else {
            // eslint-disable-next-line
            ref.current = n;
          }
        }
      }}
      className={classNames('ft-ScrollBox', className, {
        'h-ssp': props.stopScrollPropagation,
      })}
      {...restProps}
      onScroll={(e) => {
        if (props.scrollCacheKey) {
          scrollCache.set(props.scrollCacheKey, {
            x: e.target.scrollLeft,
            y: e.target.scrollTop,
          });
        }
      }}
    >
      <div className="ft-ScrollBox__inner" ref={innerRef}>
        {children}
        {scrollToLoad && hasMore && loadingHint}
      </div>
    </div>
  );
});

ScrollBox.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  scrollToLoad: PropTypes.bool,
  scrollToLoadDelta: PropTypes.number,
  loadingHint: PropTypes.node,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
};

ScrollBox.defaultProps = {
  scrollToLoadDelta: 50,
  loadingHint: 'loading...',
};

export default ScrollBox;

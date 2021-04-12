import { useState, useRef, useEffect } from 'react';
export function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const setStateCallback = (innerState, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState(innerState);
  };

  useEffect(
    () => {
      // cb.current is `null` on initial render, so we only execute cb on state *updates*
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null; // reset callback after execution
      }
    },
    [state],
  );

  return [state, setStateCallback];
}

export function scrollOverflowContain(container) {
  const listener = (e) => {
    const dom = e.currentTarget;
    if (
      (dom.scrollTop === 0 && e.deltaY < 0) ||
      (dom.scrollHeight - dom.clientHeight === dom.scrollTop && e.deltaY > 0)
    ) {
      e.preventDefault();
    }
  };
  container.addEventListener('mousewheel', listener);
  return () => {
    container.removeEventListener('mousewheel', listener);
  };
}

export function useScrollOverflowContain(dom) {
  useEffect(
    () => {
      if (!dom) {
        return undefined;
      }
      return scrollOverflowContain(dom);
      // if is chrome, add style css
    },
    [dom],
  );
}

const scrollCache = {
  data: {},
  set(key, value) {
    this.data[key] = value;
  },
  get(key) {
    return this.data[key];
  },
};
export function useScrollControl(domRef, key) {
  const [scroll, setScroll] = useState(scrollCache.get(key));
  useEffect(
    () => {
      const dom = domRef.current;

      if (scrollCache.get(key) !== scroll) {
        setScroll(scroll);
      }

      const cacheScrollValue = (e) => {
        scrollCache.set(key, {
          left: e.target.scrollLeft,
          top: e.target.scrollTop,
        });
      };
      dom.addEventListener('scroll', cacheScrollValue);
      return () => {
        dom.removeEventListener('scroll', cacheScrollValue);
      };
    },
    [key],
  );

  useEffect(
    () => {
      if (scroll) {
        requestAnimationFrame(() => {
          domRef.current?.scrollTo({
            top: scroll.top,
            left: scroll.left,
            // behavior: 'smooth',
          });
        });

        scrollCache.set(key, scroll);
      }
    },
    [key, scroll],
  );

  return { setScroll };
}

const cachedState = {};
export function useCachedState(key, initialState) {
  const [state, setState] = useState(cachedState[key] ?? initialState);
  useEffect(
    () => {
      cachedState[key] = state;
    },
    [state, key],
  );
  return [state, setState];
}

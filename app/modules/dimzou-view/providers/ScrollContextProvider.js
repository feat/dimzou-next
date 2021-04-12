import { useRouter } from 'next/router';
import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';

import { ScrollContext } from '../context';

const getHash = (path) => {
  const result = /(?:.*)?(#[\w-\d]*)/.exec(path);
  return result ? result[1] : '';
};

function ScrollContextProvider(props) {
  const [hash, setHash] = useState(
    typeof window === 'object' ? window.location.hash : '',
  );
  const [routing, setRouting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const updateHash = (path) => {
      const pathHash = getHash(path);
      setHash(pathHash);
      setRouting(true);
    };
    const resetRoutingFlag = () => {
      setRouting(false);
    };

    router.events.on('routeChangeStart', updateHash);
    router.events.on('routeChangeComplete', resetRoutingFlag);
    let hashListener;
    if (typeof window === 'object') {
      hashListener = () => {
        setHash(window.location.hash);
      };
      // 为了支持浏览器的按钮
      window.addEventListener('hashchange', hashListener);
    }

    return () => {
      router.events.off('routeChangeStart', updateHash);
      router.events.off('routeChangeComplete', resetRoutingFlag);
      if (typeof window === 'object') {
        window.removeEventListener('hashchange', hashListener);
      }
    };
  });

  useLayoutEffect(
    () => {
      if (hash === '#tailing') {
        // 滚动到底部
        document.documentElement.scrollTop =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        // 重置
        window.addEventListener(
          'mousewheel',
          () => {
            if (window.history.replaceState) {
              window.history.replaceState(
                undefined,
                '',
                window.location.pathname + window.location.search,
              );
            }
            setHash('');
          },
          { once: true },
        );
      }
    },
    [hash],
  );

  const value = useMemo(
    () => ({
      hash,
      setHash,
      routing,
    }),
    [hash],
  );

  return (
    <ScrollContext.Provider value={value}>
      {props.children}
    </ScrollContext.Provider>
  );
}

export default ScrollContextProvider;

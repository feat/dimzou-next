import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ScrollContext } from '../context';

const isDimzouPath = (path) => /\/draft|dimzou-publication\/.*/.test(path);
const getHash = (path) => {
  const result = /(?:.*)?(#[\w-\d]*)/.exec(path);
  return result ? result[1] : '';
};
function ScrollContextProvider(props) {
  const router = useRouter();
  const [scrollHash, setScrollHash] = useState(
    typeof window === 'undefined' ? '' : window.location.hash,
  ); // 触发滚动
  const [activeHash, setActiveHash] = useState(''); // anchor 状态
  const [sort, setSort] = useState(undefined);
  const [paragraphId, setParagraphId] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  useEffect(() => {
    const updateHash = () => {
      // may handle scroll here
      if (window.location.hash) {
        setActiveHash(window.location.hash);
        setScrollHash(window.location.hash);
      } else {
        // window.scrollTo(0, 0); 此处不能进行滚动重置，否则一般滚动触发的路由更新后，刷新页面会跳动
        // setActiveHash('');
      }
    };

    const updateActiveHash = (path) => {
      if (isDimzouPath(path)) {
        const hash = getHash(path);
        setActiveHash(hash);
      }
    };
    router.events.on('routeChangeComplete', updateHash);
    router.events.on('hashChangeComplete', updateHash);
    router.events.on('routeChangeStart', updateActiveHash);

    return () => {
      router.events.off('routeChangeComplete', updateHash);
      router.events.off('hashChangeComplete', updateHash);
      router.events.off('routeChangeStart', updateActiveHash);
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        activeHash,
        scrollHash,
        sort,
        paragraphId,
        scrollToBottom,
        setScrollToBottom,
        setActiveHash,
        setScrollHash,
        setSort,
        setParagraphId,
        onScrollStarted: () => {
          setActiveHash(scrollHash);
        },
        onScrollFinished: () => {
          setScrollHash('');
        },
      }}
    >
      {props.children}
    </ScrollContext.Provider>
  );
}

ScrollContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ScrollContextProvider;

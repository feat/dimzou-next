import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ScrollContext } from '../context';
import { isContentHash } from '../utils/router';

const isDimzouPath = (path) => /\/draft|dimzou-publication\/.*/.test(path);
const getHash = (path) => {
  const result = /(?:.*)?(#[\w-\d]*)/.exec(path);
  return result ? result[1] : '';
};

let isResetScroll = false;
function ScrollContextProvider(props) {
  const router = useRouter();
  const [scrollHash, setScrollHash] = useState(window.location.hash); // 触发滚动
  const [activeSection, setActiveSection] = useState(''); // anchor 状态，标记当前 section

  useEffect(() => {
    const updateHash = () => {
      logging.debug('updateHash trigger by router event');
      // may handle scroll here
      if (window.location.hash) {
        if (isContentHash(window.location.hash)) {
          setActiveSection(window.location.hash);
        }
        setScrollHash(window.location.hash);
      } else {
        if (isResetScroll) {
          isResetScroll = false;
          return;
        }
        // window.scrollTo(0, 0); 此处不能进行滚动重置，否则一般滚动触发的路由更新后，刷新页面会跳动
        // setActiveSection('');
        setScrollHash('');
      }
    };

    const updateActiveSection = (path) => {
      logging.debug('route change start, update active hash');
      if (isDimzouPath(path)) {
        const hash = getHash(path);
        setActiveSection(hash);
      }
    };

    // Ref: https://nextjs.org/docs/api-reference/next/router
    router.events.on('routeChangeComplete', updateHash);
    router.events.on('hashChangeComplete', updateHash);
    router.events.on('routeChangeStart', updateActiveSection);
    // router.events.on('hashChangeStart', hashChangeStart);

    return () => {
      router.events.off('routeChangeComplete', updateHash);
      router.events.off('hashChangeComplete', updateHash);
      router.events.off('routeChangeStart', updateActiveSection);
      // router.events.off('hashChangeStart', hashChangeStart);
    };
  }, []);

  // useEffect(
  //   // eslint-disable-next-line consistent-return
  //   () => {
  //     if (activeSection === '#tailing') {
  //       const resetActiveSection = () => {
  //         setActiveSection((prev) => {
  //           if (prev === '#tailing') {
  //             return '';
  //           }
  //           return prev;
  //         });
  //       };
  //       window.addEventListener('scroll', resetActiveSection);
  //       return () => {
  //         window.removeEventListener('scroll', resetActiveSection);
  //       };
  //     }
  //   },
  //   [activeSection],
  // );

  useLayoutEffect(
    () => {
      if (scrollHash === '#tailing') {
        // 滚动到底部
        window.scrollTo(
          0,
          document.documentElement.scrollHeight -
            document.documentElement.clientHeight,
        );
      }
    },
    [scrollHash],
  );

  useEffect(
    () => {
      const removeHash = () => {
        if (scrollHash) {
          setTimeout(() => {
            setScrollHash(undefined);
            isResetScroll = true;
            router.replace(
              {
                pathname: router.pathname,
                query: router.query,
              },
              window.location.pathname,
              {
                shallow: true,
              },
            );
          });
        }
        // if (window.location.hash) {
        //   setScrollHash(undefined);
        //   global.history.replaceState(null, '', window.location.pathname);
        //   // window.location.replace(window.location.pathname);
        //   // Router.replace(
        //   //   {
        //   //     pathname: Router.pathname,
        //   //     query: Router.query,
        //   //   },
        //   //   window.location.pathname,
        //   // );
        // }
      };
      window.addEventListener('mousewheel', removeHash, { passive: true });
      return () => {
        window.removeEventListener('mousewheel', removeHash, { passive: true });
      };
    },
    [scrollHash],
  );

  return (
    <ScrollContext.Provider
      value={{
        activeSection,
        scrollHash,
        setActiveSection,
        setScrollHash,
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

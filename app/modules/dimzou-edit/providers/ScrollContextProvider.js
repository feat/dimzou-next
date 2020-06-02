import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ScrollContext } from '../context';

function ScrollContextProvider(props) {
  const router = useRouter()
  const [scrollHash, setScrollHash] = useState(
    typeof window === 'undefined' ?  '' : window.location.hash
  ); // 触发滚动
  const [activeHash, setActiveHash] = useState('');  // anchor 状态

  const forceActiveHash = useRef(null);

  useEffect(() => {
    const updateHash = () => {
      setActiveHash('');
      if (window.location.hash && activeHash !== window.location.hash) {
        setScrollHash(window.location.hash);
      };
    }
    router.events.on('routeChangeComplete', updateHash);
    router.events.on('hashChangeComplete', updateHash);
    return () => {
      router.events.off('routeChangeComplete', updateHash);
      router.events.off('hashChangeComplete', updateHash);
    }
  }, [])
  
  return (
    <ScrollContext.Provider
      value={{
        activeHash: forceActiveHash.current || activeHash,
        scrollHash,
        setActiveHash: (hash) => {
          forceActiveHash.current = undefined;
          setActiveHash(hash);
        },
        setScrollHash,
        onScrollStarted: () => {
          forceActiveHash.current = scrollHash;
        },
        onScrollFinished: () => { 
          setScrollHash('');
          setActiveHash(scrollHash); 
        },
      }}
    >
      {props.children}
    </ScrollContext.Provider>
  )
}

ScrollContextProvider.propTypes = {
  children: PropTypes.node,
}

export default ScrollContextProvider;
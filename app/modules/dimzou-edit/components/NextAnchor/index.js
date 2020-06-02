import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function NextAnchor({ nodes, index: nodeIndex, onActivate, delta }) {
  const domRef = useRef(null);
  const next = nodeIndex > -1 ? nodes[nodeIndex + 1] : null;
  useEffect(() => {
    const handleScroll = () => {
      // cacl offset and load data
      if (!next || !domRef.current) {
        return; 
      }
      const box = domRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      // prefetch data;
      if (
        box.top - delta < viewportHeight &&
        box.top + delta > viewportHeight 
      ) {
        onActivate(next);
      }
    }
    setTimeout(() => {
      handleScroll();
    }, 100);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [next]);    

  if (!next) {
    return null;
  }

  return (
    <div ref={domRef} className='dz-NextAnchor'/>
  )
    
}

NextAnchor.propTypes = {
  nodes: PropTypes.array,
  index: PropTypes.number,
  onActivate: PropTypes.func,
  delta: PropTypes.number,
}

NextAnchor.defaultProps = {
  delta: 200,
}

export default NextAnchor
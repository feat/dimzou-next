/**
 * 行为说明：
 * - sticky，根据上沿元素，设置 top 值
 * - height, 根据元素在页面中的位置设置容器高度
 *    1. 当未设置上沿/下沿元素时，最大可视范围为窗口高度
 *    2. 当设置了上沿/下沿元素时，最大可视范围为 上沿元素底部 与 下沿元素顶部之间的距离
 *    3. 如果当前元素在初始化时不是紧贴上沿元素（可随页面滚动一段距离），计算高度时会考虑中当前元素的位置
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

function StickySidebarWithAutoHeight(props) {
  const [style, setStyle] = useState({});
  const domRef = useRef(null);

  useEffect(() => {
    const updateStyle = throttle(() => {
      const top = document.querySelector(props.top);
      const bottom = document.querySelector(props.bottom);
      if (!domRef.current) {
        return;
      }
      let topBox;
      let bottomBox;
      if (top) {
        topBox = top.getBoundingClientRect();
      } else {
        topBox = { bottom: 0 };
      }
      if (bottom) {
        bottomBox = bottom.getBoundingClientRect();
      } else {
        bottomBox = {
          top: Infinity,
        };
      }
      const newStyle = {
        position: 'sticky',
        top: topBox.bottom,
      };
      const boxTop = domRef.current.getBoundingClientRect().top;
      const maxHeight =
        Math.min(window.innerHeight, bottomBox.top) -
        Math.max(boxTop, topBox.bottom);
      newStyle.maxHeight = maxHeight;
      // 元素高度处于受限制状态 ｜ 元素高度需要初始化时
      if (
        (domRef.current.style.height &&
          parseInt(domRef.current.style.height, 10) === maxHeight) ||
        !domRef.current.style.height
      ) {
        newStyle.height = maxHeight;
      }
      if (maxHeight < domRef.current.getBoundingClientRect().height) {
        newStyle.height = maxHeight;
      }
      setStyle(newStyle);
    }, 300);
    setTimeout(() => {
      updateStyle();
    }, 300);
    window.addEventListener('scroll', updateStyle);
    window.addEventListener('resize', updateStyle);
    return () => {
      window.removeEventListener('scroll', updateStyle);
      window.removeEventListener('resize', updateStyle);
    };
  }, []);
  return (
    <div id={props.id} className={props.className} ref={domRef} style={style}>
      {props.children}
    </div>
  );
}

StickySidebarWithAutoHeight.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  top: PropTypes.string,
  bottom: PropTypes.string,
};

StickySidebarWithAutoHeight.defaultProps = {
  top: '#header',
  bottom: '#footer',
};

export default StickySidebarWithAutoHeight;

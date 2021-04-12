/**
 * Scroll Navigator
 * 1. 仅在响应范围内触发滚动时，Nav Detect
 * 2. 延迟一段时间再触发 nav 执行
 * 3. 执行一次执行后，需要等待一段事件后再继续检测
 *
 * 流程：
 * - wheel triggerd --> 是否在滚动区域内触发 --> 是，则确认检测方向
 */
import { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';

// 延迟执行 nav 触发状态重置
const NAV_TRIGGERED_RESET_DELAY = 400;
// 滚动状态标记； 触发nav的检查，仅在初始 WHEELING 时处理
const WHEELING_STATE_RESET = 200;

function ScrollNavigator(props) {
  const { onToPrev, onToNext, excepts } = props;
  // const [scrollTime, setScrollTime] = useState(props.navTriggerLimit); // scroll count??
  const navTriggeredRef = useRef(false);
  const navTimerRef = useRef(null);
  // 滚动检测
  const isWheeling = useRef(false);
  const detectDirection = useRef(0);
  const resetWheelingActiveTimer = useRef(null);

  useEffect(
    () => {
      if (props.disabled) {
        clearTimeout(navTimerRef.current);
      }
    },
    [props.disabled],
  );

  const setWheeling = useCallback(
    throttle(
      (event) => {
        logging.debug('setWheeling');
        clearTimeout(resetWheelingActiveTimer.current);
        resetWheelingActiveTimer.current = setTimeout(() => {
          logging.debug('resetWheeling');
          isWheeling.current = false;
          detectDirection.current = 0;
        }, WHEELING_STATE_RESET);
        if (!isWheeling.current) {
          isWheeling.current = true;
          // 设置滚动检测方向
          const {
            scrollTop,
            scrollHeight,
            clientHeight,
          } = document.documentElement;
          if (
            (scrollTop < props.navTriggerRegion && event.deltaY < 0) ||
            (scrollHeight - scrollTop - clientHeight < props.navTriggerRegion &&
              event.deltaY > 0)
          ) {
            detectDirection.current = Math.sign(event.deltaY);
          }
        }
      },
      50,
      { leading: true },
    ),
    [],
  );

  useEffect(
    () => {
      const containerDom = props.container
        ? document.querySelector(props.container)
        : document.body;

      const scrollHandler = (event) => {
        logging.debug('wheel----------');
        if (props.disabled) {
          return;
        }
        const shouldExclude =
          excepts.length &&
          excepts.some((s) => {
            const doms = containerDom.querySelectorAll(s);
            return Array.prototype.some.call(doms, (dom) =>
              dom.contains(event.target),
            );
          });
        if (shouldExclude) {
          return;
        }
        setWheeling(event);
        if (!detectDirection.current) {
          return;
        }
        if (detectDirection.current !== Math.sign(event.deltaY)) {
          if (navTriggeredRef.current) {
            // reset
            detectDirection.current = 0;
            navTriggeredRef.current = false;
            clearTimeout(navTimerRef.current);
          }
          return;
        }

        if (navTriggeredRef.current) {
          return;
        }

        const {
          scrollTop,
          scrollHeight,
          clientHeight,
        } = document.documentElement;

        if (detectDirection.current < 0 && scrollTop === 0) {
          logging.debug('navTriggeredRef');
          navTriggeredRef.current = true;
          navTimerRef.current = setTimeout(() => {
            logging.debug('triggered...');
            onToPrev();
            setTimeout(() => {
              navTriggeredRef.current = false;
            }, NAV_TRIGGERED_RESET_DELAY);
          }, props.navTriggerTimeout);
        } else if (
          detectDirection.current > 0 &&
          scrollHeight - scrollTop - clientHeight < 5
        ) {
          logging.debug('navTriggeredRef');
          navTriggeredRef.current = true;
          navTimerRef.current = setTimeout(() => {
            onToNext();
            setTimeout(() => {
              navTriggeredRef.current = false;
            }, NAV_TRIGGERED_RESET_DELAY);
          }, props.navTriggerTimeout);
        }
      };

      if (containerDom) {
        containerDom.addEventListener('wheel', scrollHandler);
      } else {
        logging.warn(`No containerDom : ${props.container}`);
      }

      return () => {
        if (containerDom) {
          containerDom.removeEventListener('wheel', scrollHandler);
        }
      };
    },
    [
      props.container,
      props.disabled,
      props.navTriggerRegion,
      // props.navTriggerLimit,
      props.navTriggerTimeout,
      props.excepts,
    ],
  );

  // useEffect(
  //   () => {
  //     logging.debug(scrollTime);
  //     if (scrollTime === 0) {
  //       navTriggeredRef.current = true;
  //       setScrollTime(props.navTriggerLimit);
  //       setTimeout(() => {
  //         navTriggeredRef.current = false;
  //       }, 1000);
  //     }
  //     if (scrollTime === 0 && scrollDirectionRef.current < 0) {
  //       onToPrev();
  //       return;
  //     }
  //     if (scrollTime === 0 && scrollDirectionRef.current > 0) {
  //       onToNext();
  //     }
  //   },
  //   [scrollTime, onToPrev, onToNext],
  // );

  return props.children;
}

ScrollNavigator.propTypes = {
  container: PropTypes.string, // selector
  disabled: PropTypes.bool, // 禁用状态
  excepts: PropTypes.array, // 不响应某些区域
  onToPrev: PropTypes.func, // 向前加载
  onToNext: PropTypes.func, // 向后加载
  // navTriggerLimit: PropTypes.number, // 事件触发计数
  navTriggerTimeout: PropTypes.number, // 事件触发等待
  navTriggerRegion: PropTypes.number, // 响应范围
};

ScrollNavigator.defaultProps = {
  // navTriggerLimit: 40,
  navTriggerTimeout: 400,
  navTriggerRegion: 60,
  excepts: [],
};

export default ScrollNavigator;

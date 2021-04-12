import { useEffect, useRef, useState, useCallback } from 'react';

export function useExpandedControl(activeKey) {
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const lastActiveKey = useRef(null);
  useEffect(
    () => {
      if (lastActiveKey.current === activeKey) {
        // 避免 effect 循环
        return;
      }
      const newExpanded = new Set(expandedKeys);

      let path = activeKey;
      do {
        newExpanded.add(path);
        const result = /(^\/.*)\/.+/.exec(path);
        path = result?.[1];
      } while (path);
      lastActiveKey.current = activeKey;
      setExpandedKeys(newExpanded);
    },
    [activeKey, expandedKeys],
  );
  const toggleExpanded = useCallback(
    (key) => {
      const newExpanded = new Set(expandedKeys);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      setExpandedKeys(newExpanded);
    },
    [expandedKeys],
  );
  const resetExpanded = useCallback(() => {
    setExpandedKeys(new Set());
  }, []);
  return {
    expandedKeys,
    toggleExpanded,
    resetExpanded,
  };
}

export function useListDropzone(itemSelector, isActive, isValidPivot) {
  const [pivotIndex, setPivotIndex] = useState(undefined);
  const domRef = useRef(null);
  const pointerY = useRef(undefined);
  useEffect(
    () => {
      if (!domRef.current || !isActive) {
        return;
      }
      const listener = (e) => {
        const { clientY } = e;
        if (clientY !== pointerY.current) {
          pointerY.current = clientY;
          const items = domRef.current.querySelectorAll(itemSelector);
          // TO_ENHANCE: 更新判断逻辑
          let blockIndex;
          for (let i = 0; i < items.length; i += 1) {
            const block = items[i];
            if (!block) {
              continue;
            }
            const box = block.getBoundingClientRect();
            const { top, height } = box;
            // logging.debug(top, height, clientY)
            if (top + height / 2 > clientY) {
              blockIndex = i - 1;
              break;
            }
            if (top + height > clientY) {
              blockIndex = i;
              break;
            }
          }
          if (isValidPivot) {
            if (isValidPivot(blockIndex)) {
              setPivotIndex(blockIndex);
            } else {
              setPivotIndex(undefined);
            }
          } else {
            setPivotIndex(blockIndex);
          }
        }
      };

      domRef.current.addEventListener('dragover', listener);

      // eslint-disable-next-line consistent-return
      return () => {
        domRef.current.removeEventListener('dragover', listener);
      };
    },
    [itemSelector, isActive, isValidPivot],
  );

  return [pivotIndex, domRef];
}

export function useKeyboardNavigator() {
  // TODO:
}

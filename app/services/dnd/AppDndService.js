import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import AppDndHandlerService from './AppDndHandlerService';

export const AppDndContext = createContext({
  draggableIsFree: false,
  item: null,
});

export default function AppDndService(props) {
  const [version, setVersion] = useState(0);

  useEffect(
    () => {
      const increse = () => setVersion(version + 1);
      AppDndHandlerService.on('register', increse);
      AppDndHandlerService.on('unregister', increse);
      return () => {
        AppDndHandlerService.off('register', increse);
        AppDndHandlerService.off('unregister', increse);
      };
    },
    [version],
  );

  const drop = useCallback(
    (item, monitor) => {
      const type = monitor.getItemType();
      const handler = AppDndHandlerService.getHandler(type);
      return handler?.drop?.(item, monitor);
    },
    [version],
  );

  const canDrop = useCallback(
    (item, monitor) => {
      const type = monitor.getItemType();
      const handler = AppDndHandlerService.getHandler(type);
      if (!handler || !handler.canDrop) {
        return true;
      }
      return handler.canDrop(item, monitor);
    },
    [version],
  );

  const hover = useCallback(
    (item, monitor) => {
      const type = monitor.getItemType();
      const handler = AppDndHandlerService.getHandler(type);
      if (!handler) {
        return;
      }
      handler.hover && handler.hover(item, monitor);
    },
    [version],
  );

  const renderMessage = useCallback(
    (item, collect) => {
      const type = collect.itemType;
      const handler = AppDndHandlerService.getHandler(type);
      if (!handler) {
        return null;
      }
      return handler.renderMessage && handler.renderMessage(item, collect);
    },
    [version],
  );
  const accept = useMemo(() => AppDndHandlerService.getAccept(), [version]);

  // react-dnd patches for accept update: https://github.com/react-dnd/react-dnd/pull/2936
  return (
    <AppDropzone
      // key={accept.join('|')}
      accept={accept}
      drop={drop}
      canDrop={canDrop}
      hover={hover}
      renderMessage={renderMessage}
    >
      {props.children}
    </AppDropzone>
  );
}

AppDndService.propTypes = {
  children: PropTypes.any,
};

export function AppDropzone(props) {
  const [collected, drop] = useDrop({
    accept: props.accept,
    drop: props.drop,
    hover: props.hover,
    canDrop: props.canDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggableIsFree: monitor.isOver({ shallow: true }), // 不在其他 Dropzone 里面
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
    }),
  });

  return (
    <AppDndContext.Provider value={collected}>
      <div ref={drop}>{props.children}</div>
    </AppDndContext.Provider>
  );
}

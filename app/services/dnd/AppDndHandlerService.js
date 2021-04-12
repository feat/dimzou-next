import { DRAGGABLE_ELEMENT } from './constants';
const handlers = new Map();

const AppDndHandlerService = {
  list: new Map(),
  register(key, handler) {
    if (handlers.has(key)) {
      logging.warn(`Already has a handler for : ${key}`);
    }
    handlers.set(key, handler);
    this.emit('register');
  },
  unregister(key) {
    handlers.delete(key);
    this.emit('unregister');
  },
  getHandler(key) {
    return handlers.get(key);
  },
  getAccept() {
    return Array.from(handlers.keys());
  },
  on(eventType, eventAction) {
    this.list.has(eventType) || this.list.set(eventType, []);
    if (this.list.get(eventType)) this.list.get(eventType).push(eventAction);
    return this;
  },
  off(eventType, eventAction) {
    if (this.list.get(eventType)) {
      this.list.set(
        eventType,
        this.list.get(eventType).filter((action) => action !== eventAction),
      );
    }
  },
  emit(eventType, ...args) {
    this.list.get(eventType) &&
      this.list.get(eventType).forEach((cb) => {
        cb(...args);
      });
  },
};

AppDndHandlerService.register(DRAGGABLE_ELEMENT, {
  drop: (item, monitor) => monitor.getDifferenceFromInitialOffset(),
});

export default AppDndHandlerService;

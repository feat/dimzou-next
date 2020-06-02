let intl;

export function setIntl(compo) {
  intl = compo;
}

export function formatMessage(...args) {
  if (!intl) {
    return '...';
  }
  if (!args[0]) {
    return 'INVALID_MESSAGE';
  }
  return intl.formatMessage(...args);
}

function getHandler(options = {}) {
  const {
    prefix = 'not defined message: ',
    fallback,
    shouldLog = true,
  } = options;
  return {
    get(obj, prop) {
      if (!(prop in obj)) {
        if (process.env.NODE_ENV !== 'production' || shouldLog) {
          if (typeof logging === 'object') {
            logging.error(`${prefix} ${prop}`);
          }
        }
        if (obj.fallback) {
          return obj.fallback;
        }
        if (fallback) {
          return fallback;
        }
      }
      return obj[prop];
    },
  };
}

export function defineMessages(obj, options) {
  return new Proxy(obj, getHandler(options));
}

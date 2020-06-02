/* eslint-disable no-console */
import {
  captureException,
  captureMessage,
  addBreadcrumb,
} from '@sentry/browser';

const isProd = process.env.NODE_ENV === 'production';

export const log = isProd
  ? (...args) => {
    const data = args[0];
    const level = args[args.length - 1];
    const extraInfo = args.slice(1, -1);

    if (data instanceof Error) {
      captureException(data);
    } else {
      if (extraInfo.length === 1) {
        if (extraInfo[0] instanceof Error) {
          console.error(...extraInfo);
        } else {
          addBreadcrumb({
            type: 'default',
            level,
            message: data,
            data: extraInfo[0],
          });
        }
      } else {
        addBreadcrumb({
          type: 'default',
          level,
          message: data,
          data: extraInfo,
        });
      }
      captureMessage(data);
    }
  }
  : console.log.bind(console);

export const info = isProd
  ? (message, extra) => {
    addBreadcrumb({
      type: 'default',
      level: 'info',
      category: 'info',
      message,
      data: extra,
    });
  }
  : console.log.bind(console);

export const warn = isProd
  ? (...args) => log(...args, 'warning')
  : console.warn.bind(console);

export const error = isProd
  ? (...args) => log(...args, 'error')
  : console.error.bind(console);

export const debug = isProd ? () => {} : info;

if (typeof window === 'object') {
  window.logging = {
    info,
    warn,
    error,
    debug,
  };
}



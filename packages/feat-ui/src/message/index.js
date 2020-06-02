import React from 'react';
import { namespace as defaultNamespace } from '../config';
import Notification from './lib/Notifications';
import Icon from '../icon';

let defaultDuration = 1.5;
let defaultTop;
let messageInstance;
let key = 1;
let namespace = defaultNamespace;
let blockName = 'Message';
let getContainer;

async function getMessageInstance() {
  if (messageInstance) {
    return Promise.resolve(messageInstance);
  }
  return new Promise((resolve, _) => {
    Notification.newInstance({
      blockName,
      transitionName: 'move-up',
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
    }, (instance) => {
      messageInstance = instance;
      resolve(messageInstance)
    });
  })
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

// type ArgsProps = {
//   content: React.ReactNode,
//   duration: number,
//   type: NoticeType,
//   onClose?: () => void,
// }

async function notice(args) {
  const { content, type, onClose, duration = defaultDuration } = args;
  const iconType = {
    info: 'info',
    success: 'success',
    error: 'error',
    warning: 'warning',
    loading: 'loading',
  }[type];
  const instance = await getMessageInstance();
  instance.notice({
    key,
    duration,
    style: {},
    type,
    content: (
      <div className={`${namespace}-${blockName}__customContent`}>
        <Icon name={iconType} />
        <span>{content}</span>
      </div>
    ),
    onClose,
  });
  return (function() {
    const target = key++;
    return function() {
      instance.removeNotice(target);
    };
  })();
}

// type ConfigContent = React.ReactNode | string;
// type ConfigDuration = number;
// export type ConfigOnClose = () => void;

// export interface ConfigOptions {
//   top?: number;
//   duration?: number;
//   namespace?: string;
//   blockName?: string;
//   getContainer?: () => HTMLElement;
// }

const api = {
  config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.namespace !== undefined) {
      namespace = options.namespace;
    }
    if (options.blockName !== undefined) {
      blockName = options.blockName;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};

['info', 'success', 'error', 'warning', 'loading'].forEach((type) => {
  api[type] = (config) => {
    if (typeof config === 'object') {
      notice({ ...config, type });
    } else if (typeof config === 'string') {
      notice({
        content: config,
        type,
      });
    } else {
      console.error('Invalid Notice Params, Object Or String only.');
    }
  };
});
api.warn = api.warning;

export default api;

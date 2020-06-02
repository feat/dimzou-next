import React from 'react';
import Notification from '../message/lib/Notifications';
import { namespace as defaultNamespace } from '../config';
import Icon from '../icon';

const notificationInstance = {};
let defaultDuration = 4.5;
let defaultTop = 24;
let defaultBottom = 24;
let defaultPlacement = 'topRight';
const namespace = defaultNamespace;
const blockName = 'Notification';

function noop() {}

function getPlacementStyle(placement) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
    case 'bottomRight':
      style = {
        right: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      };
  }
  return style;
}

async function getNotificationInstance() {
  if (notificationInstance[defaultPlacement]) {
    Promise.resolve(notificationInstance[defaultPlacement]);
  }
  return new Promise((resolve, reject) => {
    Notification.newInstance({
      blockName,
      transitionName: 'move-up',
      style: getPlacementStyle(defaultPlacement),
    }, (instance) => {
      notificationInstance[defaultPlacement] = instance;
      resolve(instance)
    })
  });
}

// type ArgsProps = {
//   placement: string,
//   duration: number,
//   type: string,
//   description: string,
//   icon: node,
//   style: object,
//   className: string,
//   onClose: func,
//   key: string
// };

async function notice(args) {
  const prefixName = `${namespace}-${blockName}`;

  if (args.placement !== undefined) {
    defaultPlacement = args.placement;
  }

  let duration;
  if (args.duration === undefined) {
    duration = defaultDuration;
  } else {
    duration = args.duration;
  }
  const iconType = {
    info: 'info',
    success: 'success',
    error: 'error',
    warning: 'warning',
    loading: 'loading',
  }[args.type];

  let iconNode;
  if (args.icon) {
    iconNode = <span className={`${prefixName}__icon`}>{args.icon}</span>;
  } else if (args.type) {
    iconNode = (
      <Icon
        className={`${prefixName}__icon ${prefixName}__icon_${args.type}`}
        name={iconType}
      />
    );
  }

  const autoMarginTag =
    !args.description && iconNode ? (
      <span className={`${prefixName}__message-single-line-auto-margin`} />
    ) : null;

  const { style, className } = args;
  const instance = await getNotificationInstance(prefixName);
  instance.notice({
    content: (
      <div className={iconNode ? `${prefixName}_withIcon` : ''}>
        {iconNode}
        <div className={`${prefixName}__message`}>
          {autoMarginTag}
          {args.message}
        </div>
        <div className={`${prefixName}__description`}>{args.description}</div>
        {args.btn ? (
          <div className={`${prefixName}__btn`}>{args.btn}</div>
        ) : null}
      </div>
    ),
    duration,
    closable: true,
    onClose: args.onClose || noop,
    key: args.key,
    style: Object.assign({}, style),
    className,
    type: args.type,
  });
}

const api = {
  open(args) {
    notice(args);
  },
  close(key) {
    if (notificationInstance[defaultPlacement]) {
      notificationInstance[defaultPlacement].removeNotice(key);
    }
  },
  config(options) {
    const { duration, placement, bottom, top } = options;
    if (placement !== undefined) {
      defaultPlacement = placement;
    }
    if (bottom !== undefined) {
      defaultBottom = bottom;
    }
    if (top !== undefined) {
      defaultTop = top;
    }
    // delete notificationInstance
    if (placement !== undefined || bottom !== undefined || top !== undefined) {
      const notify = notificationInstance[defaultPlacement];
      if (notify) {
        notify.destroy();
      }
      notificationInstance[defaultPlacement] = null;
    }
    if (duration !== undefined) {
      defaultDuration = duration;
    }
  },
  destroy() {
    Object.keys(notificationInstance).forEach((key) => {
      notificationInstance[key].destroy();
      delete notificationInstance[key];
    });
  },
};

['success', 'info', 'warning', 'error'].forEach((type) => {
  api[type] = (args) => api.open(Object.assign({}, args, { type }));
});

api.warn = api.warning;

export default api;

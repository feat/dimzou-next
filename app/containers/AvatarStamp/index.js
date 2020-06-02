/**
 *
 * AvatarStamp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { DragSource } from 'react-dnd';
import Link from 'next/link'

import { getAvatar, getAppLink } from '@/utils/user';
import { DRAGGABLE_TYPE_USER } from '@/services/dnd';

import { formatMessage } from '@/services/intl';
import commonMessages from '@/messages/common';

import AvatarStampBase from '@feat/feat-ui/lib/avatar/AvatarStampII';

import './style.scss';

const stopPropagation = (e) => {
  e.stopPropagation();
};
export class AvatarStamp extends React.PureComponent {
  render() {
    const {
      connectDragSource,
      username,
      uid,
      className,
      uiMeta,
      uiExtraMeta,
      ...restProps
    } = this.props;

    return (
      <AvatarStampBase
        ref={(n) => {
          this.dom = ReactDOM.findDOMNode(n); // eslint-disable-line;
          connectDragSource(this.dom);
        }}
        className={className}
        uiMeta={uiMeta}
        uiExtraMeta={uiExtraMeta}
        username={
          uid ? (
            <Link 
              href={{
                pathname: '/user-profile',
                query: {
                  userId: uid,
                },
              }}
              as={getAppLink(uid)}
              prefetch={false}
            >
              <a onClick={stopPropagation}>
                {username || `${uid}`}
              </a>
            </Link>
          ) : (
            username || formatMessage(commonMessages.anonymous)
          )
        }
        altUsername={username || `${uid}`}
        avatar={getAvatar(this.props, 'md')}
        {...restProps}
      />
    );
  }
}

AvatarStamp.propTypes = {
  className: PropTypes.string,
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  username: PropTypes.string,
  online: PropTypes.bool,
  size: PropTypes.string,
  uiMeta: PropTypes.array,
  uiExtraMeta: PropTypes.array,
  // eslint-disable-next-line
  avatar: PropTypes.string,
  connectDragSource: PropTypes.func,
};

AvatarStamp.defaultProps = {
  size: 'sm',
  uiMeta: ['expertise'],
  uiExtraMeta: ['followButton'],
};

const userSource = {
  canDrag(props) {
    return !!props.uid;
  },
  beginDrag(props) {
    return {
      type: DRAGGABLE_TYPE_USER,
      payload: {
        user: {
          uid: props.uid,
          username: props.username,
          avatar: getAvatar(props, 'md'),
        },
      },
    };
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(DRAGGABLE_TYPE_USER, userSource, sourceCollect)(
  AvatarStamp,
);

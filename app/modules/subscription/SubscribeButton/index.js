import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { injectIntl } from 'react-intl';

import notification from '@feat/feat-ui/lib/notification';
import Button from '@feat/feat-ui/lib/button/Button';

import intlMessages from '../messages';
import { SubscriptionContext } from '../SubscriptionProvider';
import { SUBSCRIPTION_ENTITY_TYPE_EVENT, SUBSCRIPTION_ENTITY_TYPE_DIMZOU } from '../constants';

import './style.scss'

function SubscribeButton(props) {
  const [ fetching, setFetching ] = useState(false);
  const {
    data: { isReady },
    subscribe,
    unsubscribe,
    checkSubscribed,
  } = useContext(SubscriptionContext);
  const hasSubscribed = isReady && checkSubscribed({
    type: props.type,
    targetId: props.targetId,
    entityType: props.entityType,
  })

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        const func = hasSubscribed ? unsubscribe : subscribe;
        setFetching(true);
        func({
          type: props.type,
          targetId: props.targetId,
          entityType: props.entityType,
        }).catch((err) => {
          notification.error({
            title: 'Error',
            description: err.message,
          })
        }).finally(() => {
          setFetching(false);
        })
      }}
      disabled={fetching || !isReady}
      size={props.size}
      type={props.buttonType}
      className={classNames(props.className, 'ft-SubscribeButton')}
      style={props.style}
    >
      {props.children ?  props.children(hasSubscribed) : (
        props.intl.formatMessage(intlMessages[hasSubscribed ? 'unsubscribe' : 'subscribe'])
      )}
    </Button>
  )
}

SubscribeButton.propTypes = {
  type: PropTypes.oneOf([
    'user',
    'category',
  ]).isRequired,
  targetId: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf([
    SUBSCRIPTION_ENTITY_TYPE_EVENT,
    SUBSCRIPTION_ENTITY_TYPE_DIMZOU,
  ]).isRequired,
  intl: PropTypes.object,
  size: PropTypes.string,
  children: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  buttonType: PropTypes.string,
}

SubscribeButton.defaultProps = {
  buttonType: 'primaryOutline',
}


export default injectIntl(SubscribeButton);
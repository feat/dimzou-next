import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Block from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';

import { SubscriptionContext } from '../SubscriptionProvider';
import EventSubscription from '../EventSubscription';
import DimzouSubscription from '../DimzouSubscription';
import './style.scss';

function SubscriptionFeed(props) {
  const { data } = useContext(SubscriptionContext);

  const [view, useView] = useState('filex');

  if (!data.isReady || !Object.keys(data.users).length) {
    return null;
  }

  return (
    <Block
      title="Subscription"
      className="b-Subscription"
      style={props.style}
      subHeader={
        <>
          <Button
            type={view === 'dimzou' ? 'primary' : 'merge'}
            className="pull-right"
            onClick={() => {
              useView('dimzou');
            }}
          >
            Dimzou
          </Button>
          <Button
            type={view === 'filex' ? 'primary' : 'merge'}
            className="pull-right margin_r_24"
            onClick={() => {
              useView('filex');
            }}
          >
            File-X
          </Button>
        </>
      }
    >
      {view === 'filex' && <EventSubscription />}
      {view === 'dimzou' && <DimzouSubscription />}
    </Block>
  );
}

SubscriptionFeed.propTypes = {
  style: PropTypes.object,
};

export default SubscriptionFeed;

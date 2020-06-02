import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCurrentUser } from '@/modules/auth/selectors';
import XfileList from '@/modules/file-x/components/XfileList';
import notification from '@feat/feat-ui/lib/notification';

import { fetchSubscribedEvent } from '../requests';

function EventSubscription(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    hasMore: true,
  });

  const fetchData = (loading) => {
    if (loading) {
      fetchSubscribedEvent(data.next || { page_size: 10 })
        .then((res) => {
          setData({
            items: [...(data.items || []), ...res.data],
            next: res.pagination.next
              ? {
                page: res.pagination.next,
                page_size: res.pagination.page_size,
              }
              : null,
            hasMore: !!res.pagination.next,
          });
        })
        .catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(
    () => {
      fetchData(loading);
      return () => {
        setLoading(false);
      };
    },
    [loading],
  );

  return (
    <XfileList
      showUserInfo
      items={data.items || []}
      loading={loading}
      fetchItems={() => {
        setLoading(true);
      }}
      currentUser={props.currentUser}
      hasMore={data.hasMore}
      overflow
    />
  );
}

EventSubscription.propTypes = {
  currentUser: PropTypes.object,
};

const withConnect = connect((state, props) => ({
  currentUser: selectCurrentUser(state, props),
}));

export default withConnect(EventSubscription);

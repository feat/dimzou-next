import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';

import injectReducer from '@/utils/injectReducer';
import notification from '@feat/feat-ui/lib/notification';
import TemplateFeedList from '@/components/TemplateFeedList';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { makeSelectListState } from '../selectors';
import intlMessages from '../messages';
import { mapFeedTemplateFields } from '../utils';
import { asyncFetchUserDimzous } from '../actions';
import { REDUCER_KEY } from '../config';
import reducer from '../reducer';

function UserDimzouList(props) {
  const { list, templates, loading, hasMore, userId, onItemClick } = props;
  useEffect(
    () => {
      if (!props.onceFetched) {
        props.fetchUserDimzous({ userId });
      }
    },
    [userId],
  );
  return (
    <TemplateFeedList
      items={list ? list.map(mapFeedTemplateFields) : []}
      templates={templates || []}
      loading={loading}
      hasMore={hasMore}
      loadMore={() => {
        props.fetchUserDimzous({ userId }).catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        });
      }}
      noContentLabel={
        <TranslatableMessage message={intlMessages.noContentLabel} />
      }
      showAvatar={false}
      onItemClick={onItemClick}
    />
  );
}

UserDimzouList.propTypes = {
  list: PropTypes.array,
  templates: PropTypes.array,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  onceFetched: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchUserDimzous: PropTypes.func,
  onItemClick: PropTypes.func,
};

UserDimzouList.defaultProps = {
  onItemClick: (item) => {
    let href;
    let as;
    if (item.isDraft) {
      href = {
        pathname: '/dimzou-edit',
        query: {
          pageName: 'draft',
          bundleId: item.id,
        },
      };
      as = `/dimzou/${item.id}`;
    } else {
      href = {
        pathname: '/dimzou-view',
        query: {
          bundleId: item.id,
        },
      };
      as = `/draft/${item.id}`;
    }
    Router.push(href, as).then(() => {
      window.scrollTo(0, 0);
    });
  },
};

const mapDispatchToProps = {
  fetchUserDimzous: asyncFetchUserDimzous,
};

const withConnect = connect(
  makeSelectListState,
  mapDispatchToProps,
);

const withReducer = injectReducer({
  key: REDUCER_KEY,
  reducer,
});

export default compose(
  withReducer,
  withConnect,
)(UserDimzouList);

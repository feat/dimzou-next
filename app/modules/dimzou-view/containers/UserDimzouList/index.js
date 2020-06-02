import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';

import notification from '@feat/feat-ui/lib/notification';
import TemplateFeedList from '@/components/TemplateFeedList';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { makeSelectUserListState } from '../../selectors'
import intlMessages from './messages';
import { mapFeedTemplateFields } from './utils';
import { asyncFetchUserDimzous } from '../../actions';

function UserDimzouList(props) {
  const router = useRouter();
  const { list, templates, loading, hasMore, userId } = props;
  useEffect(() => {
    if (!props.onceFetched) {
      props.fetchUserDimzous({ userId });
    }
  }, [userId])
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
      itemProps={{
        showAvatar: false,
        onClick: (item) => {
          if (props.onItemClick) {
            props.onItemClick(item);
            return;
          }
          const href = {
            pathname: item.isDraft ? '/dimzou-edit' : '/dimzou-view',
            query: {
              bundleId: item.id,
            },
          };
          const as = item.isDraft ? `/draft/${item.id}` : `/dimzou/${item.id}`;
          router.push(href, as).then(() => {
            window.scrollTo(0, 0);
          });
        },
      }}
    />
  )
}

UserDimzouList.propTypes = {
  list: PropTypes.array,
  templates: PropTypes.array,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  onceFetched: PropTypes.bool,
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fetchUserDimzous: PropTypes.func,
  onItemClick: PropTypes.func,
}

const mapStateToProps = makeSelectUserListState();

const mapDispatchToProps = {
  fetchUserDimzous: asyncFetchUserDimzous,
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(UserDimzouList);
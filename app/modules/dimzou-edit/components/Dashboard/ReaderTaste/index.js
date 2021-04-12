import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import TemplateFeedList from '@/components/TemplateFeedList';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import StickyHeaderBlock from '../../StickyHeaderBlock';
import intlMessages from '../messages';
import { BUNDLE_TYPE_TRANSLATE } from '../../../constants';
import { selectReaderTaste } from '../../../selectors';
import { asyncFetchReaderTasteList } from '../../../actions';
import { getAsPath } from '../../../utils/router';

const mapEntities = (item) => ({
  title: item.title,
  body: item.summary,
  author: item.user,
  kind: item.kind,
  id: item.id,
  cover: item.cover_image,
  isDraft: !item.publish_time,
  isTranslation: item.type === BUNDLE_TYPE_TRANSLATE,
});

function ReaderTaste(props) {
  const state = useSelector(selectReaderTaste);
  const dispatch = useDispatch();
  const { list, templates, loading, hasMore } = state;
  const handleLoadMore = useCallback(() => {
    dispatch(
      asyncFetchReaderTasteList({
        userId: props.userId,
      }),
    );
  }, []);

  useEffect(() => {
    if (!state.onceFetched) {
      handleLoadMore();
    }
  }, []);

  const handleItemClick = useCallback((item) => {
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: item.isDraft ? 'draft' : 'view',
        bundleId: item.id,
      },
    };
    const asPath = getAsPath(href);
    Router.push(href, asPath).then(() => {
      window.scrollTo(0, 0);
    });
  });

  return (
    <StickyHeaderBlock
      className="ReaderArticles"
      title={<TranslatableMessage message={intlMessages.readersTaste} />}
      stickyTop="#header"
      stickyBottomBoundary=".ReaderArticles"
    >
      <TemplateFeedList
        items={list ? list.map(mapEntities) : []}
        templates={templates || []}
        loading={loading}
        hasMore={hasMore}
        watchScroll={false}
        loadMore={handleLoadMore}
        showAvatar={false}
        onItemClick={handleItemClick}
      />
    </StickyHeaderBlock>
  );
}

ReaderTaste.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ReaderTaste;

import React, { useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { maxTextContent } from '@/utils/content';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'next/router';

import { getImage } from '@/utils/pics';

import AvatarStamp from '@/containers/AvatarStamp';

import intlMessages from '../../messages';
import { CategoryTagReverse } from '../CategoryTags';
import { makeSelectPublicationCategories } from '../../selectors';
import styles from './index.module.scss';

function WorksBrief(props) {
  const {
    publication,
    publicationCategories,
    intl: { formatMessage },
  } = props;

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      props.router
        .push(
          {
            pathname: '/dimzou-view',
            query: { bundleId: publication.bundle_id },
          },
          `/dimzou/${publication.bundle_id}`,
        )
        .then(() => {
          window.scrollTo(0, 0);
        });
    },
    [publication.bundle_id],
  );

  return (
    <div
      className={classNames(styles.ViewWorkBrief, 'js-clickable')}
      key={publication.id}
      onClick={handleClick}
    >
      <div className={classNames(styles.ViewWorkBrief__header)}>
        <div className={classNames(styles.ViewWorkBrief__content)}>
          <h1 className={styles.ViewWorkBrief__title}>
            {maxTextContent(publication.title)}
          </h1>
          <div className={styles.ViewWorkBrief__summary}>
            {maxTextContent(publication.summary)}
            <div
              className={styles.ViewWorkBrief__readMore}
              onClick={handleClick}
            >
              {`${formatMessage(intlMessages.readFullArticle)} ->`}
            </div>
          </div>
        </div>
        <div className={styles.ViewWorkBrief__coverWrap}>
          <div
            className={styles.ViewWorkBrief__cover}
            style={{
              backgroundImage: `url(${getImage(
                publication.covers,
                'cover_sm',
                publication.cover,
              )})`,
            }}
          />
        </div>
      </div>
      <div className={styles.ViewWorkBrief__footer}>
        <div className="dz-Typo__avatar">
          <AvatarStamp
            {...publication.author}
            uiMeta={['expertise']}
            uiExtraMeta={['location']}
          />
        </div>
        <div className="dz-Typo__meta">
          <CategoryTagReverse
            stopPropagation
            className="pull-left"
            data={publicationCategories}
          />
        </div>
      </div>
    </div>
  );
}

const selectPublication = (state, props) => props.publication;
const mapStateToProps = () => {
  const selectPublicationCategories = makeSelectPublicationCategories(
    selectPublication,
  );
  return createStructuredSelector({
    publicationCategories: selectPublicationCategories,
  });
};

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  withRouter,
  injectIntl,
)(WorksBrief);

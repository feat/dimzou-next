import React, { useCallback } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { maxTextContent } from '@/utils/content';
import Clamp from '@feat/feat-ui/lib/clamp';
import { injectIntl } from 'react-intl'
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'next/router';

import { getImage } from '@/utils/pics';

import { CategoryTagReverse } from '@/components/CategoryTags';
import AvatarStamp from '@/containers/AvatarStamp';

import intlMessages from '../../../messages';
import { makeSelectPublicationCategories } from '../../../selectors';

function WorksBrief(props) {
  const { 
    publication,
    publicationCategories,
    intl: { formatMessage},
  } = props;

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    props.router.push({
      pathname: '/dimzou-view',
      query: { bundleId: publication.bundle_id },
    }, `/dimzou/${publication.bundle_id}`).then(() => {
      window.scrollTo(0, 0)
    })
  }, [publication.bundle_id])

  return (
    <div
      className="dz-ViewWorkBrief js-clickable"
      key={publication.id}
      onClick={handleClick}
    >
      <div className="dz-ViewWorkBrief__header">
        <div className="dz-ViewWorkBrief__content typo-Article">
          <h1 className="dz-ViewWorkBrief__title">
            <Clamp lines={2} ellipsis>
              {maxTextContent(publication.title)}
            </Clamp>
          </h1>
          <div className="dz-ViewWorkBrief__summary">
            <Clamp lines={3} ellipsis className="typo-Article__summary">
              {maxTextContent(publication.summary)}
            </Clamp>
            <div
              className="dz-ViewWorkBrief__readMore"
              onClick={handleClick}
            >
              {`${formatMessage(intlMessages.readFullArticle)} ->`}
            </div>
          </div>
        </div>
        <div className="dz-ViewWorkBrief__coverWrap">
          <div
            className="dz-ViewWorkBrief__cover"
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
      <div className="dz-ViewWorkBrief__footer">
        <div className="typo-Article__info" style={{ paddingLeft: 8, paddingRight: 8 }}>
          <div className="typo-Article__avatar">
            <AvatarStamp
              {...publication.author}
              uiMeta={['expertise']}
              uiExtraMeta={['location']}
            />
          </div>
          <div className="typo-Article__meta">
            <CategoryTagReverse
              stopPropagation
              className="pull-left"
              data={publicationCategories}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const selectPublication = (state, props) => props.publication;
const mapStateToProps = () => {
  const selectPublicationCategories = makeSelectPublicationCategories(
    selectPublication,
  );
  return createStructuredSelector({
    publicationCategories: selectPublicationCategories,
  })
}

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
  withRouter,
  injectIntl
)(WorksBrief);
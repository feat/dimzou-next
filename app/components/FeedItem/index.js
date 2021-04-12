import React from 'react';
import PropTypes from 'prop-types';

import ArticleItem from './Article';
// import CommentItem from './Comment';
// import ExpertiseItem from './Expertise';
import DraftItem from './Draft';

const FeedItem = (props) => {
  switch (props.entity_type) {
    case 'publication':
      return <ArticleItem {...props} />;
    case 'node':
      return <DraftItem {...props} />;
    default:
      logging.warn(`unkown feed type:  ${props.entity_type}`);
      return null;
  }
};

FeedItem.propTypes = {
  entity_type: PropTypes.string.isRequired,
};

export default FeedItem;

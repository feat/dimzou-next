import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { formatMessage } from '@/services/intl';

import rMessages from '../../messages'

function ChapterCard(props) {
  return (
    <div 
      className={classNames("dz-ChapterCard", {
        'is-selected': props.isSelected,
      })}
      onClick={props.onClick}
    >
      <h3 className="dz-ChapterCard__title">
        {props.title}
      </h3>
      <div className="dz-ChapterCard__summary">
        {props.summary}
      </div>
      {props.hasUpdate && props.oncePublished && (
        <div className="dz-ChapterCard__label">
          {formatMessage(rMessages.publishedWithUpdate)}
        </div>
      )}
      {!props.oncePublished && (
        <div className="dz-ChapterCard__label">
          {formatMessage(rMessages.notPublished)}
        </div>
      )}
    </div>
  )
}

ChapterCard.propTypes = {
  title: PropTypes.node,
  summary: PropTypes.node,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  hasUpdate: PropTypes.bool,
  oncePublished: PropTypes.bool,
}

export default ChapterCard;
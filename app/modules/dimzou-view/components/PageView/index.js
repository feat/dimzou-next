import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux';
import { getText } from '@/utils/content';
import RichContent from '@/components/RichContent';
import { selectPublication } from '../../selectors';

function PageView(props) {
  const { publicationId, className, ...restProps } = props;
  const publication = useSelector((state) => selectPublication(state, props));
  if (!publication) {
    return null;
  }

  return (
    <div className={classNames('t-ArticleWrap', className)} {...restProps}>
      <div className="typo-Article">
        <h1>{getText(publication.title)}</h1>
        <RichContent html={publication.content} /> 
      </div>
    </div>
  )
}

PageView.propTypes = {
  publicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default PageView;
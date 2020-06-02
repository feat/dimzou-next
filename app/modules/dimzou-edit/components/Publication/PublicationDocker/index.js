import React, { useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import DragDropBoard from '@/components/DragDropBoard';
import TranslateButton from './TranslateButton';
import ModifyButton from './ModifyButton';
import CommentButton from './CommentButton';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import { PublicationContext } from '../../../context';
import './style.scss';

const DELTA = 50;

function PublicationDocker(props) {
  const publicationState = useContext(PublicationContext)
  const bundleId = get(publicationState, 'data.bundle_id');
  const nodeId = get(publicationState, 'data.node_id');
  const publication = get(publicationState, 'data');
  const domRef = useRef(null);
  const lastBottom = useRef(null);
  const [shouldRender, setShouldRender] = useState(true);
  useEffect(() => {
    const watchScroll = () => {
      const container = document.querySelector('.dz-App');
      if (!container || (!domRef.current && !lastBottom.current)) {
        return;
      }
      const containerBox = container.getBoundingClientRect();
      let boxBottom;
      if (domRef.current) {
        const dockerBox = domRef.current.getBoundingClientRect();
        boxBottom = dockerBox.bottom;
      } else {
        boxBottom = lastBottom.current;
      }
      if (boxBottom < containerBox.bottom - DELTA) {
        setShouldRender(true);
      } else {
        lastBottom.current = boxBottom;
        setShouldRender(false);
      }
    }
    window.addEventListener('scroll', watchScroll);
    return () => {
      window.removeEventListener('scroll', watchScroll);
    }
  }, [])

  if (shouldRender && publication) {
    return (
      <DragDropBoard>
        <div 
          ref={domRef}
          className={classNames("dz-PublicationDockerWrap", props.className)}
        >
          <div className="dz-PublicationDocker">
            <div className="dz-PublicationDocker__action">
              <CommentButton key={nodeId} publication={publication} />
            </div>
            <div className="dz-PublicationDocker__action">
              <TranslateButton publication={publication} />
            </div>
            <div className="dz-PublicationDocker__action">
              <ModifyButton bundleId={bundleId} nodeId={nodeId} />
            </div>
            <div className="dz-PublicationDocker__action">
              <LikeButton publication={publication} />
            </div>
            <div className="dz-PublicationDocker__action">
              <ShareButton publication={publication} />
            </div>
          </div>
        </div>
      </DragDropBoard>
    )
  }
  return null;
  
  
}

PublicationDocker.propTypes = {
  className: PropTypes.string,
}

export default PublicationDocker;
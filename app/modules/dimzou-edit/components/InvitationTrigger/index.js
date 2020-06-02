import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import get from 'lodash/get'

import IconButton from '@feat/feat-ui/lib/button/IconButton';

import { openInvitation } from '../../actions';
import { getConfirmedText } from '../../utils/content';
import { BundleContext, NodeContext } from '../../context';
import shareIcon from '../../assets/icon-share.svg';

import './style.scss';

function InvitationTrigger(props) {
  const dispatch = useDispatch();
  const nodeState = useContext(NodeContext);
  const bundleState = useContext(BundleContext);
  const bundleId = get(bundleState, 'data.id')
  const nodeId = get(nodeState, 'data.id')
  const title = get(nodeState, 'data.text_title'); // TODO: get text title
  const author = get(nodeState, 'data.user');

  const handleClick = useCallback(() => {
    dispatch(
      openInvitation({
        bundleId,
        nodeId,
        title,
        author,
        meta: {
          blockId: props.blockId,
          structure: props.structure,
          rewordingId: props.rewordingId,
          content: getConfirmedText(props.htmlContent),
          username: props.username,
          userExpertise: props.userExpertise,
        },
      }),
    );
  }, [props.blockId, props.structure, props.rewordingId, props.htmlContent, props.username, props.userExpertise])


  return (
    <div className="dz-RewordingInvitation">
      <IconButton
        size="md"
        onClick={handleClick}
      >
        <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: shareIcon }} />
      </IconButton>
    </div>
  );
}

InvitationTrigger.propTypes = {
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.string,
  rewordingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  htmlContent: PropTypes.string,
  username: PropTypes.string,
  userExpertise: PropTypes.string,
};

export default InvitationTrigger;

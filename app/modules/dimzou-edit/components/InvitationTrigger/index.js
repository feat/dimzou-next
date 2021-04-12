import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

import { openInvitation } from '../../actions';
import { getConfirmedText } from '../../utils/content';
import { BundleContext, NodeContext } from '../../context';
import Icon from '../Icon';

import './style.scss';

function InvitationTrigger(props) {
  const dispatch = useDispatch();
  const { basic: nodeBasic } = useContext(NodeContext);
  const { data: bundleBasic } = useContext(BundleContext);
  const bundleId = bundleBasic.id;
  const nodeId = nodeBasic.id;
  const author = nodeBasic.user;
  const title = nodeBasic.text_title;

  const handleClick = useCallback(
    () => {
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
    },
    [
      props.blockId,
      props.structure,
      props.rewordingId,
      props.htmlContent,
      props.username,
      props.userExpertise,
    ],
  );

  return (
    <ButtonBase
      padding={false}
      className="dz-RewordingInvitation size_xs"
      onClick={handleClick}
    >
      <Icon name="share" />
    </ButtonBase>
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

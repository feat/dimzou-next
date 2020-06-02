import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import getConfig from 'next/config';

import { formatMessage } from '@/services/intl';
import Modal from '@feat/feat-ui/lib/modal';
import ShareModal from '@/modules/share/components/ShareModal';
import { selectCurrentUser } from '@/modules/auth/selectors';

import shareMessages from './shareMessages';
import {
  selectInvitationContext,
  selectUserInvitationCode,
  selectWorkspaceState,
} from '../../selectors'
import {
  asyncMarkRewordShared, 
  asyncCreateInvitation,
  closeInvitation,
} from '../../actions';
import { SOCIAL_INVITATION_TYPE_PUBLIC } from '../../constants';

export default function InvitationPanel() {
  const isInvitationPanelOpened = useSelector((state) => selectWorkspaceState(state).isInvitationPanelOpened);
  const invitationContext = useSelector(selectInvitationContext) || {};
  const currentUser = useSelector(selectCurrentUser);
  const invitation = useSelector((state) => selectUserInvitationCode(state, invitationContext));
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!invitation && currentUser.uid && invitationContext.bundleId) {
      dispatch(asyncCreateInvitation({
        bundleId: invitationContext.bundleId,
        nodeId: invitationContext.nodeId,
        data: {
          type: SOCIAL_INVITATION_TYPE_PUBLIC,
        },
      }))
    }
  }, [invitationContext.bundleId, currentUser.uid ])

  
  const { publicRuntimeConfig } = getConfig();
  if (!isInvitationPanelOpened) {
    return null;
  }

  const publicLink = invitation ? `${window.location.origin}/draft/${invitationContext.bundleId}/${invitationContext.nodeId}?invitation=${
    window.encodeURIComponent(invitation.code)
  }` : '';

  return (
    <Modal
      isOpen={isInvitationPanelOpened}
      onClose={() => {
        dispatch(closeInvitation(invitationContext))
      }}
      maskClosable
    >
      <ShareModal
        canShareWithSMS={false}
        onShareBtnClick={(data) => {
          if (invitationContext.meta.rewordingId) {
            dispatch(asyncMarkRewordShared({
              bundleId: invitationContext.bundleId,
              nodeId: invitationContext.nodeId,
              rewordingId: invitationContext.meta.rewordingId,
              ...data,
            }))
          }
        }}
        shareInfo={{
          link: publicLink,
          source: publicRuntimeConfig.share.host,
          sourceUrl: window.location.href,
          twitterVia: publicRuntimeConfig.share.twitter.via,
          emailSubject: formatMessage(shareMessages.emailSubject),
          emailBody: invitationContext.meta
            ? formatMessage(shareMessages.paraShareEmailBody, {
              link: publicLink,
              title: invitationContext.title,
              username: invitationContext.meta.username,
              userExpertise: invitationContext.meta.userExpertise,
              paraText: `${invitationContext.meta.content.slice(0, 20)}...`,
            })
            : formatMessage(shareMessages.emailBody, {
              site: window.location.host,
              link: publicLink,
              source: publicRuntimeConfig.share.host,
              author: invitationContext.author.username,
              username: currentUser.username,
              title: invitationContext.title,
            }),
          shareText: invitationContext.meta
            ? formatMessage(shareMessages.paraShareText, {
              link: publicLink,
              title: invitationContext.title,
              username: invitationContext.meta.username,
              userExpertise: invitationContext.meta.userExpertise,
              paraText: `${invitationContext.meta.content.slice(0, 20)}...`,
              source: publicRuntimeConfig.share.host,
            })
            : formatMessage(shareMessages.shareText, {
              link: publicLink,
              title: invitationContext.title,
              source: publicRuntimeConfig.share.host,
              author: invitationContext.author.username,
              authorExpertise: invitationContext.author.expertise,
            }),
        }}
      />
    </Modal>
  );
}
import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
import { injectIntl } from 'react-intl'
import getConfig from 'next/config'

import Modal from '@feat/feat-ui/lib/modal';
import ShareModal from '@/modules/share/components/ShareModal';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { maxTextContent } from '@/utils/content';

import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages, { share as shareMessages } from '../messages';

function ShareButton(props) {
  const [isOpened, setIsOpened] = useState(false)
  const { publication } = props;
  const currentUser = useSelector(selectCurrentUser);
  const shareInfo = useRef(null);
  const getShareInfo = useCallback(() => {
    const {
      publication,
      intl: { formatMessage },
    } = props;
    const { publicRuntimeConfig } = getConfig();
    const link = window.location.href;
    const source = publicRuntimeConfig.share.siteName;
    const summary = maxTextContent(publication.summary, 60);
    const title = maxTextContent(publication.title, 60);
    if (!shareInfo.current) {
      shareInfo.current = {
        link,
        source,
        sourceUrl: window.location.origin,
        twitterVia: publicRuntimeConfig.share.twitter.via,
        emailSubject: formatMessage(shareMessages.emailSubject, {
          title,
        }),
        emailBody: formatMessage(shareMessages.emailBody, {
          title,
          summary,
          source,
          link,
        }),
        shareText: formatMessage(shareMessages.shareText, {
          title,
          summary,
          source,
          link,
          author: publication.author.username,
          authorExpertise: publication.author.expertise,
        }),
      };
    }
    return shareInfo.current;
  }, [publication, currentUser])
  return (
      <>
        <Button
          type="merge" onClick={() => {
            setIsOpened(true);
          }}>
          <TranslatableMessage message={intlMessages.shareLabel} />
        </Button>
        {isOpened && (
          <Modal
            isOpen={isOpened}
            onClose={()=> {
              setIsOpened(false);
            }}
            maskClosable
          >
            <ShareModal shareInfo={getShareInfo()} />
          </Modal>
        )}
      </>
    
  )
}

ShareButton.propTypes = {
  publication: PropTypes.object,
}

export default injectIntl(ShareButton);
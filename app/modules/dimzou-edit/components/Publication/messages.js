import { defineMessages } from '@/services/intl';

export default defineMessages({
  translateLabel: {
    id: 'dz.publication.translate',
    defaultMessage: 'Translate',
  },
  creatingTranslationHint: {
    id: 'dz.publication.creating-translation-hint',
    defaultMessage: 'Creating Translation',
  },
  modifyLabel: {
    id: 'dz.publication.modify',
    defaultMessage: 'Modify',
  },
  commentLabel: {
    id: 'dz.publication.comment',
    defaultMessage: 'Comment',
  },
  shareLabel: {
    id: 'dz.publication.share',
    defaultMessage: 'Share',
  },
})

export const share = defineMessages({
  shareText: {
    id: 'dz.publication-share.text',
    defaultMessage:
      '【{title}】{summary} -- from {source}, author: {author}, good at: {authorExpertise}',
  },
  emailSubject: {
    id: 'dz.publication-share.email-subject',
    defaultMessage: 'Share: {title}',
  },
  emailBody: {
    id: 'dz.publication-share.email-body',
    defaultMessage:
      '[{title}] {summary} -- from { source }，Click to read: {link}',
  },
})
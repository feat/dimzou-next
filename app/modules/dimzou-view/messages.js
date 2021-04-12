import { defineMessages } from '@/services/intl';

export default defineMessages({
  shareText: {
    id: 'app.dimzou-share.share-text',
    defaultMessage:
      '【{title}】{summary} -- from {source}, author: {author}, good at: {authorExpertise}',
  },
  emailSubject: {
    id: 'app.dimzou-share.email-subject',
    defaultMessage: 'Share: {title}',
  },
  emailBody: {
    id: 'app.dimzou-share.email-body',
    defaultMessage:
      '[{title}] {summary} -- from { source }，Click to read: {link}',
  },
  draftLabel: {
    id: 'app.view-dimzou.draft',
    defaultMessage: 'Draft',
  },
  commentLabel: {
    id: 'app.view-dimzou.comment',
    defaultMessage: 'Comment',
  },
  modifyLabel: {
    id: 'app.view-dimzou.modify',
    defaultMessage: 'Modify',
  },
  translateLabel: {
    id: 'app.view-dimzou.translate',
    defaultMessage: 'Translate',
  },
  likeLabel: {
    id: 'app.view-dimzou.like',
    defaultMessage: 'Like',
  },
  shareLabel: {
    id: 'app.view-dimzou.share',
    defaultMessage: 'Share',
  },
  publishedAt: {
    id: 'app.view-dimzou.published-at',
    defaultMessage: 'Published at: {date}',
  },
  continueReading: {
    id: 'app.view-dimzou.continue-reading',
    defaultMessage: 'Continue Reading',
  },
  joinEditing: {
    id: 'app.view-dimzou.join-editing',
    defaultMessage: 'Join Editing...',
  },
  loading: {
    id: 'app.view-dimzou.loading',
    defaultMessage: 'Loading...',
  },
  creatingTranslationHint: {
    id: 'app.view-dimzou.creating-translation-hint',
    defaultMessage: 'Creating Translation',
  },
  creatingCopyHint: {
    id: 'app.view-dimzou.creating-copy-hint',
    defaultMessage: 'Creating draft',
  },
  readFullArticle: {
    id: 'app.view-dimzou.read-full-article',
    defaultMessage: 'Read Full Article',
  },
  updateTime: {
    id: 'app.view-dimzou.update-time',
    defaultMessage: 'Last Update:',
  },
  likesCount: {
    id: 'app.view-dimzou.likes-count',
    defaultMessage: 'Likes:',
  },
  reviewsCount: {
    id: 'app.view-dimzou.reviews-count',
    defaultMessage: 'Reviews:',
  },
});

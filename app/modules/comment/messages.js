import { defineMessages } from '@/services/intl';

import {
  COMMENTABLE_TYPE_ORDER,
  COMMENTABLE_TYPE_CAREER,
  COMMENTABLE_TYPE_EDUCATION,
  COMMENTABLE_TYPE_EVENT,
  COMMENTABLE_TYPE_PUBLICATION,
} from './constants';

export default defineMessages({
  newCommentTitle: {
    id: 'comment.notification-message.new-comment-title',
    defaultMessage: 'New comment',
  },
});

export const type = defineMessages(
  {
    [COMMENTABLE_TYPE_ORDER]: {
      id: 'comment.entity-type.order',
      defaultMessage: 'Order',
    },
    [COMMENTABLE_TYPE_CAREER]: {
      id: 'comment.entity-type.career',
      defaultMessage: 'Career',
    },
    [COMMENTABLE_TYPE_EDUCATION]: {
      id: 'comment.entity-type.education',
      defaultMessage: 'Education',
    },
    [COMMENTABLE_TYPE_EVENT]: {
      id: 'comment.entity-type.event',
      defaultMessage: 'Event',
    },
    [COMMENTABLE_TYPE_PUBLICATION]: {
      id: 'comment.entity-type.publication',
      defaultMessage: 'Article',
    },
  },
  {
    prefix: 'comment entity type:',
    fallback: (key) => ({
      id: `comment.entity-type-${key}`,
      defaultMessage: key,
    }),
  },
);

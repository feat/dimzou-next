import { defineMessages } from '@/services/intl';
import {
  LIKABLE_TYPE_DIMZOU_PUBLICATION,
  LIKABLE_TYPE_XFILE_EVENT,
} from './constants';

export const type = defineMessages(
  {
    [LIKABLE_TYPE_XFILE_EVENT]: {
      id: 'like.entity-type.event',
      defaultMessage: 'Event',
    },
    [LIKABLE_TYPE_DIMZOU_PUBLICATION]: {
      id: 'like.entity-type.publication',
      defaultMessage: 'Article',
    },
  },
  {
    prefix: 'like type messages: ',
    fallback: (key) => ({
      id: `like.entity-type.${key}`,
      defaultMessage: key,
    }),
  },
);

import React from 'react';

import { formatMessage } from '@/services/intl';

import MenuPages from '@/containers/MenuPages';
import intlMessages from './messages';

export default function(props) {
  return (
    <MenuPages
      {...props}
      pageTitle={formatMessage(intlMessages.pageTitle)}
      menuSlug="about"
    />
  );
}

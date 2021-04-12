import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as DropTipsGraph } from '@/images/drop-tips.svg';
import intlMessages from '../../messages';

export default function CoverDropTips() {
  const { formatMessage } = useIntl();
  return (
    <div className="dz-CoverSection__dropTips">
      <DropTipsGraph />
      <div className="dz-CoverSection__dropTips_tips">
        {formatMessage(intlMessages.dropImageTips)}
      </div>
    </div>
  );
}

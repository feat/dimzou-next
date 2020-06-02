import React from 'react';
import PropTypes from 'prop-types';

import {
  genderOption as genderOptionMessages,
  marriageOption as marriageOptionMessages,
} from '@/modules/user/messages';
import FtBlock from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { profile as profileMessages } from '@/modules/settings/messages';

import intlMessages from './messages';

import './index.scss';

const ViewBasicInfoBlock = (props) => {
  const { data } = props;

  const displayInfo = [];
  if (data.gender !== undefined && data.gender !== null) {
    displayInfo.push({
      key: 'gender',
      label: <TranslatableMessage message={profileMessages.genderLabel} />,
      value: (
        <TranslatableMessage message={genderOptionMessages[data.gender]} />
      ),
    });
  }
  if (data.age) {
    displayInfo.push({
      key: 'age',
      label: <TranslatableMessage message={profileMessages.ageLabel} />,
      value: data.age,
    });
  }
  if (data.marriage !== undefined && data.marriage !== null) {
    displayInfo.push({
      key: 'marriage',
      label: <TranslatableMessage message={profileMessages.marriageLabel} />,
      value: (
        <TranslatableMessage message={marriageOptionMessages[data.marriage]} />
      ),
    });
  }

  if (!props.shouldDisplayUsername && !displayInfo.length) {
    return null;
  }

  return (
    <FtBlock
      noPadding
      title={
        <span className="padding_x_5">
          {props.shouldDisplayUsername ? (
            data.username || data.uid
          ) : (
            <TranslatableMessage message={intlMessages.sectionTitle} />
          )}
        </span>
      }
      className="ViewBasicInfo"
    >
      {!!displayInfo.length && (
        <div className="ViewBasicInfoList margin_t_5">
          {displayInfo.map((item) => (
            <div className="ViewBasicInfoItem" key={item.key}>
              <span className="ViewBasicInfoItem__label">{item.label}</span>
              <span className="ViewBasicInfoItem__value">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </FtBlock>
  );
};

ViewBasicInfoBlock.propTypes = {
  data: PropTypes.object,
  shouldDisplayUsername: PropTypes.bool,
};

export default ViewBasicInfoBlock;

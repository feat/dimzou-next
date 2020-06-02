import React from 'react';
import PropTypes from 'prop-types';
import FtBlock from '@feat/feat-ui/lib/block';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import HonorItem from '@/modules/settings/containers/HonorBlock/HonorItem';

import intlMessages from './messages';

const ViewHonorsBlock = (props) => (
  <FtBlock
    noPadding
    title={
      <span className="padding_x_5">
        <TranslatableMessage message={intlMessages.sectionTitle} />
      </span>
    }
    className="ViewHonorsBlock"
  >
    <div className="padding_t_5">
      {props.data.map((honor, index) => (
        <HonorItem data={honor} key={index} />
      ))}
    </div>
  </FtBlock>
);

ViewHonorsBlock.propTypes = {
  data: PropTypes.array,
};

export default ViewHonorsBlock;

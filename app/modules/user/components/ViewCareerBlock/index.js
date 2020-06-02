import React from 'react';
import PropTypes from 'prop-types';

import FtBlock from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CareerItem from '@/modules/settings/containers/CareerBlock/CareerItem';
import intlMessages from './messages';
import './style.scss';

const ViewCareerBlock = (props) => (
  <FtBlock
    noPadding
    title={
      <span className="padding_x_5">
        <TranslatableMessage message={intlMessages.sectionTitle} />
      </span>
    }
  >
    <div className="ViewCareerGrid">
      {props.data.map((career) => (
        <CareerItem data={career} key={career.id} />
      ))}
    </div>
  </FtBlock>
);

ViewCareerBlock.propTypes = {
  data: PropTypes.array,
};

export default ViewCareerBlock;

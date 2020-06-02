import React from 'react';
import PropTypes from 'prop-types';

import FtBlock from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import EducationItem from '@/modules/settings/containers/EducationBlock/EducationItem';

import intlMessages from './messages';

const ViewEducationBlock = (props) => (
  <FtBlock
    noPadding
    title={
      <span className="padding_x_5">
        <TranslatableMessage message={intlMessages.sectionTitle} />
      </span>
    }
  >
    <div className="padding_t_5">
      {props.data.map((edu) => (
        <EducationItem data={edu} key={edu.id} />
      ))}
    </div>
  </FtBlock>
);

ViewEducationBlock.propTypes = {
  data: PropTypes.array,
};

export default ViewEducationBlock;

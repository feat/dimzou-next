import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FtBlock from '@feat/feat-ui/lib/block';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from '../ViewServiceTable/messages';
import './style.scss';


function ViewSimpleExpertise(props) {
  const { className, data } = props;
  return (
    <FtBlock
      noPadding
      className={classNames('ViewSimpleExpertise', className)}
      title={
        <span className="padding_l_5">
          <TranslatableMessage message={intlMessages.sectionTitle} />
        </span>
      }
    >
      {data.map((record) => (
        <div className="ViewSimpleExpertise__row" key={record.id}>
          <div className="ViewSimpleExpertise__title">
            <span>{record.name}</span>
          </div>
        </div>
      ))}
    </FtBlock>
  )
}

ViewSimpleExpertise.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
}

export default ViewSimpleExpertise;
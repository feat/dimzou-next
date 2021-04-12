import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Block from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import Collaborator from '../../Collaborator';
import styles from './index.module.scss';
import intlMessages from './messages';

function CollaboratorBlock(props) {
  const { data } = props;

  const nodeWords = useMemo(
    () => data.reduce((a, b) => a + b.contributing_words, 0),
    [data],
  );

  return (
    <Block
      title={
        <TranslatableMessage message={intlMessages.collaboratorBlockTitle} />
      }
      className="dz-ResourceStatistics__block"
    >
      {data && (
        <div className={styles.collaborators__grid}>
          {data.map((item) => (
            <div className={styles.collaborators__item} key={item.id}>
              <Collaborator data={item} nodeWords={nodeWords} />
            </div>
          ))}
        </div>
      )}
    </Block>
  );
}

CollaboratorBlock.propTypes = {
  data: PropTypes.array, // Array of collaborators
};

export default CollaboratorBlock;

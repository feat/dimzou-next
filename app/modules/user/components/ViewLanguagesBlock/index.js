import React from 'react';
import PropTypes from 'prop-types';
import FtBlock from '@feat/feat-ui/lib/block';
import FieldItem from '@/components/FieldItem';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import {
  LANGUAGE_LEVEL_NATIVE,
  LANGUAGE_LEVEL_PROFICIENCY,
  LANGUAGE_LEVEL_WORKABLE,
} from '@/modules/user/constants';
import { languageLevel as languageLevelMessages } from '@/modules/user/messages';

import intlMessages from './messages';

const clasifyLanguages = (records) => {
  const natives = [];
  const pros = [];
  const workables = [];
  records.forEach((item) => {
    switch (item.level) {
      case LANGUAGE_LEVEL_NATIVE:
        natives.push(item);
        break;
      case LANGUAGE_LEVEL_PROFICIENCY:
        pros.push(item);
        break;
      case LANGUAGE_LEVEL_WORKABLE:
        workables.push(item);
        break;
      default:
        logging.warn('Unknown language level', item);
    }
  });
  return { natives, pros, workables };
};

function ViewLanguagesBlock(props) {
  const { natives, pros, workables } = clasifyLanguages(props.data);
  return (
    <FtBlock
      title={
        <span className="padding_x_5">
          <TranslatableMessage message={intlMessages.sectionTitle} />
        </span>
      }
      noPadding
    >
      {!!natives.length && (
        <FieldItem
          modifier="dashed"
          label={
            <span className="t-label padding_l_5">
              <TranslatableMessage
                message={languageLevelMessages[LANGUAGE_LEVEL_NATIVE]}
              />
            </span>
          }
          content={natives.map((item) => (
            <span
              className="margin_r_5 padding_x_5"
              key={item.locale}
              style={{ display: 'inline-block' }}
            >
              {item.name}
            </span>
          ))}
        />
      )}
      {!!pros.length && (
        <FieldItem
          modifier="dashed"
          label={
            <span className="t-label padding_l_5">
              <TranslatableMessage
                message={languageLevelMessages[LANGUAGE_LEVEL_PROFICIENCY]}
              />
            </span>
          }
          content={pros.map((item) => (
            <span
              key={item.locale}
              className="margin_r_5 padding_x_5"
              style={{ display: 'inline-block' }}
            >
              {item.name}
            </span>
          ))}
        />
      )}
      {!!workables.length && (
        <FieldItem
          modifier="dashed"
          label={
            <span className="t-label padding_l_5">
              <TranslatableMessage
                message={languageLevelMessages[LANGUAGE_LEVEL_WORKABLE]}
              />
            </span>
          }
          content={workables.map((item) => (
            <span
              key={item.locale}
              className="margin_r_5 padding_x_5"
              style={{ display: 'inline-block' }}
            >
              {item.name}
            </span>
          ))}
        />
      )}
    </FtBlock>
  );
}

ViewLanguagesBlock.propTypes = {
  data: PropTypes.array,
};

export default ViewLanguagesBlock;

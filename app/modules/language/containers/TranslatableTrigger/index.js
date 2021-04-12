import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import {
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
} from '../../actions';

import { selectTranslatableTriggerState } from '../../selectors';
import TranslateIcon from '../../components/TranslateIcon';

const TranslatableTrigger = (props) => (
  <ButtonBase
    onClick={() => {
      if (props.isTranslateModeEnabled) {
        props.disableTranslationMode();
      } else if (props.isTranslateLanguageSelectOpened) {
        props.closeTranslateLanguageSelect();
      } else {
        props.openTranslateLanguageSelect();
      }
    }}
  >
    <TranslateIcon
      className={classNames('size_md', {
        'is-active':
          props.isTranslateModeEnabled || props.isTranslateLanguageSelectOpened,
      })}
    />
    {props.label}
  </ButtonBase>
);

TranslatableTrigger.propTypes = {
  isTranslateModeEnabled: PropTypes.bool,
  isTranslateLanguageSelectOpened: PropTypes.bool,
  disableTranslationMode: PropTypes.func.isRequired,
  closeTranslateLanguageSelect: PropTypes.func.isRequired,
  openTranslateLanguageSelect: PropTypes.func.isRequired,
  label: PropTypes.object,
};

const mapStateToDispatch = {
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
};

const withConnect = connect(
  selectTranslatableTriggerState,
  mapStateToDispatch,
);

export default withConnect(TranslatableTrigger);

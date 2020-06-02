import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import {
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
} from '../../actions';

import { selectTranslatableTriggerState } from '../../selectors';

const TranslatableTrigger = (props) => (
  <div
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
    <IconButton
      svgIcon="translate-v2"
      size="md"
      isActive={
        props.isTranslateModeEnabled || props.isTranslateLanguageSelectOpened
      }
    />
    {props.label}
  </div>
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

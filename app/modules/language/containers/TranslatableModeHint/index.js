import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { selectTranslatableModeHintInfo } from '../../selectors';

const TranslatableModeHint = ({
  isTranslateModeEnabled,
  sourceLocale,
  targetLocale,
}) =>
  isTranslateModeEnabled ? (
    <div style={{ position: 'fixed', right: 20, bottom: 80 }}>
      <span>{sourceLocale}</span>
      &nbsp;•••&nbsp;
      <span>{targetLocale}</span>
    </div>
  ) : null;

TranslatableModeHint.propTypes = {
  isTranslateModeEnabled: PropTypes.bool,
  sourceLocale: PropTypes.string,
  targetLocale: PropTypes.string,
};

export default connect(selectTranslatableModeHintInfo)(TranslatableModeHint);

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
      <div>
        <span>{sourceLocale}</span>
        &nbsp;•••&nbsp;
        <span>{targetLocale}</span>
      </div>
      <div>
        Press <kbd>Enter</kbd> to submit
      </div>
    </div>
  ) : null;

TranslatableModeHint.propTypes = {
  isTranslateModeEnabled: PropTypes.bool,
  sourceLocale: PropTypes.string,
  targetLocale: PropTypes.string,
};

export default connect(selectTranslatableModeHintInfo)(TranslatableModeHint);

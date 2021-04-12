import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LanguageSelectModal from '../../components/LanguageSelectModal';
import {
  enableTranslationMode,
  closeTranslateLanguageSelect,
  asyncFetchLocales,
  asyncCreateLocale,
} from '../../actions';
import { selectTranslateLanguageSelect } from '../../selectors';

const mapDispatchToProps = (dispatch) => ({
  createLocale: (payload) => dispatch(asyncCreateLocale(payload)),
  onConfirm: (value, option) => dispatch(enableTranslationMode(option)),
  onClose: () => dispatch(closeTranslateLanguageSelect()),
  fetchLocales: () => dispatch(asyncFetchLocales()),
});

function Wrap(props) {
  return props.isOpen && <LanguageSelectModal {...props} />;
}

Wrap.propTypes = {
  isOpen: PropTypes.bool,
};

export default connect(
  selectTranslateLanguageSelect,
  mapDispatchToProps,
)(Wrap);

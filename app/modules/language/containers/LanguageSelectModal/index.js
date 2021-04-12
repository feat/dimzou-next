/**
 *
 * LanguageSelectPanel
 *
 */

import { connect } from 'react-redux';

import LanguageSelectModal from '../../components/LanguageSelectModal';
import {
  asyncFetchLocales,
  asyncCreateLocale,
  // closeLanguageSelect,
  // changeLocale,
} from '../../actions';
import { selectLanguageSelect } from '../../selectors';

const mapDispatchToProps = (dispatch) => ({
  // onConfirm: (locale, option) =>
  //   dispatch(
  //     changeLocale({
  //       locale,
  //       localeLabel: option.label,
  //       localeRegion: option.label_region,
  //       forceRefresh: true,
  //     }),
  //   ),
  // onClose: () => dispatch(closeLanguageSelect()),
  fetchLocales: () => dispatch(asyncFetchLocales()),
  createLocale: (payload) => dispatch(asyncCreateLocale(payload)),
});

export default connect(
  selectLanguageSelect,
  mapDispatchToProps,
)(LanguageSelectModal);

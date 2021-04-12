/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 * 
 * 关于消息更新
 * - 在 翻译模式 下应避免更新。
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createIntl, RawIntlProvider } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { setIntl } from '@/services/intl';

import {
  selectCurrentLocale,
  selectMessages,
  selectLastUpdatedAt,
  isTranslateModeEnabled as isTranslateModeEnabledSelector,
} from '../selectors';

import { withFallbackLocale } from '../utils';

export class LanguageProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.intl = createIntl({
      locale: withFallbackLocale(this.props.locale),
      messages: this.props.messages,
    });
    setIntl(this.intl);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.intl = createIntl({
        locale: withFallbackLocale(this.props.locale),
        messages: this.props.messages,
      });
      setIntl(this.intl);
      this.forceUpdate();
    }
    // TODO check if messages has updated.
  }

  render() {
    // use key to trigger rerender
    return (
      <RawIntlProvider value={this.intl}>{this.props.children}</RawIntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  // isTranslateModeEnabled: PropTypes.bool,
  // isInitializing: PropTypes.bool,
  // lastUpdatedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.element.isRequired,
};

const mapStateToProps = createStructuredSelector({
  locale: selectCurrentLocale,
  messages: selectMessages,
  lastUpdatedAt: selectLastUpdatedAt,
  isTranslateModeEnabled: isTranslateModeEnabledSelector,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(LanguageProvider);

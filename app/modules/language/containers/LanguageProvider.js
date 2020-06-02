/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
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
  // eslint-disable-line react/prefer-stateless-function
  componentWillUpdate(nextProps) {
    logging.debug(
      'LanguageProvider update',
      nextProps.messages === this.props.messages,
    );
  }

  registerInlt = (n) => {
    if (n) {
      const { intl } = n.getChildContext();
      setIntl(intl);
    }
  };

  render() {
    const {
      messages,
      locale,
      lastUpdatedAt,
      isTranslateModeEnabled,
    } = this.props;
    if (!isTranslateModeEnabled) {
      this.key = lastUpdatedAt;
    }
    // use key to trigger rerender
    return (
      <IntlProvider
        locale={withFallbackLocale(locale)}
        key={this.key}
        messages={messages}
        ref={this.registerInlt}
      >
        {this.props.children}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  isTranslateModeEnabled: PropTypes.bool,
  // isInitializing: PropTypes.bool,
  lastUpdatedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import TranslatableForm from './TranslatableForm';
import { selectTranslatableState } from '../../selectors';

class TranslatableMessage extends React.PureComponent {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    logging.error(err, info);
  }

  render() {
    const { isTranslateModeEnabled, locale, message = {}, values } = this.props;
    if (this.state.hasError) {
      return <span>INVALID MESSAGE</span>;
    }

    if (isTranslateModeEnabled) {
      return (
        <TranslatableForm
          id={message.id}
          defaultMessage={message.defaultMessage}
          targetLocale={locale}
        />
      );
    }
    return <FormattedMessage {...message} values={values} />;
  }
}

TranslatableMessage.propTypes = {
  isTranslateModeEnabled: PropTypes.bool,
  locale: PropTypes.string,
  message: PropTypes.object,
  values: PropTypes.object,
};

const withConnect = connect(selectTranslatableState);

export default compose(withConnect)(TranslatableMessage);

import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

import DigitInput from '@feat/feat-ui/lib/digit-input';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';

import intlMessages from '../../messages';

const DIGIT_COUNT = 6;

class PhoneVerification extends React.Component {
  render() {
    const { initialValues, onSubmit } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(props) => {
          const {
            values,
            errors,
            setFieldValue,
            submitForm,
            isSubmitting,
          } = props;
          return (
            <form>
              <h3 style={{ fontSize: 20, textAlign: 'center' }}>
                <FormattedMessage {...intlMessages.registerEnterCodeLabel} />
              </h3>
              <p style={{ textAlign: 'center' }}>
                <FormattedMessage
                  {...intlMessages.registerEnterCodeHint}
                  values={{
                    phone: (
                      <span
                        style={{
                          fontWeight: 'bold',
                          marginLeft: '1em',
                          marginRight: '1em',
                        }}
                      >
                        {`+${this.props.callingCode}-${this.props.phone}`}
                      </span>
                    ),
                  }}
                />
              </p>
              <div style={{ marginTop: 36 }}>
                <DigitInput
                  digitCount={DIGIT_COUNT}
                  autoFocus
                  value={values.vcode}
                  onChange={(value) => {
                    setFieldValue('vcode', value);
                    if (value.length === DIGIT_COUNT) {
                      this.shouldSubmit = true;
                      if (this.timer) {
                        clearTimeout(this.timer);
                      }
                      this.timer = setTimeout(() => {
                        submitForm();
                      }, 200);
                    } else {
                      this.shouldSubmit = false;
                    }
                  }}
                  size="md"
                  disabled={this.props.submitting}
                />
              </div>

              <div
                style={{ textAlign: 'center' }}
                className={errors._error ? 'margin_y_12' : undefined}
              >
                {errors._error && (
                  <FormHelp data={errors._error} validateStatus="error" />
                )}
              </div>

              <div style={{ marginTop: 36, textAlign: 'center' }}>
                <Button
                  disabled={isSubmitting}
                  onClick={this.props.onChangePhone}
                  type="merge"
                >
                  {isSubmitting ? (
                    <Loader size="xs" color="inverse">
                      <FormattedMessage
                        {...intlMessages.registerVerifyingCodeLabel}
                      />
                    </Loader>
                  ) : (
                    <FormattedMessage
                      {...intlMessages.registerChangePhoneLabel}
                    />
                  )}
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    );
  }
}

PhoneVerification.propTypes = {
  onChangePhone: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

PhoneVerification.defaultProps = {
  initialValues: {
    vcode: '',
  },
}

export default PhoneVerification;

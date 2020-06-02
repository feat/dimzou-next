import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';
import mapErrorMessages from '@/utils/mapErrorMessages';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import TextInput from '@feat/feat-ui/lib/text-input';
import Button from '@feat/feat-ui/lib/button';
import CountdownButton from '@feat/feat-ui/lib/countdown-button';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import TextField from '@/components/Formik/TextField';
import CountrySelect from '@/components/CountrySelect';

import intlMessages from '../../messages';

const validate = (values) => {
  const { country, calling_code, phone, vcode } = values;

  const errors = {};

  if (!country) {
    errors.country = calling_code
      ? formatMessage(intlMessages.registerInvalidCallingCodeLabel)
      : formatMessage(formMessages.shortRequired);
  }
  if (!calling_code) {
    errors.calling_code = formatMessage(formMessages.shortRequired);
  }
  if (country && calling_code && country.calling_code !== calling_code) {
    errors.calling_code = formatMessage(
      intlMessages.registerInvalidCallingCodeLabel,
    );
  }
  if (!phone) {
    errors.phone = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.registerPhoneLabel),
    });
  }
  if (!vcode) {
    errors.password = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.codeLabel),
    });
  }
  return errors;
};

class LoginAccountForm extends React.Component {
  state = {
    sendingVerifyCode: false,
  };

  componentWillUnmount() {
    this.formProps = null;
  }

  sendVerifyCode = () => {
    const { calling_code: callingCode, phone, country } = this.formProps.values;
    const e164phone = `+${callingCode}-${phone}`;

    this.setState({
      sendingVerifyCode: true,
    });

    this.props
      .sendVerifyCode({
        country_code: country.iso3,
        phone: e164phone,
      })
      .then(() => {
        this.countdownBtn.start();
      })
      .catch((err) => {
        logging.error(err);
        if (err.code === 'VALIDATION_EXCEPTION') {
          this.formProps.setErrors(mapErrorMessages(err.data));
        } else {
          this.formProps.setErrors({
            _error: err.message,
          });
        }
      })
      .finally(() => {
        this.setState({ sendingVerifyCode: false });
      });
  };

  renderCodedownBtn = () => (
    <CountdownButton
      ref={(n) => {
        this.countdownBtn = n;
      }}
      onClick={this.sendVerifyCode}
      // type="merge"
      count={50}
      renderCountDown={(left) => `${left}s`}
      disabled={this.state.sendingVerifyCode}
      size="md"
    >
      {formatMessage(intlMessages.sendVerifyCodeLabel)}
    </CountdownButton>
  );

  render() {
    const { onSubmit, initialValues, originPhone, countryOptions } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
        innerRef={(n) => {
          this.formProps = n;
        }}
      >
        {(props) => {
          const {
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            isValid,
          } = props;

          const shouldShowCountryError =
            (touched.country && errors.country) ||
            (values.calling_code && !values.country && errors.country);

          return (
            <form className="AuthForm" onSubmit={handleSubmit}>
              <FormItem
                label={
                  <FormLabel>
                    {formatMessage(intlMessages.currentAccountLabel)}
                  </FormLabel>
                }
              >
                <TextInput size="md" block value={originPhone} disabled />
              </FormItem>
              <FormItem
                label={formatMessage(intlMessages.countryLabel)}
                validateStatus={shouldShowCountryError ? 'error' : undefined}
                modifier="dashed"
                help={
                  shouldShowCountryError && <FormHelp data={errors.country} />
                }
              >
                {({ handleFocus, handleBlur }) => (
                  <CountrySelect
                    value={values.country}
                    options={countryOptions}
                    onChange={(_, value) => {
                      setFieldValue('country', value);
                      setFieldValue('calling_code', value.calling_code);
                      const input = document.querySelector('.PhoneWidget');
                      if (input) {
                        input.focus();
                      }
                    }}
                    onOpen={handleFocus}
                    onClose={handleBlur}
                    placeholder={
                      values.calling_code && !values.country && errors.country
                        ? errors.country
                        : ''
                    }
                  />
                )}
              </FormItem>

              <FormItem
                label={formatMessage(intlMessages.phoneLabel)}
                validateStatus={
                  touched.phone && errors.phone ? 'error' : undefined
                }
                modifier="dashed"
              >
                {({ handleBlur, handleFocus, bindWidget }) => (
                  <TextInput
                    disabled={isSubmitting}
                    className="PhoneWidget"
                    name="phone"
                    style={{ paddingLeft: 12 }}
                    value={values.phone}
                    autoFocus
                    onChange={handleChange}
                    onFocus={() => {
                      handleFocus();
                    }}
                    onBlur={() => {
                      setFieldTouched('phone');
                      handleBlur();
                    }}
                    block
                    size="md"
                    ref={(n) => {
                      this.phoneInput = n;
                      bindWidget(n);
                    }}
                    addonBefore={
                      <TextInput
                        disabled={isSubmitting}
                        style={{ width: 80, textAlign: 'center' }}
                        size="md"
                        value={values.calling_code}
                        onChange={(e) => {
                          setFieldValue('calling_code', e.target.value);
                          const option = countryOptions.find(
                            (item) => item.calling_code === e.target.value,
                          );
                          if (!option) {
                            setFieldValue('country', null);
                          } else {
                            setFieldValue('country', option);
                          }
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    }
                  />
                )}
              </FormItem>

              <Field
                name="vcode"
                modifier="dashed"
                label={formatMessage(intlMessages.codeLabel)}
                size="md"
                component={TextField}
                addonAfter={
                  <CountdownButton
                    ref={(n) => {
                      this.countdownBtn = n;
                    }}
                    onClick={this.sendVerifyCode}
                    // type="merge"
                    count={50}
                    renderCountDown={(left) => `${left}s`}
                    disabled={
                      this.state.sendingVerifyCode ||
                      (errors.country || errors.phone)
                    }
                    size="md"
                  >
                    {formatMessage(intlMessages.sendVerifyCodeLabel)}
                  </CountdownButton>
                }
              />
              {errors._error && (
                <div className="ft-FormItem padding_t_12">
                  <FormHelp data={errors._error} validateStatus="error" />
                </div>
              )}
              {errors.token && (
                <div className="ft-FormItem padding_t_12">
                  <FormHelp data={errors.token} validateStatus="error" />
                </div>
              )}
              <Button
                className="margin_t_12 pull-right RecoveryStepNext"
                htmlType="submit"
                size="md"
                disabled={!isValid || isSubmitting}
                block
              >
                {formatMessage(intlMessages.submitLabel)}
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  }
}

LoginAccountForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  originPhone: PropTypes.string,
  countryOptions: PropTypes.array,
  sendVerifyCode: PropTypes.func,
};

export default LoginAccountForm;

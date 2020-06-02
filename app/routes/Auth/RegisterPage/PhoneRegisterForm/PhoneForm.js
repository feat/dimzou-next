import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Formik } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import TextInput from '@feat/feat-ui/lib/text-input';

import CountrySelect from '@/components/CountrySelect';

import intlMessages from '../../messages';

const validate = (values) => {
  const { country, calling_code, phone } = values;

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
  return errors;
};

class PhoneForm extends React.Component {
  state = {};

  componentWillUnmount() {
    if (this.formProps && this.props.onUnmount) {
      this.props.onUnmount(this.formProps.values);
      this.formProps = null;
    }
  }

  render() {
    const { initialValues, onSubmit, countryOptions } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
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
          } = props;

          const shouldShowCountryError =
            (touched.country && errors.country) ||
            (values.calling_code && !values.country && errors.country);

          return (
            <form className="Auth-Register" onSubmit={handleSubmit}>
              <FormItem
                label={
                  <FormattedMessage {...intlMessages.registerCountryLabel} />
                }
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
                      values.calling_code &&
                      !values.country &&
                      errors.country ? (
                          errors.country
                        ) : (
                          <FormattedMessage
                            {...intlMessages.registerCountryPlaceholder}
                          />
                        )
                    }
                  />
                )}
              </FormItem>

              <FormItem
                label={
                  <FormattedMessage {...intlMessages.registerPhoneLabel} />
                }
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
              <FormItem>
                {errors._error && (
                  <FormHelp data={errors._error} validateStatus="error" />
                )}
                <Button
                  disabled={isSubmitting}
                  className="margin_t_24"
                  htmlType="submit"
                  block
                  size="md"
                >
                  {isSubmitting ? (
                    <Loader size="xs" className="margin_r_5" color="inverse">
                      <FormattedMessage
                        {...intlMessages.registerSendingCodeLabel}
                      />
                    </Loader>
                  ) : (
                    <span
                      style={{ fontWeight: 'bold', verticalAlign: 'middle' }}
                    >
                      <FormattedMessage {...intlMessages.registerNextLabel} />
                    </span>
                  )}
                </Button>
              </FormItem>
            </form>
          );
        }}
      </Formik>
    );
  }
}

PhoneForm.propTypes = {
  onUnmount: PropTypes.func.isRequired,
}

export default PhoneForm;

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import CountrySelect from '@/components/CountrySelect';
import TextInput from '@feat/feat-ui/lib/text-input';

import Button from '@feat/feat-ui/lib/button';

import intlMessages from '../../messages';

const validate = (values) => {
  const { country, calling_code, phone } = values;

  const errors = {};

  if (!country) {
    errors.country = calling_code
      ? formatMessage(intlMessages.invalidCallingCodeLabel)
      : formatMessage(formMessages.shortRequired);
  }
  if (!calling_code) {
    errors.calling_code = formatMessage(formMessages.shortRequired);
  }
  if (country && calling_code && country.calling_code !== calling_code) {
    errors.calling_code = formatMessage(intlMessages.countryLabel);
  }
  if (!phone) {
    errors.phone = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.phoneLabel),
    });
  }
  return errors;
};

class IdentityForm extends React.Component {
  componentDidMount() {
    if (this.props.autoSubmit && this.formProps) {
      this.formProps.submitForm();
    }
  }

  componentWillUnmount() {
    if (this.formProps && this.formProps.values && this.props.onUnmount) {
      this.props.onUnmount(this.formProps.values);
    }
    this.formProps = null;
  }

  render() {
    const { countryOptions, initialValues, onSubmit } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        ref={(n) => {
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
            <form onSubmit={handleSubmit} id="recovery-phone-form">
              <FormItem
                label={<FormattedMessage {...intlMessages.countryLabel} />}
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
                    onChange={(value) => {
                      setFieldValue('country', value);
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
                            {...intlMessages.countryPlaceholder}
                          />
                        )
                    }
                  />
                )}
              </FormItem>

              <FormItem
                label={<FormattedMessage {...intlMessages.phoneLabel} />}
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
              {errors._error && (
                <div className="margin_y_12">
                  <FormHelp data={errors._error} validateStatus="error" />
                </div>
              )}
              <Button
                className="margin_t_12 pull-right RecoveryStepNext"
                block
                htmlType="submit"
                size="md"
                disabled={isSubmitting}
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

IdentityForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default IdentityForm;

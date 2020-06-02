/**
 *
 * LoginForm
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import { Field, Formik } from 'formik';
import Link from 'next/link'
import { withRouter } from 'next/router'

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
// import Button from '@feat/feat-ui/lib/button';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import CountrySelect from '@/components/CountrySelect';
import TextInput from '@feat/feat-ui/lib/text-input';

import PasswordField from '@/components/Formik/PasswordField';
import intlMessages from './messages';

const validate = (values) => {
  const { country, calling_code, phone, password } = values;

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
  if (!password) {
    errors.password = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.registerPasswordLabel),
    });
  }
  return errors;
};

const MAX_TRIES_COUNT = 3;

// eslint-disable-next-line
class LoginForm extends Component {
  componentWillUnmount() {
    if (this.formProps && this.formProps.values && this.props.onUnmount) {
      this.props.onUnmount(this.formProps.values)
    }
  }

  render() {
    const { initialValues, countryOptions, onSubmit } = this.props;

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
            handleReset,
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            isValid,
            dirty,
            submitCount,
          } = props;

          if (!isSubmitting && submitCount >= MAX_TRIES_COUNT) {
            this.props.router.push({
              pathname: '/auth/account-recovery',
              query: this.props.router.query,
            })
            return null;
          }

          const shouldShowCountryError =
            (touched.country && errors.country) ||
            (values.calling_code && !values.country && errors.country);

          // const shouldShowForgetLink = submitCount >= MAX_TRIES_COUNT || (submitCount === MAX_TRIES_COUNT-1 && !isSubmitting );

          return (
            <form
              className={classNames('LoginForm', { shaking: errors._error })}
              onSubmit={handleSubmit}
            >
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
              <Field
                name="password"
                component={PasswordField}
                size="md"
                type="password"
                label={
                  <FormattedMessage {...intlMessages.registerPasswordLabel} />
                }
              />
              {errors._error && (
                <FormHelp validateStatus="error" data={errors._error} />
              )}
              <div
                className="LoginForm__help margin_y_12"
                style={{ textAlign: 'right' }}
              >
                <Link
                  href={{
                    pathname: '/auth/account-recovery',
                    query: this.props.router.query,
                  }}
                >
                  <a className="LoginForm__forget">
                    <FormattedMessage
                      {...intlMessages.forgetPasswordLabel}
                    />
                  </a>
                </Link>
              </div>

              <div
                className="LoginForm__footer"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 12,
                }}
              >
                <IconButton
                  svgIcon="no-btn"
                  size="md"
                  disabled={!dirty || isSubmitting}
                  onClick={handleReset}
                  className="margin_r_12"
                />
                <IconButton
                  svgIcon="ok-btn"
                  size="md"
                  htmlType="submit"
                  disabled={!isValid || isSubmitting}
                />
              </div>

              {/* <Button
                className="LoginForm__submit margin_t_12"
                block
                htmlType="submit"
                disabled={submitting}
              >
                <TranslatableMessage message={menuMessages.signIn} />
              </Button> */}
            </form>
          );
        }}
      </Formik>
    );
  }
}

LoginForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  countryOptions: PropTypes.array,
};

export default withRouter(LoginForm);

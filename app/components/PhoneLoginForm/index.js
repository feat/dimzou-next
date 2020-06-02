/**
 *
 * PhoneLoginForm
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';

import { selectCountryCallingCodes } from '@/modules/choices/selectors';
import { asyncFetchCountryCallingCodes } from '@/modules/choices/actions';
import { asyncLoginWithPhone } from '@/modules/auth/actions';
import storage from '@/utils/storage';
import mapErrorMessages from '@/utils/mapErrorMessages';

import notification from '@feat/feat-ui/lib/notification';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import authCache from '@/modules/auth/cache';

import Form from './Form';

const CACHE_KEY = 'form.phone-login';

// eslint-disable-next-line
class PhoneLoginForm extends Component {
  componentDidMount() {
    if (!this.props.countryCallingCodes) {
      this.props.fetchCountryCallingCodes().catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        })
      });
    }
    import('fingerprintjs2').then(({ default: Fingerprint }) => {
      // -----获取指纹---------------------------
      new Fingerprint().get((fingerprint) => {
        this.fingerprint = fingerprint;
      });
    });
  }

  getIntialValues() {
    if (this.initialValues) {
      return this.initialValues;
    }
    
    if (
      authCache.getInitType() !== 'last_logined' &&
      !authCache.isDirty()
    ) {
      try {
        const cachedData = JSON.parse(storage.getItem(CACHE_KEY));
        const options = get(this.props.countryCallingCodes, 'data');
        const country = options.find((item) => item.iso3 === cachedData.country);
        if (country) {
          authCache.initWithLastLogined({
            country,
            phone: cachedData.phone,
          })
        }
      } catch (err) {
        logging.debug(err);
        // initial with default
        const defaultCountry = get(
          this.props.countryCallingCodes,
          'meta.default.iso3',
        );
        const country = this.props.countryCallingCodes.data.find(
          (item) => item.iso3 === defaultCountry,
        );
        if (country) {
          authCache.initWithRegionDefault({
            country,
            phone: '',
          })
        }
      }  
    }
    
    const { country, phone } = authCache.getData();
    this.initialValues = {
      calling_code: country ? country.calling_code : '',
      phone: phone || '',
      country,
      password: '',
    }
    return this.initialValues;
  }

  handleSubmit = (values, actions) => {
    const { calling_code: callingCode, country, phone, password } = values;
    const { setSubmitting, setErrors } = actions;

    return this.props
      .loginWithPhone({
        callingCode,
        country,
        phone,
        password,
        fingerprint: this.fingerprint,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message || err.code });
        }
        setSubmitting(false);
      });
  };

  render() {
    if (!this.props.countryCallingCodes) {
      return <MaskLoader size="md" color="inverse" />;
    }
    const initialValues = this.getIntialValues();

    return (
      <Form
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        countryOptions={this.props.countryCallingCodes.data}
        onUnmount={({ country, phone }) => {
          authCache.update({
            country,
            phone,
          })
        }}
      />
    );
  }
}

PhoneLoginForm.propTypes = {
  countryCallingCodes: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object,
  }),
  fetchCountryCallingCodes: PropTypes.func,
  loginWithPhone: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  countryCallingCodes: selectCountryCallingCodes,
});

const mapDispatchToProps = {
  fetchCountryCallingCodes: asyncFetchCountryCallingCodes,
  loginWithPhone: asyncLoginWithPhone,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneLoginForm);

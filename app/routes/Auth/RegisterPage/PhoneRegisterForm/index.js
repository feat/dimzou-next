import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import notification from '@feat/feat-ui/lib/notification';

import mapErrorMessages from '@/utils/mapErrorMessages';

import { selectCountryCallingCodes } from '@/modules/choices/selectors';
import { asyncFetchCountryCallingCodes } from '@/modules/choices/actions';
import { asyncLoginWithPhone } from '@/modules/auth/actions';
import authCache from '@/modules/auth/cache';


import {
  getVerificationCode as getVerificationCodeRequest,
  verifyCode as verifyCodeRequest,
  register as registerRequest,
} from './requests';

import PhoneForm from './PhoneForm';
import PhoneVerification from './PhoneVerification';
import CreateAccount from './CreateAccount';

const FORM_ID = 'form-130';
class RegisterForm extends React.Component {
  state = {
    step: 'PhoneForm',
    phone: '',
    country: null,
    callingCode: '',
    vcode: '',
    token: null,
  };

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
  }

  getInitialValues = () => {
    if (this.state.callingCode) {
      return {
        calling_code: this.state.callingCode,
        phone: this.state.phone,
        country: this.state.country,
      };
    }
    if (!authCache.getInitType()) {
      const { meta, data } = this.props.countryCallingCodes;
      const defaultCountry = get(meta, 'default.iso3');
      const country = defaultCountry && data.find(
        (item) => item.iso3 === defaultCountry,
      );
      if (country) {
        authCache.initWithRegionDefault({
          country,
          phone: '',
        })
      }
    }
    const { country, phone } = authCache.getData();

    return {
      calling_code: country ? country.calling_code : '',
      phone: phone || '',
      country,
      password: '',
    }
  };

  handleChangePhone = () => {
    this.setState({
      step: 'PhoneForm',
    });
  };

  handlePhoneForm = (values, { setSubmitting, setErrors }) => {
    const { calling_code: callingCode, phone, country } = values;

    const preData = {
      phone: `+${callingCode}-${phone}`,
      country_code: country.iso3,
      form_id: FORM_ID,
    };

    return getVerificationCodeRequest(preData)
      .then(() => {
        this.setState({
          step: 'PhoneVerification',
          callingCode,
          phone,
          country,
        });
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
      });
  };

  handleVerificationForm = (values, { setSubmitting, setErrors }) => {
    const phone = `+${this.state.callingCode}-${this.state.phone}`;
    const preData = {
      country_code: this.state.country.iso3,
      phone,
      vcode: values.vcode,
      form_id: FORM_ID,
    };

    return verifyCodeRequest(preData)
      .then(({ data }) => {
        this.setState({
          vcode: values.vcode,
          token: data.token,
          step: 'CreateAccount',
        });
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
        setSubmitting(false);
      });
  };

  handleCreateAccount = (values, { setSubmitting, setErrors }) => {
    const e164phone = `+${this.state.callingCode}-${this.state.phone}`;
    const countryCode = this.state.country.iso3;
    const { password } = values;

    const preData = {
      phone: e164phone,
      country_code: countryCode,
      password,
      form_id: FORM_ID,
      vcode: this.state.vcode,
      token: this.state.token,
    };
    return registerRequest(preData)
      .then(() => {
        this.autoLogin({
          callingCode: this.state.callingCode,
          country: this.state.country,
          phone: this.state.phone,
          password,
        });
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
        setSubmitting(false);
      });
  };

  autoLogin = (values) => {
    import('fingerprintjs2').then(({ default: Fingerprint }) => {
      // -----获取指纹---------------------------
      new Fingerprint().get((fingerprint) => {
        this.props.loginWithPhone({
          ...values,
          fingerprint,
        }).then(() => {
          window.location.reload();
        }).catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          })
        });
      });
    }).catch((err) => {
      logging.error(err);
    })
  };

  renderPhoneForm() {
    return (
      <PhoneForm
        initialValues={this.getInitialValues()}
        onSubmit={this.handlePhoneForm}
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

  renderPhoneVerification() {
    return (
      <PhoneVerification
        callingCode={this.state.callingCode}
        phone={this.state.phone}
        onSubmit={this.handleVerificationForm}
        onChangePhone={this.handleChangePhone}
      />
    );
  }

  renderCreateAccount() {
    return <CreateAccount onSubmit={this.handleCreateAccount} />;
  }

  render() {
    if (!this.props.countryCallingCodes) {
      return <MaskLoader size="md" color="inverse" />;
    }
    return this[`render${this.state.step}`]();
  }
}

RegisterForm.propTypes = {
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
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
)(RegisterForm);

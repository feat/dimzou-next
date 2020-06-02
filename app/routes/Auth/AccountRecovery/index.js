/**
 *
 * ForgetPasswordPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';

import mapErrorMessages from '@/utils/mapErrorMessages';

import { selectCountryCallingCodes } from '@/modules/choices/selectors';
import { asyncFetchCountryCallingCodes } from '@/modules/choices/actions';

import Block from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import authCache from '@/modules/auth/cache';

import IdentityForm from './components/IdentityForm';
import RecoveryFieldForm from './components/RecoveryFieldForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import ChangePasswordSuccess from './components/ChangePasswordSuccess';
import ResetLoginAccountSuccess from './components/ResetLoginAccountSuccess';
import LoginAccountForm from './components/LoginAccountForm';
import SecurityForm from './components/SecurityForm';


import {
  verifySecurityInfo as verifyIdentityRequest,
  getSecurityHint as getSecurityKeyRequest,
  changePassword as changePasswordRequest,
  sendResetCode as sendResetCodeRequest,
  resetLoginAccount as resetLoginAccountRequest,
} from './requests';

import intlMessages from './messages';

import {
  STEP_VERIFY_IDENTITY,
  STEP_VERIFY_SECURITY,
  STEP_SELECT_RECOVERY_FIELD,
  STEP_CHANGE_PASSWORD,
  STEP_UPDATE_CODE_PHRASE,
  STEP_RESET_LOGIN_ACCOUNT,
  STEP_CHANGE_PASSWORD_SUCCESS,
  STEP_UPDATE_CODE_PHRASE_SUCCESS,
  STEP_RESET_LOGIN_ACCOUNT_SUCCESS,
} from './constants';

// import {
//   verifyIdentityPromiseCreator,
//   changePasswordPromiseCreator,
//   updateCodePhrasePromiseCreator,
//   resetLoginAccountPromiseCreator,
//   fetchSecurityKeyPromiseCreator,
//   setRecoveryField,
//   resetRecovery,
//   // fetchSecurityKey,
// } from './actions';

import './style.scss';

// eslint-disable-next-line react/prefer-stateless-function
export class AccountRecovery extends React.Component {
  state = {
    step: STEP_VERIFY_IDENTITY,
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

  getIdentityFormInitialValues() {
    if (this.identityFormInitialValues) {
      return this.identityFormInitialValues;
    }
    if (!authCache.getInitType()) {
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

    const { country, phone } = authCache.getData();
    this.identityFormInitialValues = {
      calling_code: country ? country.calling_code : '',
      phone: phone || '',
      country,
      password: '',
    }
    return this.identityFormInitialValues;
  }

  getAccountFormInitialValues() {
    if (!this.accountFormInitialValues) {
      const iso3 = get(this.props.countryCallingCodes, 'meta.default.iso3');
      const country = this.props.countryCallingCodes.data.find(
        (item) => item.iso3 === iso3,
      );
      this.accountFormInitialValues = {
        country,
        calling_code: country ? country.calling_code : '',
        phone: '',
        vcode: '',
      };
    }
    return this.accountFormInitialValues;
  }

  verifyIdentity = (values, { setSubmitting, setErrors }) => {
    verifyIdentityRequest(values)
      .then((res) => {
        logging.debug(res);
        this.setState({
          step: STEP_SELECT_RECOVERY_FIELD,
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

  fetchSecurityKey = (values, { setSubmitting, setErrors }) => {
    const { calling_code: callingCode, phone } = values;

    const e164phone = `+${callingCode}-${phone}`;
    getSecurityKeyRequest({
      phone: e164phone,
    })
      .then(({ data }) => {
        this.setState({
          // callingCode,
          // phone,
          e164phone,
          question: data.question,
          step: STEP_VERIFY_SECURITY,
        });
      })
      .catch((err) => {
        logging.debug(err);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
        setSubmitting(false)
      });
  };

  changePassword = (values, { setSubmitting, setErrors }) => {
    const password = values.new_password;
    changePasswordRequest({
      phone: this.state.e164phone,
      new_password1: password,
      new_password2: password,
    })
      .then((res) => {
        logging.debug(res);
        this.setState({
          step: STEP_CHANGE_PASSWORD_SUCCESS,
          newPassword: password,
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

  resetLoginAccount = (values, { setErrors, setSubmitting }) => {
    const { calling_code: callingCode, phone, country, vcode } = values;
    const e164phone = `+${callingCode}-${phone}`;
    return resetLoginAccountRequest({
      country_code: country.iso3,
      phone: e164phone,
      vcode,
    })
      .then(() => {
        authCache.update({
          country,
          phone,
        })
        this.setState({
          newLoginAccount: e164phone,
          step: STEP_RESET_LOGIN_ACCOUNT_SUCCESS,
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

  selectRecoveryField = (values) => {
    this.setState({
      step: values.type,
    });
  };

  renderIdentityForm() {
    const initialValues = this.getIdentityFormInitialValues();
    return (
      <div className="p-AuthRecovery">
        <div className="p-AuthRecovery__left">
          <div className="p-AuthRecovery__hint">
            <div className="p-AuthRecovery__hintText">
              <FormattedHTMLMessage {...intlMessages.changePasswordHint} />
            </div>
          </div>
          {/* <div className="AuthPageTemplate__separator" /> */}
        </div>

        <div className="p-AuthRecovery__right">
          <div className="p-AuthRecovery__form">
            <IdentityForm
              countryOptions={this.props.countryCallingCodes.data}
              initialValues={this.getIdentityFormInitialValues()}
              onSubmit={this.fetchSecurityKey}
              autoSubmit={!!initialValues.phone}
            />
          </div>
        </div>
      </div>
    );
  }

  renderSecurityForm() {
    return (
      <div className="p-AuthRecovery">
        <div className="p-AuthRecovery__left">
          <div className="p-AuthRecovery__hint">
            <div className="p-AuthRecovery__hintText">
              <FormattedHTMLMessage {...intlMessages.changePasswordHint} />
            </div>
          </div>
        </div>
        <div className="p-AuthRecovery__right">
          <div className="p-AuthRecovery__form">
            <SecurityForm
              initialValues={{
                phone: this.state.e164phone,
                question: this.state.question,
                answer: '',
              }}
              onSubmit={this.verifyIdentity}
            />
          </div>
        </div>
      </div>
    );
  }

  renderSelectField() {
    return (
      <div className="p-AuthRecovery">
        <div className="p-AuthRecovery__left">
          <div className="p-AuthRecovery__hint">
            <div className="p-AuthRecovery__hintText">
              <FormattedHTMLMessage {...intlMessages.changePasswordHint} />
            </div>
            <div className="AuthPageTemplate__separator" />
          </div>
        </div>
        <div className="p-AuthRecovery__right">
          <div className="p-AuthRecovery__form">
            <h3>{formatMessage(intlMessages.actionQuestion)}</h3>
            <RecoveryFieldForm onSubmit={this.selectRecoveryField} />
          </div>
        </div>
      </div>
    );
  }

  renderChangePasswordForm() {
    return (
      <div className="p-AuthRecovery">
        <div className="p-AuthRecovery__left">
          <div className="p-AuthRecovery__hint">
            <div className="p-AuthRecovery__hintText">
              <FormattedHTMLMessage {...intlMessages.changePasswordHint} />
            </div>
          </div>
        </div>
        <div className="p-AuthRecovery__right">
          <div className="p-AuthRecovery__form">
            <Block
              title={<FormattedMessage {...intlMessages.changePasswordTitle} />}
            >
              <ChangePasswordForm onSubmit={this.changePassword} />
              <Button
                type="merge"
                size="sm"
                onClick={() => {
                  this.setState({
                    step: STEP_SELECT_RECOVERY_FIELD,
                  });
                }}
                style={{ marginTop: 10 }}
              >
                {formatMessage(intlMessages.reselectRecoveryField)}
              </Button>
            </Block>
          </div>
        </div>
      </div>
    );
  }

  resetLoginAccountForm() {
    return (
      <div className="p-AuthRecovery">
        <div className="p-AuthRecovery__left">
          <div className="p-AuthRecovery__hint">
            <div className="p-AuthRecovery__hintText">
              <FormattedHTMLMessage {...intlMessages.resetAccountHint} />
            </div>
          </div>
        </div>
        <div className="p-AuthRecovery__right">
          <div className="p-AuthRecovery__form">
            <Block
              title={
                <FormattedMessage {...intlMessages.resetLoginAccountTitle} />
              }
            >
              <LoginAccountForm
                originPhone={this.state.e164phone}
                initialValues={this.getAccountFormInitialValues()}
                countryOptions={get(this.props.countryCallingCodes, 'data')}
                sendVerifyCode={sendResetCodeRequest}
                onSubmit={this.resetLoginAccount}
              />

              <Button
                type="merge"
                size="sm"
                onClick={() => {
                  this.setState({
                    step: STEP_SELECT_RECOVERY_FIELD,
                  });
                }}
                style={{ marginTop: 10 }}
              >
                {formatMessage(intlMessages.reselectRecoveryField)}
              </Button>
            </Block>
          </div>
        </div>
      </div>
    );
  }

  renderChangePasswordSuccess() {
    return (
      <ChangePasswordSuccess password={this.state.newPassword} />
    );
  }

  renderResetLoginAccountSuccess() {
    return (
      <ResetLoginAccountSuccess account={this.state.newLoginAccount} />
    )
  }

  render() {
    if (!this.props.countryCallingCodes) {
      return <div>Loading...</div>;
    }
    const { step } = this.state;
    // const step = 5;
    switch (step) {
      case STEP_VERIFY_IDENTITY:
        return this.renderIdentityForm();
      case STEP_VERIFY_SECURITY:
        return this.renderSecurityForm();
      case STEP_SELECT_RECOVERY_FIELD:
        return this.renderSelectField();
      case STEP_CHANGE_PASSWORD:
        return this.renderChangePasswordForm();
      case STEP_UPDATE_CODE_PHRASE:
        return this.renderUpdateCodePhraseForm();
      case STEP_RESET_LOGIN_ACCOUNT:
        return this.resetLoginAccountForm();
      case STEP_CHANGE_PASSWORD_SUCCESS:
        return this.renderChangePasswordSuccess();
      case STEP_UPDATE_CODE_PHRASE_SUCCESS:
        return this.renderUpdateCodePhraseSuccess();
      case STEP_RESET_LOGIN_ACCOUNT_SUCCESS:
        return this.renderResetLoginAccountSuccess();
      default:
        return <span>Unknown Step: {step}</span>;
    }
  }
}

AccountRecovery.propTypes = {
  countryCallingCodes: PropTypes.object,
  pageState: PropTypes.object,
  fetchCountries: PropTypes.func,
  setRecoveryField: PropTypes.func,
  verifyIdentity: PropTypes.func,
  resetRecovery: PropTypes.func,
  changePassword: PropTypes.func,
  updateCodePhrase: PropTypes.func,
  resetLoginAccount: PropTypes.func,
  sendVerifyCode: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  countryCallingCodes: selectCountryCallingCodes,
});

export default connect(
  mapStateToProps,
  {
    fetchCountryCallingCodes: asyncFetchCountryCallingCodes,
  },
)(AccountRecovery);

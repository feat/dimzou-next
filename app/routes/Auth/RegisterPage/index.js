import React from 'react';

import { FormattedMessage } from 'react-intl';

import commonMessages from '@/messages/common';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import RegisterForm from './PhoneRegisterForm';

function Register() {
  return (
    <div className="p-AuthTemplate">
      <div className="p-AuthTemplate__promoteContainer">
        <div className="p-AuthTemplate__promoteWrapper">
          <h1 className="p-AuthTemplate__title">
            <SvgIcon className="p-AuthTemplate__logo" icon="feat-v2" />
          </h1>
          <p className="p-AuthTemplate__promoteWords">
            <FormattedMessage {...commonMessages.slogan} />
          </p>
        </div>
      </div>
      <div className="p-AuthTemplate__formContainer">
        <div className="p-AuthTemplate__form">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default Register;

import React from 'react';
import PropTypes from 'prop-types'
import { formatMessage } from '@/services/intl';
import CountdownButton from '@feat/feat-ui/lib/countdown-button';
import Router from 'next/router';
import intlMessages from '../../messages'

function ResetLoginAccountSuccess({ account }) {
  return (
    <div className="p-AuthRecovery p-AuthRecovery_success">
      <div className="p-AuthRecoverySuccess p-AuthRecoverySuccess_password">
        <h1 className="p-AuthRecoverySuccess__title">
          {formatMessage(intlMessages.congratulations)}
        </h1>
        <div className="p-AuthRecoverySuccess__content">
          <p className="p-AuthRecoverySuccess__note">
            {formatMessage(intlMessages.phoneUpdatedNote)}
          </p>
          <p>
            <span className="p-AuthRecoverySuccess__value">
              {account}
            </span>
          </p>
          <div>
            <CountdownButton
              className="cm-PayMethodPanel__sendCodeBtn"
              count={5}
              left={5}
              renderCountDown={(left) =>
                formatMessage(intlMessages.redirectToLoginWithCountdown, {
                  time: left,
                })
              }
              onEnd={() => {
                Router.push({
                  pathname: '/auth/login',
                }, '/auth/login')
              }}
              onClick={() => {
                Router.push({
                  pathname: '/auth/login',
                }, '/auth/login')
              }}
              disabledWhenCountingDown={false}
            >
              {formatMessage(intlMessages.redirectToLogin)}
            </CountdownButton>
          </div>
        </div>
      </div>
    </div>
  )
}

ResetLoginAccountSuccess.propTypes = {
  account: PropTypes.string,
}

export default ResetLoginAccountSuccess;
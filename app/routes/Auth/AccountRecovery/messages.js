/*
 * ForgetPasswordPage Messages
 *
 * This contains all the text for the ForgetPasswordPage component.
 */
import { defineMessages } from '@/services/intl';

export default defineMessages({
  failedToVerifyIdentity: {
    id: 'app.account-recovery.verify-identity-failed',
    defaultMessage: 'Invalid security info',
  },
  failedToVerifyPhone: {
    id: 'app.account-recovery.verify-phone-failed',
    defaultMessage: 'invalid number',
  },
  failedToUpdatePassword: {
    id: 'app.account-recovery.update-password-failed',
    defaultMessage: 'Failed to update password.',
  },
  failedToUpdateCodePhrase: {
    id: 'app.account-recovery.update-code-phrase',
    defaultMessage: 'Failed to update code phrase',
  },
  countryLabel: {
    id: 'app.account-recovery.country-label',
    defaultMessage: 'Country',
  },
  countryPlaceholder: {
    id: 'app.account-recovery.country-placeholder',
    defaultMessage: 'Select a country',
  },
  invalidCallingCodeLabel: {
    id: 'app.account-recovery.invalid-calling-code',
    defaultMessage: 'Invalid Calling Code',
  },
  phoneLabel: {
    id: 'app.account-recovery.phone-label',
    defaultMessage: 'Phone',
  },
  codeLabel: {
    id: 'app.account-recovery.code-label',
    defaultMessage: 'Code',
  },
  passwordLabel: {
    id: 'app.account-recovery.password-label',
    defaultMessage: 'Password',
  },
  hintLabel: {
    id: 'app.account-recovery.hint-label',
    defaultMessage: 'Hint',
  },
  responseLabel: {
    id: 'app.account-recovery.response-label',
    defaultMessage: 'Your Reply',
  },
  submitLabel: {
    id: 'app.account-recovery.submit-label',
    defaultMessage: 'go',
  },
  verifyLabel: {
    id: 'app.account-recovery.submit-verifying',
    defaultMessage: 'Verifying...',
  },
  newHintLabel: {
    id: 'app.account-recovery.new-hint-label',
    defaultMessage: 'New Hint',
  },
  newResponseLabel: {
    id: 'app.account-recovery.new-response-label',
    defaultMessage: 'New Response',
  },
  currentAccountLabel: {
    id: 'app.account-recovery.current-account-label',
    defaultMessage: 'Current login name',
  },
  sendVerifyCodeLabel: {
    id: 'app.account-recovery.send-verify-code-label',
    defaultMessage: 'Get Code',
  },
  resetAccountHint: {
    id: 'app.account-recovery.reset-account-hint',
    defaultMessage:
      'Welcome to reset login account here. For security reasons, we ask for you a correct code phrase to verify that you are the owner of this account. <br /> <br /> Thanks',
  },
  resetLoginAccountTitle: {
    id: 'app.account-recovery.reset-account-title',
    defaultMessage: 'Login Account',
  },
  updateCodePhraseHint: {
    id: 'app.account-recovery.update-code-phrase-hint',
    defaultMessage:
      'Welcome to reset your code phrase here. For security reasons, we ask for you a correct code phrase to verify that you are the owner of this account. <br /><br />Thanks',
  },
  updateCodePhraseTitle: {
    id: 'app.account-recovery.update-code-phrase-title',
    defaultMessage: 'Code Phrase',
  },
  changePasswordTitle: {
    id: 'app.account-recovery.change-password-title',
    defaultMessage: 'Password',
  },
  changePasswordHint: {
    id: 'app.account-recovery.change-password-hint',
    defaultMessage:
      'Welcome to reset your password here. For security reasons, we ask for you a correct code phrase to verify that you are the owner of this account. <br/><br/>Thanks',
  },
  verifyFormTitle: {
    id: 'app.account-recovery.verify-form-title',
    defaultMessage: 'Identity',
  },
  verifyFormHint: {
    id: 'app.account-recovery.verify-form-hint',
    defaultMessage:
      'Welcome to reset your password here. For security reasons, we ask for you a correct code phrase to verify that you are the owner of this account. <br/><br/>Thanks',
  },
  codePhraseUpdatedNote: {
    id: 'app.account-recovery.code-phrase-updated-note',
    defaultMessage:
      'You just made a successful update of code phrase. Below is your new hint and response from now on:',
  },
  passwordUpdatedNote: {
    id: 'app.account-recovery.password-updated-note',
    defaultMessage:
      'You just made a success of password recovery. Below is your password from now on:',
  },
  phoneUpdatedNote: {
    id: 'app.account-recovery.phone-updated-note',
    defaultMessage:
      'You just made a success change of  login name. From now on your login name is below:',
  },
  congratulations: {
    id: 'app.account-recovery.congratulations',
    defaultMessage: 'Congratulations!',
  },
  actionQuestion: {
    id: 'app.account-recovery.action-question',
    defaultMessage: 'Whichever One do You Need to Reset ?',
  },
  reselectRecoveryField: {
    id: 'app.account-recovery.reselect-recovery-field',
    defaultMessage: 'Reselect recovery field',
  },
  redirectToLoginWithCountdown: {
    id: 'app.account-recovery.redirect-to-login-count-down',
    defaultMessage: 'Redirect to login page, ({time}s)',
  },
  redirectToLogin: {
    id: 'app.account-recovery.redirect-to-login',
    defaultMessage: 'Redirect to login page',
  },
});

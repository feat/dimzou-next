import React from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';

import {
  STEP_CHANGE_PASSWORD,
  STEP_RESET_LOGIN_ACCOUNT,
} from '../../constants';

import intlMessages from '../../messages';

class RecoveryFieldForm extends React.PureComponent {
  render() {
    const { onSubmit } = this.props;
    return (
      <div>
        <div className="st-FormRadioRow margin_b_24">
          <Button
            block
            value={STEP_CHANGE_PASSWORD}
            onClick={() => {
              onSubmit({ type: STEP_CHANGE_PASSWORD });
            }}
            htmlType="button"
            size="md"
          >
            {formatMessage(intlMessages.changePasswordTitle)}
          </Button>
        </div>
        <div className="st-FormRadioRow">
          <Button
            block
            value={STEP_RESET_LOGIN_ACCOUNT}
            onClick={() => {
              onSubmit({ type: STEP_RESET_LOGIN_ACCOUNT });
            }}
            htmlType="button"
            size="md"
          >
            {formatMessage(intlMessages.resetLoginAccountTitle)}
          </Button>
        </div>
      </div>
    );
  }
}

RecoveryFieldForm.propTypes = {
  // initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default RecoveryFieldForm;

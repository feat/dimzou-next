import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import Button from '@feat/feat-ui/lib/button';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import PasswordField from '@/components/Formik/PasswordField';

import intlMessages from '../../messages';

const validate = (values) => {
  const errors = {};

  if (!values.new_password) {
    errors.new_password = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.passwordLabel),
    });
  }

  return errors;
};

class ChangePasswordForm extends React.PureComponent {
  render() {
    const { onSubmit, initialValues } = this.props;

    return (
      <Formik
        validate={validate}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(props) => {
          const { errors, handleSubmit, isSubmitting } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Field
                name="new_password"
                label={formatMessage(intlMessages.passwordLabel)}
                component={PasswordField}
                type="password"
                size="md"
              />
              {errors._error && (
                <div>
                  <FormHelp data={errors._error} validateStatus="error" />
                </div>
              )}
              <Button
                className="margin_t_12 pull-right RecoveryStepNext"
                htmlType="submit"
                size="md"
                disabled={isSubmitting}
                block
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
ChangePasswordForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};

ChangePasswordForm.defaultProps = {
  initialValues: { new_password: '' },
};

export default ChangePasswordForm;

import React from 'react';
import PropTypes from 'prop-types';

import { Formik, Field } from 'formik';
import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';

import TextField from '@/components/Formik/TextField';

import intlMessages from '../../messages';

const validate = (values) => {
  const errors = {};
  if (!values.answer) {
    errors.answer = formatMessage(formMessages.required, {
      field: formatMessage(intlMessages.responseLabel),
    });
  }

  return errors;
};

class SecurityForm extends React.PureComponent {
  render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {(props) => {
          const { handleSubmit, errors, isValid, isSubmitting } = props;
          return (
            <form onSubmit={handleSubmit} id="security-form">
              <Field
                name="phone"
                label={formatMessage(intlMessages.phoneLabel)}
                component={TextField}
                size="md"
                disabled
              />
              <Field
                name="question"
                label={formatMessage(intlMessages.hintLabel)}
                component={TextField}
                size="md"
                disabled
              />
              <Field
                name="answer"
                label={formatMessage(intlMessages.responseLabel)}
                component={TextField}
                size="md"
                autoFocus
              />
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
                disabled={!isValid || isSubmitting}
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

SecurityForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export default SecurityForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import Button from '@feat/feat-ui/lib/button';
import TextField from '@/components/Formik/TextField';
import intlMessages from '../../messages';

const validate = (values) => {
  const errors = {};
  if (!values.new_question) {
    errors.new_question = formatMessage(formMessages.shortRequired);
  }
  if (!values.new_answer) {
    errors.new_answer = formatMessage(formMessages.shortRequired);
  }
  return errors;
};

function CodePhraseForm(props) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validate={validate}
    >
      {(formProps) => {
        const { isValid, isSubmitting } = formProps;
        return (
          <form onSubmit={formProps.handleSubmit}>
            <Field
              name="new_question"
              label={formatMessage(intlMessages.newHintLabel)}
              component={TextField}
            />
            <Field
              name="new_answer"
              label={formatMessage(intlMessages.newResponseLabel)}
              component={TextField}
            />
            <Button
              className="margin_t_12 pull-right RecoveryStepNext"
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

CodePhraseForm.propTypes = {
  initialValues: PropTypes.func,
  onSubmit: PropTypes.func,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import { FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';

import PasswordField from '@/components/Formik/PasswordField';

import intlMessages from '../../messages';

const validate = (values) => {
  const { password } = values;
  if (!password) {
    return {
      password: formatMessage(formMessages.required, {
        field: formatMessage(intlMessages.registerPasswordLabel),
      }),
    };
  }
  if (password.length < 6) {
    return {
      password: formatMessage(formMessages.min, {
        field: formatMessage(intlMessages.registerPasswordLabel),
        length: 6,
      }),
    };
  }
  return {};
};

class CreateAccount extends React.PureComponent {
  render() {
    const { onSubmit, initialValues } = this.props;
    return (
      <Formik
        validate={validate}
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {(props) => {
          const { handleSubmit, isSubmitting, errors } = props;
          return (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 20, textAlign: 'center' }}>
                <FormattedMessage {...intlMessages.registerSetPasswordLabel} />
              </h3>
              <Field
                name="password"
                component={PasswordField}
                label={
                  <FormattedMessage {...intlMessages.registerPasswordLabel} />
                }
                size="md"
                autoFocus
              />
              <div className="margin_y_12">
                {errors._error ? (
                  <FormHelp data={errors._error} validateStatus="error" />
                ) : (
                  <br />
                )}
              </div>
              <Button
                disabled={isSubmitting}
                htmlType="submit"
                className="margin_t_12"
                block
                size="md"
              >
                {isSubmitting ? (
                  <Loader size="xs" color="inverse">
                    <FormattedMessage
                      {...intlMessages.registerCreatingAccountLabel}
                    />
                  </Loader>
                ) : (
                  <FormattedMessage
                    {...intlMessages.registerCreateAccountLabel}
                  />
                )}
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  }
}

CreateAccount.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

CreateAccount.defaultProps = {
  initialValues: {
    password: '',
  },
}

export default CreateAccount;

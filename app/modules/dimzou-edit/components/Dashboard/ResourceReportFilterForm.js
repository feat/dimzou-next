import React, { useEffect } from 'react';
import { Formik, Field } from 'formik';
import RangeField from '@/components/Formik/RangeField';

const validate = (values) => {
  const { period } = values;
  if (!period.start || !period.end) {
    return {
      period: '请选择时间',
    };
  }
  return {};
};

function FilterForm(props) {
  return (
    <Formik
      onSubmit={props.onSubmit}
      validate={validate}
      initialValues={{
        period: {},
      }}
    >
      {({ dirty, isValid, values, handleSubmit, submitForm, isSubmitting }) => {
        useEffect(
          () => {
            if (dirty && isValid) {
              submitForm();
            }
          },
          [values, isValid, dirty],
        );
        return (
          <form onSubmit={handleSubmit}>
            <Field
              name="period"
              className="ft-FormItem_inline"
              label={null}
              component={RangeField}
              viewMode="YMD"
              normalize={(val) => val && val.startOf('month')}
              momentFormat="YYYY/MM/DD"
              placeholder="选择时间范围"
              autoCloseOnChange
              disabled={isSubmitting}
            />
          </form>
        );
      }}
    </Formik>
  );
}

export default FilterForm;

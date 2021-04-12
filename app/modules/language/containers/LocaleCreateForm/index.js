import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCountries } from '@/modules/choices/selectors';
import { fetchCountries } from '@/modules/choices/actions';

import CountrySelectField from '@/components/Formik/CountrySelectField';
import TextField from '@/components/Formik/TextField';
import DropdownSelectField from '@/components/Formik/DropdownSelectField';

import { fetchLanguages, asyncCreateLocale } from '../../actions';
import { selectLanguages } from '../../selectors';

class LanguageCreateForm extends React.Component {
  componentDidMount() {
    if (!this.props.languageOptions) {
      this.props.fetchLanguages();
    }
    if (!this.props.country.countryOptions) {
      this.props.fetchCountries();
    }
  }

  render() {
    const { languageOptions, country, onSubmit, initialValues } = this.props;
    const countryOptions = country.countries;
    if (!languageOptions || !countryOptions) {
      return <div>Loading...</div>;
    }
    return (
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(props) => (
          <form onSubmit={props.onSubmit}>
            <Field
              name="language_code"
              label="Language"
              placeholder="Select Language"
              options={languageOptions}
              dropdownContainerStyle={{
                zIndex: 10000,
                maxWidth: 300,
              }}
              component={DropdownSelectField}
            />
            <Field
              name="region"
              label="Country"
              placeholder="Select Country"
              countryOptions={countryOptions}
              afterChange={this.handleCountrySelect}
              dropdownContainerStyle={{
                zIndex: 10000,
                maxWidth: 300,
              }}
              component={CountrySelectField}
            />
            <Field
              name="label"
              label="Name"
              placeholder="Name"
              inputModifier="lg"
              component={TextField}
            />
          </form>
        )}
      </Formik>
    );
  }
}

LanguageCreateForm.propTypes = {
  country: PropTypes.object, // TODO: just select list;
  languageOptions: PropTypes.array,
  fetchLanguages: PropTypes.func,
  fetchCountries: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

LanguageCreateForm.defaultProps = {
  initialValues: {
    language_code: undefined,
    region: undefined,
    label: undefined,
  },
};

const mapStateToProps = createStructuredSelector({
  languageOptions: selectLanguages,
  country: selectCountries,
});

const mapDisptachToProps = {
  onSubmit: asyncCreateLocale,
  fetchCountries,
  fetchLanguages,
};

export default connect(
  mapStateToProps,
  mapDisptachToProps,
)(LanguageCreateForm);

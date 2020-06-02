import React from 'react';
import PropTypes from 'prop-types';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';
import Modal from '@feat/feat-ui/lib/modal';

import CategorySelectModal from '@/modules/category/containers/CategorySelectModal';

class CategorySelectField extends React.PureComponent {
  state = {
    isModalOpened: false,
  };

  openCategorySelectPanel = () => {
    this.setState({
      isModalOpened: true,
    });
  };

  closeCategorySelectPanel = () => {
    this.setState({
      isModalOpened: false,
    });
    const {
      form: { setFieldTouched },
      field: { name },
    } = this.props;
    setFieldTouched(name);
  };

  setCategory = ({ category }) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;
    setFieldValue(name, category);
    this.closeCategorySelectPanel();
  };

  render() {
    const { field, form, label, ...custom } = this.props;
    const { name, value } = field;
    const touched = form.touched[name];
    const error = form.errors[name];
    const validateStatus = touched && error ? 'error' : undefined;

    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        className={custom.className}
        validateStatus={validateStatus}
        help={
          validateStatus === 'error' ? (
            <FormHelp data={error} validateStatus="error" />
          ) : (
            custom.help && <FormHelp data={custom.help} />
          )
        }
        {...custom}
      >
        {({ handleFocus, handleBlur }) => (
          <>
            <Button
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={this.openCategorySelectPanel}
            >
              {value
                ? this.props.renderOptionLabel(value)
                : this.props.placeholder}
            </Button>
            <Modal
              isOpen={this.state.isModalOpened}
              onClose={this.closeCategorySelectPanel}
              maskClosable
            >
              <CategorySelectModal
                category={value}
                onConfirm={this.setCategory}
                onCancel={this.closeCategorySelectPanel}
              />
            </Modal>
          </>
        )}
      </FormItem>
    );
  }
}

CategorySelectField.propTypes = {
  label: PropTypes.node,
  placedholder: PropTypes.node,
  renderOptionLabel: PropTypes.func,
};

CategorySelectField.defaultProps = {
  renderOptionLabel: (value) => value.name,
};

export default CategorySelectField;

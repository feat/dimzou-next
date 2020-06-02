import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class Form extends PureComponent {
  render() {
    const { className, layout, ...restProps } = this.props;

    return (
      <form
        className={classNames(className, "ft-Form", `ft-Form_${layout}`)}
        {...restProps}
      />
    );
  }
}

Form.propTypes = {
  className: PropTypes.string,
  layout: PropTypes.oneOf(["inline", "horizontal", "vertical"]),
};

Form.defaultProps = {
  layout: "vertical",
};

export default Form;

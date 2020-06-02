import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class TextRowPlaceholder extends React.PureComponent {
  componentWillMount() {
    if (this.props.randomWidth) {
      this.width = `${50 + Math.random() * 50}%`;
    }
  }

  render() {
    const {
      className,
      modifier,
      randomWidth,
      marginBottom,
      width,
      fontSize,
      inverse,
    } = this.props;
    const style = {};
    if (randomWidth) {
      style.width = this.width;
    } else if (width) {
      style.width = width;
    }
    if (fontSize) {
      style.fontSize = fontSize;
    }
    if (marginBottom !== undefined) {
      style.marginBottom = marginBottom;
    }

    return (
      <div
        className={classNames(
          "ft-Placeholder ft-Placeholder_textRow",
          className,
          {
            [`ft-Placeholder_${modifier}`]: modifier,
            "ft-Placeholder_inverse": inverse,
          }
        )}
        style={style}
      >
        &nbsp;
      </div>
    );
  }
}

TextRowPlaceholder.propTypes = {
  className: PropTypes.string,
  modifier: PropTypes.string,
  randomWidth: PropTypes.bool,
  inverse: PropTypes.bool,
  marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

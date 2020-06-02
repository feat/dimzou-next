import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const getSizeStyle = (width, height) => {
  const size = width || height;
  if (!size) return {};
  return {
    width: `${(width || size) / 16}rem`,
    height: `${(height || size) / 16}rem`,
  };
};

class SvgIcon extends React.PureComponent {
  state = { isReady: false };

  componentDidUpdate(prevProps) {
    if (this.props.icon !== prevProps.icon) {
      this.setState({
        isReady: false,
      });
      this.loadIcon(this.props.icon);
    }
  }

  componentDidMount() {
    const { icon } = this.props;
    this.customIsMounted = true;
    this.loadIcon(icon);
  }

  componentWillUnmount() {
    this.customIsMounted = false;
  }

  loadIcon = (icon) => {
    import(`./icons/${icon}.svg`).then((file) => {
      if (this.customIsMounted && this.props.icon === icon) {
        this.setState({
          isReady: true,
          content: file.default || file,
        });
      }
    });
  };

  render() {
    const {
      className,
      style = {},
      namespace,
      width,
      height,
      ...props
    } = this.props;
    const sizeStyle = getSizeStyle(width, height);

    if (this.state.isReady) {
      return (
        <span
          {...props}
          className={classNames(`${namespace}-SvgIcon`, className)}
          style={{ ...style, sizeStyle }}
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        />
      );
    }
    return (
      <span
        className={classNames(
          `${namespace}-SvgIcon ${namespace}-SvgIcon_placeholder`,
          className,
        )}
        style={{ ...style, sizeStyle }}
      />
    );
  }
}

SvgIcon.propTypes = {
  namespace: PropTypes.string,
  icon: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
};

SvgIcon.defaultProps = {
  namespace: 'ft',
};

export default SvgIcon;

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from './messages';
import scrollStop from './scrollStop';

class ScrollToTop extends React.PureComponent {
  handleClick = () => {
    const beforePromise = this.props.beforeScroll
      ? this.props.beforeScroll() || Promise.resolve()
      : Promise.resolve();
    beforePromise.then(() => {
      scrollStop(this.props.afterScroll, true);
      window.scrollTo({
        left: window.scrollX,
        top: 0,
        behavior: 'smooth',
      });
    });
  };

  render() {
    return (
      <Button
        onClick={this.handleClick}
        className={this.props.className}
        style={this.props.style}
        block
      >
        <TranslatableMessage message={intlMessages.backToTop} />
      </Button>
    );
  }
}

ScrollToTop.propTypes = {
  beforeScroll: PropTypes.func, // Promise
  afterScroll: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default ScrollToTop;

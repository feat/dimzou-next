import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import Button from '@feat/feat-ui/lib/button';

import './style.scss';

class InlineCarouselSelect extends React.Component {
  state = {
    slideIndex: 0,
    slideCount: 1,
  };

  componentDidMount() {
    this.syncSlideState();
  }

  syncSlideState = () => {
    const wrapDomWidth = this.optionsWrapDom.clientWidth;
    const optionsWidth = this.optionsDom.scrollWidth;
    const slideWidth = wrapDomWidth;
    const slideCount = Math.ceil(optionsWidth / wrapDomWidth);
    this.setState({
      slideCount,
      slideWidth,
    });
  };

  prevSlide = () => {
    this.setState({
      slideIndex: this.state.slideIndex - 1,
    });
  };

  nextSlide = () => {
    this.setState({
      slideIndex: this.state.slideIndex + 1,
    });
  };

  render() {
    const {
      options,
      value,
      valueExtractor,
      onChange,
      renderLabel,
      className,
    } = this.props;
    return (
      <div className={classNames('InlineCarouselSelect', className)}>
        <div
          className="InlineCarouselSelect__optionWrap"
          ref={(n) => {
            this.optionsWrapDom = n;
          }}
        >
          <div
            className="InlineCarouselSelect__options"
            style={
              this.state.slideIndex > 0 && this.state.slideWidth
                ? {
                  transform: `translate3d(${-1 *
                      this.state.slideIndex *
                      this.state.slideWidth}px, 0, 0)`,
                }
                : {}
            }
            ref={(n) => {
              this.optionsDom = n;
            }}
          >
            {options.map((item, index) => (
              <Button
                key={valueExtractor(item)}
                type="merge"
                className={classNames({
                  'is-selected': valueExtractor(item) === value,
                })}
                onClick={() => onChange(item, index)}
              >
                {renderLabel(item)}
              </Button>
            ))}
          </div>
        </div>
        <div
          className="InlineCarouselSelect__controls"
          style={
            this.setState.slideCount === 1
              ? {
                opacity: 0,
              }
              : {}
          }
        >
          <SquareButton
            className="InlineCarouselSelect__prev"
            disabled={this.state.slideIndex === 0}
            onClick={this.prevSlide}
          >
            &lt;
          </SquareButton>
          <SquareButton
            className="InlineCarouselSelect__next"
            disabled={this.state.slideIndex === this.state.slideCount - 1}
            onClick={this.nextSlide}
          >
            &gt;
          </SquareButton>
        </div>
      </div>
    );
  }
}

InlineCarouselSelect.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.any,
  renderLabel: PropTypes.func,
  valueExtractor: PropTypes.func,
  onChange: PropTypes.func,
};

export default InlineCarouselSelect;

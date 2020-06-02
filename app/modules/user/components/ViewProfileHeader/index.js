import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shrinkText from './shrinkText';

import './index.scss';

const HEADER_MAX_HEIGHT = 7;

class ViewProfileHeader extends Component {
  componentDidMount() {
    setTimeout(() => {
      if (!this.title || !this.subTitle) {
        return;
      }
      shrinkText(this.title, {
        lineCount: 2,
        maxHeight: 90,
      });
      shrinkText(this.subTitle, {
        lineCount: 2,
        maxHeight: 30,
      });

      // set MaxHeight;
      const baseFontSize = window.getComputedStyle(
        document.getElementsByTagName('head')[0],
      ).fontSize;
      const maxHeight = parseFloat(baseFontSize) * HEADER_MAX_HEIGHT;
      const titleHeight = this.title.getBoundingClientRect().height;
      const descHeight = this.subTitle.getBoundingClientRect().height;
      const maxDescHeight = maxHeight - titleHeight;
      if (titleHeight > maxHeight) {
        this.subTitle.style.display = 'none';
      } else {
        const descStyle = window.getComputedStyle(this.subTitle);
        const descFontSize = parseFloat(descStyle.fontSize);
        const descLineHeight = parseFloat(descStyle.lineHeight);
        if (maxDescHeight < descLineHeight * 1.5) {
          this.subTitle.style.display = 'none';
        } else if (descHeight > maxDescHeight) {
          const alpha = descLineHeight / descFontSize;
          this.subTitle.style.height = `${Math.floor(
            maxDescHeight / descLineHeight,
          ) * alpha}em`;
          this.subTitle.style.overflow = 'hidden';
        }
      }
    }, 200);
  }

  render() {
    const { title, subTitle, className } = this.props;
    return (
      <div
        className={classNames('ViewProfileHeader', className)}
        ref={(n) => {
          this.container = n;
        }}
      >
        <div className="ViewProfileHeader__inner">
          <div
            className="ViewProfileHeader__title"
            ref={(n) => {
              this.title = n;
            }}
          >
            {title}
          </div>
          <div
            className="ViewProfileHeader__subTitle"
            ref={(n) => {
              this.subTitle = n;
            }}
          >
            {subTitle}
          </div>
        </div>
      </div>
    );
  }
}

ViewProfileHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  className: PropTypes.string,
};

export default ViewProfileHeader;

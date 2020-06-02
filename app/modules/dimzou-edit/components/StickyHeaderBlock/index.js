import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Sticky from '@feat/feat-ui/lib/sticky';

import './style.scss';

// TODO Header Sticky Feature.
class StickyHeaderBlock extends React.PureComponent {
  render() {
    return (
      <div
        className={classNames(
          'ft-Block ft-Block_primary ft-Block_sticky',
          this.props.className,
        )}
      >
        <Sticky
          top={this.props.stickyTop}
          bottomBoundary={this.props.stickyBottomBoundary}
        >
          <div className="ft-Block__header ft-Block__header_primary">
            <div className="ft-Block__title ft-Block__title_primary">
              {this.props.title}
            </div>
            {this.props.subHeader && (
              <div className="ft-Block__subHeader">{this.props.subHeader}</div>
            )}
          </div>
        </Sticky>
        <div className="ft-Block__content">{this.props.children}</div>
      </div>
    );
  }
}

StickyHeaderBlock.propTypes = {
  className: PropTypes.string,
  stickyTop: PropTypes.string,
  stickyBottomBoundary: PropTypes.string,
  title: PropTypes.node,
  subHeader: PropTypes.node,
  children: PropTypes.any,
};

export default StickyHeaderBlock;

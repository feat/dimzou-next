import React from 'react';
import PropTypes from 'prop-types';

import { getSpotImageUrl } from '@/utils/staticMap';

import './style.scss';

class StaticMap extends React.PureComponent {
  state = {};

  componentDidMount() {
    window.addEventListener('resize', this.updateRender);
    this.updateRender();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRender);
  }

  updateRender = () => {
    const box = this.dom.getBoundingClientRect();
    if (box.height < this.props.minHeight) {
      this.setState({
        shouldRender: false,
      });
    } else {
      this.setState({
        shouldRender: true,
        width: box.width,
        height: box.height,
      });
    }
  };

  render() {
    const { data, style } = this.props;
    return (
      <div
        className="ft-StaticMap"
        style={
          this.state.shouldRender
            ? {
              ...(style || {}),
              backgroundImage: `url(${getSpotImageUrl(data, this.state)})`,
            }
            : style
        }
        ref={(n) => {
          this.dom = n;
        }}
      />
    );
  }
}

StaticMap.propTypes = {
  minHeight: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object,
};

export default StaticMap;

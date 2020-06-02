import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const thumbStyle = {
  backgroundColor: 'rgba(0,0,0,.5)',
  borderRadius: '3px',
};
const vTrackStyle = {
  width: '3px',
  right: '2px',
  bottom: '2px',
  top: '2px',
  borderRadius: '3px',
  backgroundColor: '#EEE',
};
const hTrackStyle = {
  height: '3px',
  left: '2px',
  bottom: '2px',
  right: '2px',
  borderRadius: '3px',
  backgroundColor: '#EEE',
};

const mousewheelevt = /Firefox/i.test(navigator.userAgent)
  ? 'DOMMouseScroll'
  : 'mousewheel';

class CustomScroll extends React.Component {
  constructor(props) {
    super(props);

    this.renderTrackVertical = this.renderTrackVertical.bind(this);
    this.renderTrackHorizontal = this.renderTrackHorizontal.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.mousewheel = this.mousewheel.bind(this);
  }

  componentDidMount() {
    this.scrollArea.view.addEventListener(mousewheelevt, this.mousewheel);
  }

  componentWillUnmount() {
    this.scrollArea.view.removeEventListener(mousewheelevt, this.mousewheel);
  }

  mousewheel(e) {
    const evt = window.event || e;
    const sl = evt.wheelDelta || -evt.detail;

    if (this.props.mouseWheel) {
      if (sl > 0) {
        if (this.scrollArea.getValues().top === 0) {
          e.preventDefault();
        }
      } else if (this.scrollArea.getValues().top === 1) {
        e.preventDefault();
      }
    }
  }

  renderTrackVertical({ style, ...props }) {
    return <div style={{ ...style, ...vTrackStyle }} {...props} />;
  }

  renderTrackHorizontal({ style, ...props }) {
    return <div style={{ ...style, ...hTrackStyle }} {...props} />;
  }

  renderThumb({ style, ...props }) {
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  }

  handleUpdate(values) {
    const { scrollTop, clientHeight, scrollHeight } = values;
    if (
      this.props.scrollWillEnd &&
      scrollHeight - scrollTop - clientHeight < clientHeight
    ) {
      this.props.scrollWillEnd();
    }
  }

  render() {
    const { mouseWheel, scrollWillEnd, ...props } = this.props;
    return (
      <Scrollbars
        ref={(e) => {
          this.scrollArea = e;
        }}
        renderTrackVertical={this.renderTrackVertical}
        renderTrackHorizontal={this.renderTrackHorizontal}
        renderThumbVertical={this.renderThumb}
        renderThumbHorizontal={this.renderThumb}
        onUpdate={this.handleUpdate}
        hideTracksWhenNotNeeded
        thumbMinSize={20}
        universal
        autoHide
        {...props}
      />
    );
  }
}

CustomScroll.defaultProps = {
  mouseWheel: false,
};

export default CustomScroll;

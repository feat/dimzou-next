import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import heartBeatUri from './assets/heartbeat.mp3';
import heartIcon from './assets/icon-heart.svg';
import './style.scss';

class LikeButton extends React.PureComponent {
  static propTypes = {
    hasLiked: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  };

  state = {
    isLiking: false,
    isDisLiking: false,
  };

  componentDidMount() {
    let heartBeatDom = document.querySelector('#like-heart-beat');
    // load audio;
    if (!heartBeatDom) {
      heartBeatDom = document.createElement('audio');
      heartBeatDom.id = 'like-heart-beat';
      heartBeatDom.controls = true;
      heartBeatDom.style.display = 'none';

      const source = document.createElement('source');
      source.src = heartBeatUri;
      source.type = 'audio/mpeg';

      heartBeatDom.appendChild(source);
      document.body.appendChild(heartBeatDom);
    }
    this.audio = heartBeatDom;
  }

  resetState = () => {
    this.setState({
      isLiking: false,
      isDisLiking: false,
    });
  };

  handleClick = (e) => {
    const { hasLiked, onClick } = this.props;
    if (!hasLiked) {
      // begin animation
      this.setState({
        isLiking: true,
        isDisLiking: false,
      });
      if (this.audio) {
        this.audio.play();
      }
      // for animation
      this.likeTimer = setTimeout(this.resetState, 2000);
    } else {
      this.setState({
        isDisLiking: true,
      });
      this.likeTimer = setTimeout(this.resetState, 2000);
    }
    onClick(e);
  };

  render() {
    const { hasLiked, className, disabled } = this.props;
    const { isLiking, isDisLiking } = this.state;
    const isActive = !isDisLiking && (isLiking || hasLiked);
    return (
      <IconButton
        className={classNames('LikeToggle', className, {
          'is-liking': !isDisLiking && isLiking,
        })}
        isActive={isActive}
        disabled={disabled}
        onClick={this.handleClick}
      >
        <span 
          className={classNames("ft-SvgIcon", {
            'is-active': isActive,
          })} 
          dangerouslySetInnerHTML={{ __html: heartIcon }} 
        />
      </IconButton>
    );
  }
}

export default LikeButton;

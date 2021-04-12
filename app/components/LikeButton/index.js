import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import heartBeatUri from './assets/heartbeat.mp3';
import { ReactComponent as HeartIcon } from './assets/icon-heart.svg';

import './style.scss';

class LikeButton extends React.PureComponent {
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
    const { hasLiked, className, disabled, iconClassName } = this.props;
    const { isLiking, isDisLiking } = this.state;
    const isActive = !isDisLiking && (isLiking || hasLiked);
    return (
      <ButtonBase
        className={classNames('LikeToggle', 'size_xs', className, {
          'is-liking': !isDisLiking && isLiking,
          'is-active': isActive,
        })}
        disabled={disabled}
        onClick={this.handleClick}
        padding={false}
      >
        <HeartIcon className={iconClassName} />
      </ButtonBase>
    );
  }
}

LikeButton.propTypes = {
  hasLiked: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  iconClassName: PropTypes.string,
};

LikeButton.defaultProps = {};

export default LikeButton;

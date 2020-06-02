import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-slick';

import { formatMessage } from '@/services/intl';
import {
  shareToWeibo,
  // shareToGPlus,
  shareToFacebook,
  shareToLinkedIn,
  shareToTwitter,
  shareWithEmail,
} from '@/services/share';

// import Tabs from '@feat/feat-ui/lib/tabs';
import Button from '@feat/feat-ui/lib/button';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import message from '@feat/feat-ui/lib/message';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { withDeviceInfo } from '@/modules/device-info';

// import PhoneForm from './PhoneForm'; // use regiter Phone Form

// import googlePlusIcon from './assets/google-plus.svg';
import facebookIcon from './assets/facebook.svg';
import twitterIcon from './assets/twitter.svg';
import linkedinIcon from './assets/linkedin.svg';
import weiboIcon from './assets/weibo.svg';
// import emailIcon from './assets/email.svg';

import intlMessages from './messages';

import './style.scss';

class ShareModal extends React.Component {

  handleWeiboButtonClick = (e) => {
    e.preventDefault();
    const { shareText, link, source, sourceUrl } = this.props.shareInfo;
    shareToWeibo({
      title: shareText,
      url: link,
      source,
      sourceUrl,
    });
    this.triggerClick('weibo');
  };

  // handleGoogleButtonClick = (e) => {
  //   e.preventDefault();
  //   const { link } = this.props.shareInfo;
  //   shareToGPlus({ url: link });
  // };

  handleFacebookButtonClick = (e) => {
    e.preventDefault();
    const { link } = this.props.shareInfo;
    shareToFacebook({ link });
    this.triggerClick('facebook');
  };

  handleLinkedInButtonClick = (e) => {
    e.preventDefault();
    const { emailSubject, shareText, link, source } = this.props.shareInfo;
    shareToLinkedIn({
      title: emailSubject,
      summary: shareText,
      source,
      url: link,
    });
    this.triggerClick('linkedin');
  };

  handleTwitterButtonClick = (e) => {
    e.preventDefault();
    const { shareText, twitterVia, link } = this.props.shareInfo;
    shareToTwitter({
      text: shareText,
      url: link,
      via: twitterVia,
    });
    this.triggerClick('twitter');
  };

  handleMailButtonClick = (e) => {
    e.preventDefault();
    const { emailSubject, emailBody } = this.props.shareInfo;
    shareWithEmail({
      to: '',
      subject: emailSubject,
      body: emailBody,
    });
    this.triggerClick('mail');
  };

  handleCopy = (e) => {
    e.preventDefault();
    this.linkInput.select();
    document.execCommand('copy');
    message.success(formatMessage(intlMessages.copySuccessHint));
    this.triggerClick('copy');
  };

  triggerClick = (type) => {
    if (this.props.onShareBtnClick) {
      this.props.onShareBtnClick({
        type,
      })
    }
  }

  renderPublicPanel() {
    const { shareHint, shareInfo = {}, isMobile } = this.props;
    const isReady = Boolean(shareInfo.link);
    return (
      <div className="SharePanel">
        <div className="SharePanel__hint">
          {shareHint || (
            <TranslatableMessage message={intlMessages.shareHint} />
          )}
        </div>
        <div className="PublicShare__well">
          <Slider
            className="PublicShareOptionSlider"
            infinite={false}
            speed={500}
            slidesToShow={isMobile ? 2 : 4}
            slidesToScroll={isMobile ? 2 : 4}
            dots={isMobile}
            arrows={!isMobile}
          >
            <div className="PublicShare__option">
              <button
                type="button"
                className="PublicShareOption PublicShareOption_weibo"
                dangerouslySetInnerHTML={{ __html: weiboIcon }}
                onClick={this.handleWeiboButtonClick}
                disabled={!isReady}
              />
            </div>
            {/* <div className="PublicShare__option">
              <button
                type="button"
                className="PublicShareOption PublicShareOption_googlePlus"
                dangerouslySetInnerHTML={{ __html: googlePlusIcon }}
                onClick={this.handleGoogleButtonClick}
                disabled={!isReady}
              />
            </div> */}
            <div className="PublicShare__option">
              <button
                type="button"
                className="PublicShareOption PublicShareOption_facebook"
                dangerouslySetInnerHTML={{ __html: facebookIcon }}
                onClick={this.handleFacebookButtonClick}
                disabled={!isReady}
              />
            </div>
            <div className="PublicShare__option">
              <button
                type="button"
                className="PublicShareOption PublicShareOption_linkedIn"
                dangerouslySetInnerHTML={{ __html: linkedinIcon }}
                onClick={this.handleLinkedInButtonClick}
                disabled={!isReady}
              />
            </div>
            <div className="PublicShare__option">
              <button
                type="button"
                className="PublicShareOption PublicShareOption_twitter"
                dangerouslySetInnerHTML={{ __html: twitterIcon }}
                onClick={this.handleTwitterButtonClick}
                disabled={!isReady}
              />
            </div>
            {/* <div className="PublicShare__option">
              <button
                className="PublicShareOption PublicShareOption_email"
                dangerouslySetInnerHTML={{ __html: emailIcon }}
                onClick={this.handleMailButtonClick}
                disabled={!isReady}
              />
            </div> */}
            {/* <div />
            <div />
            <div />
            <div /> */}
          </Slider>
        </div>
        <div className="PublicShare__copySection">
          <span className="PublicShare__label">
            <TranslatableMessage message={intlMessages.shareLinkLabel} />
          </span>
          <div className="PublicShare__copyWidget">
            <input
              value={shareInfo.link}
              readOnly
              className="PublicShare__link"
              ref={(n) => {
                this.linkInput = n;
              }}
            />
            <Button
              type="merge"
              size="lg"
              className="PublicShare__copyBtn ShareModal__btn"
              onClick={this.handleCopy}
              disabled={!isReady}
            >
              <TranslatableMessage message={intlMessages.copyLabel} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // renderSmsPanel() {
  //   const { countryOptions, smsShareHint, loadingHint } = this.props;
  //   return (
  //     <div className="SharePanel">
  //       <div className="SharePanel__hint">{smsShareHint}</div>
  //       <div className="SharePanel__content">
  //         {countryOptions ? (
  //           <PhoneForm
  //             countryOptions={this.props.countryOptions}
  //             onSubmit={this.props.shareWithSMS}
  //           />
  //         ) : (
  //           <div>{loadingHint}</div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // renderTabs() {
  //   const { publicLabel, smsLabel } = this.props;
  //   return (
  //     <Tabs
  //       type="normal"
  //       activeKey={this.state.activeKey}
  //       onChange={(value) =>
  //         this.setState({
  //           activeKey: value,
  //         })
  //       }
  //     >
  //       <Tabs.TabPane key="public" tab={publicLabel}>
  //         {this.renderPublicPanel()}
  //       </Tabs.TabPane>
  //       <Tabs.TabPane key="sms" tab={smsLabel}>
  //         {this.renderSmsPanel()}
  //       </Tabs.TabPane>
  //     </Tabs>
  //   );
  // }

  render() {
    return (
      <FeatModal>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={intlMessages.title} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>{this.renderPublicPanel()}</FeatModal.Content>
      </FeatModal>
    );
  }
}

export default withDeviceInfo(ShareModal);

ShareModal.propTypes = {
  // canShareWithSMS: PropTypes.bool,
  // countryOptions: PropTypes.array,
  shareInfo: PropTypes.shape({
    link: PropTypes.string,
    source: PropTypes.string,
    sourceUrl: PropTypes.string, // current Page
    twitterVia: PropTypes.string,
    shareText: PropTypes.string,
    emailBody: PropTypes.string,
    emailSubject: PropTypes.string,
  }),

  // publicLabel: PropTypes.node,
  shareHint: PropTypes.node,
  isMobile: PropTypes.bool,
  onShareBtnClick: PropTypes.func,
  // loadingHint: PropTypes.node,
  // smsLabel: PropTypes.node,
  // smsShareHint: PropTypes.node,

  // shareWithSMS: PropTypes.func,
};

ShareModal.defaultProps = {
  // publicLabel: 'Social',
  // smsLabel: 'SMS',
  // smsShareHint: 'Send an SMS to friend.',
  // loadingHint: 'Loading...',
};

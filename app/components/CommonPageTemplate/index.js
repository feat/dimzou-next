import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

import { compose } from 'redux';

import Sticky from '@feat/feat-ui/lib/sticky';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { withDeviceInfo } from '@/modules/device-info';

import cmMessages from '@/messages/common';

import { withAdDropBox } from '@/routes/advertiser/AdProvider';
import PriceCard from '@/routes/advertiser/components/createPortal/PriceCard';

import './style.scss';

const DELTA = 24;
const SCROLL_TOP = 48;

/* eslint-disable */
const scrollOffset = (c, t) =>
  c === document
    ? t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    : getComputedStyle(c).position === 'relative'
      ? t.offsetTop
      : t.getBoundingClientRect().top + c.scrollTop;
/* eslint-enable */

// const TOP_OFFSET = 170;

class CommonPageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      section: undefined,
      sectionTitle: undefined,
      sectionLink: undefined,
    };

    this.throttleWatchScroll = throttle(this.watchScroll, 300);
    this.throttleWatchResize = throttle(this.watchResize, 300);
  }

  getHeaderBottom(forceUpdate) {
    if (!this.headerBottom || forceUpdate) {
      this.updateHeaderBottom();
    }
    return this.headerBottom;
  }

  updateHeaderBottom = () => {
    const headerDom = this.dom.querySelector('.CommonPageTemplate__header');
    const box = headerDom.getBoundingClientRect();
    this.headerBottom = box.bottom;
    return this.headerBottom;
  };

  componentDidMount() {
    this.updateSidebarWrapStyle();
    this.dom.addEventListener('click', this.handleClick);
    window.addEventListener('scroll', this.watchScroll);
    window.addEventListener('resize', this.watchResize);
    const eName =
      document.onmousewheel === null ? 'mousewheel' : 'DOMMouseScroll';
    this.sidebar.addEventListener(eName, this.onMouseWheel);
    const aside = document.querySelector('.MainLayout__sidebar');
    if (aside) {
      aside.addEventListener('mousewheel', this.onMouseWheel);
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.section !== this.state.section && this.dom) {
      const activeDom = this.dom.querySelector(
        `.ft-Button_anchor[data-to=${this.state.section}]`,
      );
      if (activeDom && activeDom.classList.contains('is-selected')) {
        return;
      }

      Array.prototype.forEach.call(
        this.dom.querySelectorAll('.ft-Button_anchor'),
        (dom) => {
          dom.classList.remove('is-selected');
        },
      );
      if (this.state.section) {
        activeDom.classList.add('is-selected');
      }
    }
    if (this.props.isShowDrop) {
      const sidebarWrap = this.dom.querySelector(
        '.CommonPageTemplate__sidebarWrap',
      );
      sidebarWrap.style.position = 'relative';
      sidebarWrap.style.top = 'initial';
    }

    const sections =
      document.querySelectorAll('.FeedGrid').length !== 0
        ? document.querySelectorAll('.FeedGrid')
        : document.querySelectorAll('.usr-Works');
    // const dzCards = document.querySelectorAll('[data-ad-dropbox]');
    sections.forEach((section) => {
      const dzCards = section.querySelectorAll('[data-ad-dropbox]');
      dzCards.forEach((d) => {
        const dzMark = d.querySelector('.dzCard__mark');
        const dataType = d.getAttribute('data-ad-dropbox');
        const cardTitle =
          d.querySelector('.ft-HomeCard__title') ||
          d.querySelector('.dz-Card__title');
        const cardContent =
          d.querySelector('.ft-HomeCard__content') ||
          d.querySelector('.dz-Card__body');
        const cardImage =
          d.querySelector('.ft-HomeCard__image') ||
          d.querySelector('.dz-Card__image');
        const cardAvatar = d.querySelector('.dz-Card__avatar');
        const cardAdModule = d.querySelector('.AdModule');
        if (dataType === 'DropBox') {
          if (this.props.isShowDrop && !dzMark) {
            const mark = document.createElement('div');
            mark.classList.add('dzCard__mark');
            d.appendChild(mark);
            cardTitle && cardTitle.classList.add('underMark');
            cardContent && cardContent.classList.add('underMark');
            cardImage && cardImage.classList.add('underMark');
            cardAdModule && cardAdModule.classList.add('underMark');
            cardAvatar && cardAvatar.classList.add('underMark');
          }
          if (!this.props.isShowDrop && dzMark) {
            d.removeChild(dzMark);
            cardTitle && cardTitle.classList.remove('underMark');
            cardContent && cardContent.classList.remove('underMark');
            cardImage && cardImage.classList.remove('underMark');
            cardAdModule && cardAdModule.classList.remove('underMark');
            cardAvatar && cardAvatar.classList.remove('underMark');
          }
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
    }
    window.removeEventListener('scroll', this.watchScroll);
    window.removeEventListener('resize', this.watchResize);

    this.sidebar.removeEventListener('mousewheel', this.onMouseWheel);
  }

  onMouseWheel = (e) => {
    const aside = document.querySelector('.MainLayout__sidebar');
    if (this.sidebar) {
      if (this.sidebarWrap.scrollTop === 0 && e.deltaY < 0) {
        e.preventDefault();
      }
      if (
        this.sidebarWrap.scrollHeight - this.sidebarWrap.clientHeight ===
          this.sidebarWrap.scrollTop &&
        e.deltaY > 0
      ) {
        e.preventDefault();
      }
    }

    if (e.target === aside) {
      e.preventDefault();
    }
  };

  handleClick = (e) => {
    const button = e.target.closest('.ft-Button_anchor');
    if (button && this.dom) {
      const targetSection = this.dom.querySelector(
        `[data-section=${button.dataset.to}]`,
      );
      if (!targetSection) {
        return;
      }
      const headerBottom = this.getHeaderBottom(true);
      const offsetY =
        scrollOffset(document, targetSection) - headerBottom - DELTA;

      this.shouldDetectScroll = false;

      // TODO animate scroll
      window.scrollTo(0, offsetY);

      // Sync Active class
      Array.prototype.forEach.call(
        this.dom.querySelectorAll('.ft-Button_anchor'),
        (dom) => {
          dom.classList.remove('is-selected');
        },
      );

      button.classList.add('is-selected');
      this.shouldDetectScroll = true;
    }
  };

  watchScroll = () => {
    // detect action state;
    // sync header data;
    this.syncHeader();
    // sync sidbar offset;
    // this.syncSidebarOffset();
    // update sidebar wrap style
    this.updateSidebarWrapStyle();
  };

  watchResize = () => {
    // sync header offset;
    this.updateHeaderBottom();
    this.updateSidebarWrapStyle();
  };

  syncSidebarOffset = () => {
    if (!this.dom) {
      return;
    }
    const sidebarWrap = this.dom.querySelector(
      '.CommonPageTemplate__sidebarWrap',
    );
    const sidebarContentDom = sidebarWrap.children[0];

    if (this.props.isMobile) {
      if (sidebarContentDom.style.transform) {
        sidebarContentDom.style.transform = '';
      }
      return;
    }

    const wrapHeight = sidebarWrap.clientHeight - 24; // sidebarWrap padding
    const { scrollY, innerHeight } = window;
    const deltaHeight = sidebarContentDom.clientHeight - wrapHeight;

    if (deltaHeight < 0) {
      return;
    }

    const offset =
      (scrollY / (document.body.clientHeight - innerHeight)) * deltaHeight;
    sidebarWrap.scrollTop = offset;
    // sidebarContentDom.style.transform = `translateY(${-1 * offset}px)`;
    // sidebarContentDom.style.position = 'relative';
    // sidebarContentDom.style.top = `${-1 * offset}px`;
  };

  syncHeader = () => {
    if (window.scrollY < 10) {
      this.setState({
        sectionTitle: undefined,
        sectionLink: undefined,
        section: undefined,
      });
    } else {
      if (!this.dom) {
        return;
      }
      const contentSections = this.dom.querySelectorAll('[data-section]');
      const TOP_OFFSET = this.getHeaderBottom() + DELTA + 10;
      Array.prototype.some.call(contentSections, (item) => {
        const itemBox = item.getBoundingClientRect();
        if (itemBox.bottom <= TOP_OFFSET) {
          return false;
        }
        this.setState({
          sectionTitle: item.dataset.sectionTitle,
          sectionLink: item.dataset.sectionLink,
          section: item.dataset.section,
        });
        return true;
      });
    }
  };

  updateSidebarWrapStyle = () => {
    if (!this.dom) {
      return;
    }
    const sidebarWrap = this.dom.querySelector(
      '.CommonPageTemplate__sidebarWrap',
    );
    // const sidebar = this.dom.querySelector('.CommonPageTemplate__sidebar');
    // const sidebarWrapBox = sidebarWrap.getBoundingClientRect();
    // const sidebarBox = sidebar.getBoundingClientRect();
    const headerBox = this.dom
      .querySelector('.CommonPageTemplate__header')
      .getBoundingClientRect();

    const footerBox = document
      .querySelector('.FeatFooter')
      .getBoundingClientRect();
    if (this.props.isMobile) {
      sidebarWrap.style.position = 'relative';
      sidebarWrap.style.overflow = 'auto';
    } else {
      sidebarWrap.style.overflow = 'auto';

      // const maxHeight = sidebarBox.bottom - headerBox.bottom;
      // const minMaxHeight = Math.min(maxHeight, window.innerHeight - headerBox.bottom);
      // sidebarWrap.style.maxHeight = minMaxHeight + 'px';

      const maxHeight = footerBox.top - headerBox.bottom - 50;
      const minMaxHeight = Math.min(
        maxHeight,
        window.innerHeight - headerBox.bottom,
      );
      sidebarWrap.style.maxHeight = `${minMaxHeight}px`;
      // logging.info(footerBox.top, sidebarWrapBox.height)

      if (!sidebarWrap.style.position) {
        sidebarWrap.style.position = 'fixed';
        sidebarWrap.style.top = 'initial';
      }
      // else if (
      //   sidebarWrap.style.position === 'fixed' &&
      //   sidebarWrapBox.bottom > sidebarBox.bottom
      // ) {
      //   // should stick to bottom;
      //   sidebarWrap.style.position = 'absolute';
      //   sidebarWrap.style.bottom = '0px';
      // }

      // else if (
      //   sidebarWrap.style.position === 'absolute' &&
      //   sidebarBox.bottom > window.innerHeight
      // ) {
      //   sidebarWrap.style.position = 'fixed';
      //   sidebarWrap.style.bottom = 'initial';
      // } else if (sidebarWrap.style.position === 'relative') {
      //   sidebarWrap.style.position = 'fixed';
      //   sidebar.style.transform = 'none';
      // }
      else if (headerBox.top > 52) {
        sidebarWrap.style.position = 'relative';
        sidebarWrap.style.top = 'initial';
      } else if (headerBox.top < 52) {
        sidebarWrap.style.position = 'fixed';
        sidebarWrap.style.top = `${headerBox.bottom}px`;
      }
    }
  };

  openNav = () => {
    if (!this.dom) {
      return;
    }
    const sidebar = this.dom.querySelector('.CommonPageTemplate__sidebar');
    const mask = this.dom.querySelector('.CommonPageTemplate__sidebarMask');
    sidebar.style.transform = 'translateX(14.25rem)';
    mask.style.display = 'block';
  };

  hideNav = () => {
    if (!this.props.isMobile) {
      return;
    }
    // if (!window.matchMedia('(max-width: 998px').matches) {
    //   return;
    // }
    if (!this.dom) {
      return;
    }
    const sidebar = this.dom.querySelector('.CommonPageTemplate__sidebar');
    const mask = this.dom.querySelector('.CommonPageTemplate__sidebarMask');
    sidebar.style.transform = 'translateX(0)';
    mask.style.display = 'none';
  };

  priceCard = () => {
    if (this.props.isShowDrop) {
      const sections =
        document.querySelectorAll('.FeedGrid').length !== 0
          ? document.querySelectorAll('.FeedGrid')
          : document.querySelectorAll('.usr-Works');
      return (
        <div>
          {[...new Array(sections.length)].map((_, index) => {
            const dzCards = sections[index].querySelectorAll(
              '[data-ad-dropbox]',
            );
            return (
              <div>
                {[...new Array(dzCards.length)].map((item, i) => {
                  if (dzCards[i].dataset.adDropbox === 'DropBox') {
                    return (
                      <PriceCard
                        dom={dzCards[i]}
                        adPathname={this.props.pathname}
                        sections={index}
                        option={i}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  render() {
    const { helmet, pageTitle, sidebar, main, isMobile } = this.props;
    return (
      <div
        ref={(n) => {
          this.dom = n;
        }}
        className="CommonPageTemplate"
      >
        {helmet}
        <Sticky className="CommonPageTemplate__headerSticky" top={SCROLL_TOP}>
          <div id="page-header" className="CommonPageTemplate__header">
            <div id="page-title" className="CommonPageTemplate__title">
              <span className="t-PageTitle">
                {this.state.sectionTitle || pageTitle}
              </span>
              {this.state.sectionLink && (
                <span className="t-PageTitle CommonPageTemplate__pageMore">
                  <a
                    href={this.state.sectionLink}
                    className="CommonPageTemplate__readMore margin_r_12"
                  >
                    <TranslatableMessage message={cmMessages.readMore} />
                  </a>
                </span>
              )}
            </div>
          </div>
        </Sticky>
        {isMobile && (
          <div className="CommonPageTemplate__sidebarNav">
            <Sticky bottomBoundary="#main" stickyToPageBottom>
              <button
                type="button"
                className="CommonPageTemplate_nav"
                onClick={this.openNav}
              >
                <svg width="24" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>
            </Sticky>
          </div>
        )}
        <div id="mainWrap" className="CommonPageTemplate__mainWrap has-sidebar">
          <div
            role="button"
            tabIndex="-1"
            className="CommonPageTemplate__sidebarMask"
            onClick={this.hideNav}
          />
          <div
            className="CommonPageTemplate__sidebar"
            ref={(n) => {
              this.sidebar = n;
            }}
          >
            <div
              role="button"
              tabIndex="-1"
              className="CommonPageTemplate__sidebarWrap"
              onMouseUp={this.hideNav}
              ref={(n) => {
                this.sidebarWrap = n;
              }}
            >
              {sidebar}
            </div>
          </div>
          <div
            id="main"
            className="CommonPageTemplate__main"
            ref={(n) => {
              this.mainWrap = n;
            }}
          >
            {main}
            {this.props.isShowDrop && this.priceCard()}
          </div>
        </div>
      </div>
    );
  }
}

CommonPageTemplate.propTypes = {
  pageTitle: PropTypes.node,
  // sidebarStickyTop: PropTypes.string,
  // sidebarBottomBoundary: PropTypes.string,
  helmet: PropTypes.node,
  sidebar: PropTypes.node,
  main: PropTypes.node,
  isMobile: PropTypes.bool,
  isShowDrop: PropTypes.bool,
  pathname: PropTypes.string,
};

CommonPageTemplate.defaultProps = {
  // sidebarStickyTop: '#header',
  // sidebarBottomBoundary: '#mainWrap',
};

export default compose(
  withAdDropBox,
  withDeviceInfo,
)(CommonPageTemplate);

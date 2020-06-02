import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import throttle from 'lodash/throttle';
import get from 'lodash/get';

import Link from 'next/link';
import { withRouter } from 'next/router';

import scrollOffset from '@/utils/scrollOffset';
import { mapFeedData } from '@/utils/feed';
import commonMessages from '@/messages/common';
import { formatMessage } from '@/services/intl';

import notification from '@feat/feat-ui/lib/notification';

import Sticky from '@feat/feat-ui/lib/sticky';
import LazyLoad, {
  setVisibleCheck,
  forceCheck,
} from '@feat/feat-ui/lib/lazy-load';

import Button from '@feat/feat-ui/lib/button';
import Block from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import LoadableTemplateSection from '@/components/LoadableTemplateSection';

import MostBlock from './components/MostBlock';

import { mapPublication } from './utils';
import { REDUCER_KEY } from './reducer';

import {
  asyncFetchCategories,
  asyncFetchCategoryFeed,
  asyncFetchMostReadList,
  asyncFetchMostCommentedList,
  asyncFetchMostModifiedList,
  asyncFetchMostTrackList,
} from './actions';
import intlMessages from './messages';

import './style.scss';

const DELTA = 24;

class DimzouIndex extends React.Component {
  constructor(props) {
    super(props);
    this.section = undefined;
    this.updateSectionOnScroll = true;
    this.headerBottom = undefined;

    this.state = {
      pageTop: 0,
      section: undefined,
    };
    this.throttleWatchResize = throttle(this.watchResize, 300);
  }

  componentDidMount() {
    const { category } = this.props;
    if (!category.onceFetched) {
      this.props.fetchCategories().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
    if (process.browser) {
      this.throttleWatchResize();
      this.watchScroll();
      window.addEventListener('resize', this.throttleWatchResize);
      window.addEventListener('scroll', this.watchScroll);
    }
  }

  componentDidUpdate() {
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => {
      const dzCards = section.querySelectorAll('[data-ad-dropbox]');
      dzCards.forEach((d) => {
        const dzMark = d.querySelector('.dzCard__mark');
        const dataType = d.getAttribute('data-ad-dropbox');
        const cardTitle = d.querySelector('.dz-Card__title');
        const cardBody = d.querySelector('.dz-Card__body');
        const cardImage = d.querySelector('.dz-Card__imageWrap');
        const cardAvatar = d.querySelector('.dz-Card__avatar');
        const cardAdModule = d.querySelector('.AdModule');
        if (dataType === 'DropBox') {
          if (this.props.isShowDrop && !dzMark) {
            const mark = document.createElement('div');
            mark.classList.add('dzCard__mark');
            d.appendChild(mark);
            cardTitle.classList.add('underMark');
            cardBody.classList.add('underMark');
            cardImage.classList.add('underMark');
            cardAvatar.classList.add('underMark');
            cardAdModule && cardAdModule.classList.add('underMark');
          }
          if (!this.props.isShowDrop && dzMark) {
            d.removeChild(dzMark);
            cardTitle.classList.remove('underMark');
            cardBody.classList.remove('underMark');
            cardImage.classList.remove('underMark');
            cardAvatar.classList.remove('underMark');
            cardAdModule && cardAdModule.classList.remove('underMark');
          }
        }
      });
    });
    if (this.props.isShowDrop) {
      if (this.mainDom.getBoundingClientRect().top > 0) {
        setTimeout(() => {
          this.sideDom.style.top = `${
            this.mainDom.getBoundingClientRect().top
          }px`;
        }, 100);
      }
    } else {
      this.sideDom.style.top = '0px';
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      window.removeEventListener('resize', this.throttleWatchResize);
      window.removeEventListener('scroll', this.watchScroll);
    }
  }

  watchResize = () => {
    this.updateHeaderTop();
  };

  watchScroll = () => {
    this.updateSidebarHeight();
    this.updateSideberActiveButton();
  };

  updateSidebarHeight() {
    const mainBox = this.mainDom.getBoundingClientRect();
    const sideBox = this.sideDom.getBoundingClientRect();
    const headerBox = document.getElementById('header').getBoundingClientRect();
    this.sideDom.style.maxHeight = `${mainBox.bottom - sideBox.top}px`;
    if (this.props.isShowDrop && mainBox.top > headerBox.height + 2) {
      this.sideDom.style.top = `${mainBox.top}px`;
    } else {
      this.sideDom.style.top = `0px`;
    }
  }

  updateSideberActiveButton() {
    if (!this.updateSectionOnScroll) {
      return;
    }
    const box = this.mainDom.getBoundingClientRect();
    const pivotDom = document.elementFromPoint(box.left + 40, DELTA + 40);
    if (!pivotDom) {
      logging.warn('No Privot Dom');
      return;
    }

    const sectionDom = pivotDom.closest('[data-type="category-section"]');

    if (sectionDom && this.section !== sectionDom.dataset.section) {
      this.section = sectionDom.dataset.section;
      this.setState({
        section: sectionDom.dataset.section,
      });
    }
  }

  handleAnchorClick = (e) => {
    const button = e.target.closest('.ft-Button_anchor');
    if (button && this.mainDom) {
      const targetSection = this.mainDom.querySelector(
        `[data-section=${button.dataset.to}]`,
      );
      if (!targetSection) {
        return;
      }
      const offsetY = scrollOffset(document, targetSection) - DELTA - 40;

      setVisibleCheck(false);
      this.updateSectionOnScroll = false;
      this.setState(
        {
          section: button.dataset.to,
        },
        () => {
          window.scrollTo(0, offsetY);
          setVisibleCheck(true);
          forceCheck();
          this.updateSectionOnScroll = true;
        },
      );
    }
  };

  updateHeaderTop() {
    const pageTitle = document.querySelector('#page-title');
    const pageTop = pageTitle && pageTitle.getBoundingClientRect();
    const top = pageTop && pageTop.height + pageTop.top + 28; // 24(padding) + delta
    this.setState({
      pageTop: top,
    });
  }

  handleItemClick = (item) => {
    this.props.router.push(item.meta.link.href, item.meta.link.as).then(() => {
      window.scrollTo(0, 0);
    });
  };

  renderLeafCategorySection(category) {
    let maxItemCount;
    if (category.children) {
      maxItemCount = category.children.reduce(
        (sum, sub) => sum + get(sub, 'meta.feeds_count'),
        get(category, 'meta.feeds_count'),
      );
    } else {
      maxItemCount = get(category, 'meta.feeds_count');
    }
    if (!maxItemCount) {
      return null;
    }
    const sectionData = this.props.sections[category.id] || {};
    return (
      <Block
        className="ft-Block_feed"
        title={
          <TranslatableMessage
            message={{
              id: `category.${category.slug}`,
              defaultMessage: category.name,
            }}
          />
        }
        subHeader={
          <Link
            href={{
              pathname: 'dimzou-category-feed',
              query: {
                id: category.id,
              },
            }}
            as={`/category/${category.id}/dimzou`}
          >
            <a className="ft-Block__readMore pull-right">
              <TranslatableMessage message={commonMessages.readMore} />
            </a>
          </Link>
        }
        key={category.id}
      >
        <LazyLoad height={500} once offset={[20, -this.state.pageTop]}>
          <LoadableTemplateSection
            loader={() =>
              this.props
                .fetchCategoryFeed({
                  categoryId: category.id,
                  data: {
                    maxItemCount,
                  },
                })
                .catch((err) => {
                  notification.error({
                    message: 'Error',
                    description: err.message,
                  });
                })
            }
            initialized={sectionData.onceFetched}
            items={mapFeedData(get(sectionData, 'data.items', []))}
            loading={sectionData.loading}
            error={sectionData.error}
            template={get(sectionData, 'data.template')}
            onItemClick={this.handleItemClick}
          />
        </LazyLoad>
      </Block>
    );
  }

  renderCategorySection(category) {
    // if (category.children && category.children.length) {
    //   return category.children.map((subCategory) =>
    //     this.renderLeafCategorySection(subCategory),
    //   );
    // }
    return this.renderLeafCategorySection(category);
  }

  priceCard = () => null;

  renderSidebar() {
    const { category } = this.props;
    return (
      <div className="DimzouIndexSidebar">
        {category.data.map((item) => (
          <Button
            className={classNames('ft-Button_anchor', {
              'is-selected': `category_${item.id}` === this.state.section,
            })}
            key={item.id}
            type="merge"
            block
            data-track-anchor={`category_${item.id}_${item.name}`}
            data-anchor-type="SidebarLink"
            data-to={`category_${item.id}`}
            onClick={this.handleAnchorClick}
          >
            <TranslatableMessage
              message={{
                id: `category.${item.slug}`,
                defaultMessage: item.name,
              }}
            />
          </Button>
        ))}
      </div>
    );
  }

  render() {
    const {
      category: { data: categoryList, loading: isLoadingCategories },
    } = this.props;
    return (
      <div className="p-DimzouIndex">
        <div
          className="p-DimzouIndex__side"
          ref={(n) => {
            this.sideDom = n;
          }}
        >
          <div className="p-DimzouIndex__nav">{this.renderSidebar()}</div>
        </div>
        <div className="p-DimzouIndex__main">
          <div
            ref={(n) => {
              this.mainDom = n;
            }}
          >
            <div id="feed-sections">
              {isLoadingCategories && <div>...</div>}
              {categoryList &&
                categoryList.map((category) => (
                  <div
                    data-type="category-section"
                    name={`category_${category.id}`}
                    key={category.id}
                    data-section={`category_${category.id}`}
                    data-section-title={formatMessage({
                      id: `category.${category.slug}`,
                      defaultMessage: category.name,
                    })}
                    data-section-link={`/category/${category.id}`}
                  >
                    {this.renderCategorySection(category)}
                  </div>
                ))}
              {this.props.isShowDrop && this.priceCard()}
            </div>
          </div>
        </div>
        <div className="p-DimzouIndex__right">
          <Sticky top="#header" bottomBoundary="#main">
            <div className="p-DimzouIndex__sidebar">
              <MostBlock
                loader={this.props.fetchMostReadList}
                title={<TranslatableMessage message={intlMessages.mostRead} />}
                {...this.props.mostRead}
                data={mapPublication(this.props.mostRead.data)}
                prefix="mostRead"
              />
              <MostBlock
                loader={this.props.fetchMostModifiedList}
                title={
                  <TranslatableMessage message={intlMessages.mostModified} />
                }
                {...this.props.mostModified}
                data={mapPublication(this.props.mostModified.data)}
                prefix="mostModified"
              />
              <MostBlock
                loader={this.props.fetchMostCommentedList}
                title={
                  <TranslatableMessage message={intlMessages.mostCommented} />
                }
                {...this.props.mostCommented}
                data={mapPublication(this.props.mostCommented.data)}
                prefix="mostCommented"
              />
              <MostBlock
                loader={this.props.fetchMostTrackList}
                title={<TranslatableMessage message={intlMessages.mostTrack} />}
                {...this.props.mostTrack}
                data={this.props.mostTrack.data}
                prefix="mostTrack"
              />
            </div>
          </Sticky>
        </div>
      </div>
    );
  }
}

DimzouIndex.propTypes = {
  category: PropTypes.object,
  sections: PropTypes.object,
  mostRead: PropTypes.object,
  mostCommented: PropTypes.object,
  mostModified: PropTypes.object,
  topScored: PropTypes.object,
  fetchCategories: PropTypes.func,
  fetchCategoryFeed: PropTypes.func,
  fetchMostReadList: PropTypes.func,
  fetchMostCommentedList: PropTypes.func,
  fetchMostModifiedList: PropTypes.func,
  fetchMostTrackList: PropTypes.func,
};

const mapStateToProps = (state) => state[REDUCER_KEY];
const mapDispatchToProps = {
  fetchCategories: asyncFetchCategories,
  fetchCategoryFeed: asyncFetchCategoryFeed,
  fetchMostReadList: asyncFetchMostReadList,
  fetchMostCommentedList: asyncFetchMostCommentedList,
  fetchMostModifiedList: asyncFetchMostModifiedList,
  fetchMostTrackList: asyncFetchMostTrackList,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(DimzouIndex);

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { withRouter } from 'next/router';

import injectReducer from '@/utils/injectReducer';
import scrollOffset from '@/utils/scrollOffset';
import { getPageLink } from '@/utils/feed';

import notification from '@feat/feat-ui/lib/notification';

import Sticky from '@feat/feat-ui/lib/sticky';
import { setVisibleCheck, forceCheck } from '@feat/feat-ui/lib/lazy-load';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import ScrollBox from '@/components/ScrollBox';
import InlineFilterForm from '@/components/InlineFilterForm';

import FeedRenderContextProvider from '@/components/FeedRender/Provider';
import StickySidebarWithAutoHeight from '@/components/StickySidebarWithAutoHeight';

import ScrollToTop from '@/components/ScrollToTop';
import scrollStop from '@/components/ScrollToTop/scrollStop';

import MostTrack from './components/MostTrack';
import MostRead from './components/MostRead';
import MostModified from './components/MostModified';
import MostCommented from './components/MostCommented';

import reducer, { REDUCER_KEY } from './reducer';

import { asyncFetchCategories, updateCategoryFilter } from './actions';
import intlMessages from './messages';

import CategoryList from './components/CategoryList';
import CategoryFeedBlock from './components/CategoryFeedBlock';
import { mapFeedData } from './utils';
import './style.scss';

const DELTA = 56 + 50; // active section detect: header + offset;

class DimzouIndex extends React.Component {
  constructor(props) {
    super(props);
    this.section = undefined;
    this.updateSectionOnScroll = true;
    this.lazyOffset = [50, 60];

    this.state = {
      section: undefined,
    };
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
    if (typeof window === 'object') {
      this.watchScroll();
      window.addEventListener('scroll', this.watchScroll);
    }
  }

  componentWillUnmount() {
    if (typeof window === 'object') {
      window.removeEventListener('scroll', this.watchScroll);
    }
  }

  watchScroll = () => {
    // this.updateSidebarHeight();
    this.updateSideberActiveButton();
  };

  disableScrollDetect = () => {
    this.updateSectionOnScroll = false;
    setVisibleCheck(false);
  };

  enableScrollDetect = () => {
    this.updateSectionOnScroll = true;
    setVisibleCheck(true);
    forceCheck();
  };

  afterScrollTop = () => {
    this.enableScrollDetect();
    this.setState({
      section: undefined,
    });
  };

  getCategories = () => {
    const {
      category: { data, keyword },
      intl: { formatMessage },
    } = this.props;
    if (keyword && data) {
      return data.filter((item) => {
        const message = formatMessage({
          id: `category.${item.slug}`,
        });
        return message.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    }
    return data;
  };

  updateSideberActiveButton() {
    if (!this.updateSectionOnScroll) {
      return;
    }
    const box = this.mainDom.getBoundingClientRect();
    const pivotDom = document.elementFromPoint(box.left + 40, DELTA);

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

  handleCategoryItemClick = (e, cat) => {
    const sectionName = `category_${cat.id}`;
    const targetSection = this.mainDom.querySelector(
      `[data-section=${sectionName}]`,
    );
    if (!targetSection) {
      return;
    }
    const offsetY = scrollOffset(document, targetSection) - DELTA + 30;

    this.disableScrollDetect();
    this.setState(
      {
        section: sectionName,
      },
      () => {
        scrollStop(this.enableScrollDetect, true);
        window.scrollTo({
          top: offsetY,
          behavior: 'smooth',
        });
      },
    );
  };

  handleItemClick = (item) => {
    const link = getPageLink(item);
    this.props.router.push(link.href, link.as).then(() => {
      window.scrollTo(0, 0);
    });
  };

  handleFilterForm = (keyword) => {
    this.disableScrollDetect();
    window.scrollTo({
      top: 0,
    });
    this.afterScrollTop();
    this.props.updateCategoryFilter(keyword);
  };

  render() {
    const {
      category: { keyword },
      intl: { formatMessage },
    } = this.props;
    const categories = this.getCategories();
    return (
      <div className="p-DimzouIndex">
        <div className="p-DimzouIndex__side">
          <StickySidebarWithAutoHeight className="p-DimzouIndex__sideInner">
            <div className="p-DimzouIndex__filter">
              <InlineFilterForm
                initialKeyword={keyword}
                onSubmit={this.handleFilterForm}
              />
            </div>
            <div className="p-DimzouIndex__startAnchor">
              <ScrollToTop
                className="ft-Button_anchor"
                beforeScroll={this.disableScrollDetect}
                afterScroll={this.afterScrollTop}
              />
            </div>
            <ScrollBox stopScrollPropagation style={{ flex: 1 }}>
              {categories && (
                <CategoryList
                  data={categories}
                  selected={
                    this.state.section
                      ? this.state.section.replace('category_', '')
                      : ''
                  }
                  onItemClick={this.handleCategoryItemClick}
                />
              )}
            </ScrollBox>
          </StickySidebarWithAutoHeight>
        </div>
        <div
          className="p-DimzouIndex__main"
          ref={(n) => {
            this.mainDom = n;
          }}
        >
          <FeedRenderContextProvider mapData={mapFeedData} id="feed-sections">
            {categories &&
              !categories.length && (
                <div className="p-DimzouIndex__noCategoryHint">
                  <TranslatableMessage
                    message={intlMessages.noRelatedCategories}
                  />
                </div>
              )}
            {categories &&
              categories.map((category) => (
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
                  <CategoryFeedBlock
                    category={category}
                    onItemClick={this.handleItemClick}
                    lazyOffset={this.lazyOffset}
                  />
                </div>
              ))}
          </FeedRenderContextProvider>
        </div>
        <div className="p-DimzouIndex__right">
          <Sticky top="#header" bottomBoundary="#main">
            <div className="p-DimzouIndex__sidebar">
              <MostRead />
              <MostModified />
              <MostCommented />
              <MostTrack />
            </div>
          </Sticky>
        </div>
      </div>
    );
  }
}

DimzouIndex.propTypes = {
  category: PropTypes.object,
  fetchCategories: PropTypes.func,
  updateCategoryFilter: PropTypes.func,
  router: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = (state) => state[REDUCER_KEY];
const mapDispatchToProps = {
  fetchCategories: asyncFetchCategories,
  updateCategoryFilter,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: REDUCER_KEY, reducer });

export default compose(
  withRouter,
  withReducer,
  withConnect,
  injectIntl,
)(DimzouIndex);

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';

import { withRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import injectReducer from '@/utils/injectReducer';
import { mapFeedData } from '@/utils/feed';
import { concatHeaders } from '@/utils/router';

import notification from '@feat/feat-ui/lib/notification';

import Template from '@/components/CommonPageTemplate';
import TemplateFeedList from '@/components/TemplateFeedList';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { asyncFetchCategoryFeeds } from './actions';

import { makeSelectPageCategory } from '../selectors';
import { selectPageContent } from './selectors';
import { REDUCER_KEY } from './config';
import reducer from './reducer';

import intlMessages from '../messages';
import { pageTitle } from '../../../messages/common';

class CommonCategoryPage extends React.PureComponent {
  componentDidMount() {
    this.initFetch();
  }

  componentDidUpdate() {
    this.initFetch();
  }

  initFetch() {
    if (!this.props.content.onceFetched && !this.props.content.loading) {
      this.fetchItems();
    }
  }

  fetchItems = () => {
    this.props
      .fetchCategoryFeeds({
        categoryId: this.props.categoryId,
        data: this.props.content.next || undefined,
      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
  };

  handleItemClick = (item) => {
    this.props.router.push(item.meta.link.href, item.meta.link.as).then(() => {
      window.scrollTo(0, 0);
    });
  };

  renderSidebar() {
    const { pageCategory, router } = this.props;
    return (
      pageCategory.children &&
      pageCategory.children.map((category) => (
        <div key={category.id}>
          <Link
            href={{
              pathname: '/dimzou-category-feed',
              query: {
                id: category.id,
              },
            }}
            as={`/category/${category.id}/dimzou`}
          >
            <a
              className={classNames(
                'ft-Button ft-Button_sm ft-Button_block ft-Button_anchor',
                {
                  'is-selected':
                    String(router.query.id) === String(category.id),
                },
              )}
            >
              <TranslatableMessage
                message={{
                  id: `category.${category.slug}`,
                  defaultMessage: category.name,
                }}
              />
            </a>
          </Link>
        </div>
      ))
    );
  }

  renderMainContent() {
    const {
      content: { items, loading, hasMore, templates },
    } = this.props;
    return (
      <TemplateFeedList
        items={items.length ? mapFeedData(items) : []}
        templates={templates || []}
        loading={loading}
        hasMore={hasMore}
        loadMore={this.fetchItems}
        noContentLabel={
          <TranslatableMessage message={intlMessages.noContentLabel} />
        }
        onItemClick={this.handleItemClick}
      />
    );
  }

  render() {
    const {
      pageCategory,
      intl: { formatMessage },
    } = this.props;
    if (pageCategory === false) {
      return <h1>404</h1>;
    }

    if (!pageCategory) {
      return <div>{formatMessage(intlMessages.fetchingCategoryInfo)}</div>;
    }

    return (
      <Template
        pageTitle={
          <>
            <TranslatableMessage
              message={{
                id: `category.${pageCategory.slug}`,
                defaultMessage: pageCategory.name,
              }}
            />
            <Head>
              <title>
                {concatHeaders(
                  formatMessage(pageTitle.dimzouCategory, {
                    category: formatMessage({
                      id: `category.${pageCategory.slug}`,
                      defaultMessage: pageCategory.name,
                    }),
                  }),
                )}
              </title>
            </Head>
          </>
        }
        sidebar={this.renderSidebar()}
        main={this.renderMainContent()}
      />
    );
  }
}

CommonCategoryPage.propTypes = {
  fetchCategoryFeeds: PropTypes.func,
  content: PropTypes.object,
  pageCategory: PropTypes.object,
  router: PropTypes.object,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  intl: PropTypes.object,
};

const mapStateToProps = () =>
  createStructuredSelector({
    pageCategory: makeSelectPageCategory(),
    content: selectPageContent,
  });

const mapDispatchToProps = {
  fetchCategoryFeeds: asyncFetchCategoryFeeds,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({
  key: REDUCER_KEY,
  reducer,
});

export default compose(
  withRouter,
  withReducer,
  withConnect,
  injectIntl,
)(CommonCategoryPage);

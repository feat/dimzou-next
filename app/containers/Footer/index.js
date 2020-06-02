/**
 *
 * Footer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Slider from 'react-slick';

import Link from 'next/link';

import { asyncFetchMenu } from '@/modules/menu/actions';
import { makeSelectMenu } from '@/modules/menu/selectors';
import { isTranslateModeEnabled as isTranslateModeEnabledSeelctor } from '@/modules/language/selectors';
import { selectCategoryTree } from '@/modules/category/selectors';

import commonMessage from '@/messages/common';
import logo from '@/images/footer-logo.png';

import { Footer } from '@feat/feat-ui/lib/layout';
import { FlexCol } from '@feat/feat-ui/lib/grid';
import notification from '@feat/feat-ui/lib/notification';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import './style.scss';

const SLIDE_ITEM_COUNT = 6;
const SLIDE_ITEM_COUNT_MIN = 3;
const SLIDE_ITEM_COUNT_S = 2;
class FooterContainer extends React.Component {
  constructor() {
    super();
    this.screenX = this.screenX.bind(this);
    this.state = {
      x: '',
    };
  }

  componentDidMount() {
    const { footerMenu } = this.props;
    if (!footerMenu) {
      this.props
        .fetchMenu({
          name: 'footer',
        })
        .catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        });
    }

    const screenx = window.innerWidth;
    this.setState({
      x: screenx,
    });
    window.addEventListener('resize', this.screenX);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.screenX);
  }

  screenX() {
    const screenx = window.innerWidth;
    this.setState({
      x: screenx,
    });
  }

  getSlideCount() {
    const { x } = this.state;
    if (x > 1200) {
      return SLIDE_ITEM_COUNT;
    }
    if (x > 500) {
      return SLIDE_ITEM_COUNT_MIN;
    }
    return SLIDE_ITEM_COUNT_S;
  }

  render() {
    const { categoryTree, footerMenu, isTranslateModeEnabled } = this.props;

    if (
      !this.footerPlaceholderGroup ||
      this.footerLinksCount !== categoryTree.length
    ) {
      this.footerLinksCount = categoryTree.length;
      const placehhoderCount = 0;
      // SLIDE_ITEM_COUNT -
      // ((categoryTree.length + SLIDE_ITEM_COUNT) % SLIDE_ITEM_COUNT);
      this.footerPlaceholderGroup = [];
      for (let i = 0; i < placehhoderCount; i += 1) {
        this.footerPlaceholderGroup.push({
          key: Math.floor(Math.random() * 1000),
        });
      }
    }

    const slideCount = this.getSlideCount();
    return (
      <Footer className="FeatFooter">
        <div className="FeatFooter__logo">
          <Link href="/about" prefetch={false}>
            <a>
              <img id="footer-logo" alt="Feat" src={logo} />
            </a>
          </Link>
        </div>
        <div className="FeatFooter__left">
          <FlexCol>
            <div className="FeatFooter__copyright">
              {/* <SvgIcon icon="feat-v2" /> */}
              <p>
                <TranslatableMessage message={commonMessage.copyright} /> © 2010
                - {new Date().getFullYear()}
              </p>
              <p>Feat Inc.</p>
              <p>
                <TranslatableMessage
                  message={commonMessage.allRightsReserved}
                />
              </p>
            </div>
            <div className="FeatFooter__termsLink">
              {footerMenu &&
                footerMenu.items &&
                footerMenu.items.map((link) => (
                  <a href={link.alias} key={link.id}>
                    <TranslatableMessage message={{ id: link.label }} />
                  </a>
                ))}
            </div>
          </FlexCol>
        </div>
        <div className="FeatFooter__right">
          {categoryTree && (
            <Slider
              dots
              infinite={false}
              speed={500}
              draggable={!isTranslateModeEnabled}
              slidesToShow={slideCount}
              slidesToScroll={slideCount}
            >
              {categoryTree.map((group) => (
                <div key={group.id}>
                  <h3 className="FooterCol__title">
                    <Link
                      href={{
                        pathname: '/category-feed',
                        query: {
                          id: group.id,
                        },
                      }}
                      as={`/category/${group.id}`}
                    >
                      <a
                        className="FooterLink"
                        data-feeds-count={
                          group.meta ? group.meta.feedsCountWithDescendants : 0
                        }
                      >
                        <TranslatableMessage
                          message={{
                            id: `category.${group.slug}`,
                            defaultMessage: group.name,
                          }}
                        />
                      </a>
                    </Link>
                  </h3>
                  <ul className="FooterCol__content FooterLinks">
                    {group.children &&
                      group.children.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={{
                              pathname: '/category-feed',
                              query: {
                                id: item.id,
                              },
                            }}
                            as={`/category/${item.id}`}
                          >
                            <a
                              className="FooterLink FooterLink_sub"
                              data-feeds-count={
                                item.meta
                                  ? item.meta.feedsCountWithDescendants
                                  : 0
                              }
                            >
                              <TranslatableMessage
                                message={{
                                  id: `category.${item.slug}`,
                                  defaultMessage: item.name,
                                }}
                              />
                            </a>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              {this.footerPlaceholderGroup.map((item) => (
                <div key={item.key} />
              ))}
            </Slider>
          )}
        </div>
      </Footer>
    );
  }
}

FooterContainer.propTypes = {
  categoryTree: PropTypes.array,
  footerMenu: PropTypes.object,
  fetchMenu: PropTypes.func,
  isTranslateModeEnabled: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  footerMenu: makeSelectMenu('footer'),
  categoryTree: selectCategoryTree,
  isTranslateModeEnabled: isTranslateModeEnabledSeelctor,
});

const mapDispatchToProps = {
  fetchMenu: asyncFetchMenu,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FooterContainer);

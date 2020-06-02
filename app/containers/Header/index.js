/**
 *
 * Header
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import getConfig from 'next/config';

import classNames from 'classnames';
import { connect } from 'react-redux';

import Link from 'next/link';
import { withRouter } from 'next/router';

import { asPathname } from '@/utils/router';

import mMessages from '@/messages/menu';
import { selectCurrentUser } from '@/modules/auth/selectors';

import LanguageSelectModal from '@/modules/language/containers/LanguageSelectModal';
import LanguageSelectTrigger from '@/modules/language/containers/LanguageSelectTrigger';
import TranslateLocaleSelectModal from '@/modules/language/containers/TranslateLanguageSelectModal';
import TranslatableModeHint from '@/modules/language/containers/TranslatableModeHint';

import {
  isTranslateModeEnabled,
  isTranslateLanguageSelectOpened,
} from '@/modules/language/selectors';
import {
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
} from '@/modules/language/actions';

import { Header } from '@feat/feat-ui/lib/layout';
import Navbar from '@feat/feat-ui/lib/navbar';
import Menu from '@feat/feat-ui/lib/menu';


/* assets */
// import logo from '@/images/footer-logo.png';
// import dollar from '@/images/dollar.svg';
// import book from '@/images/book.svg';
// import awesome from '@/images/awesome.svg';
// import search from '@/images/search.svg';

// import feat from '@/images/f.svg';

import UserMenu from './UserMenu';

import './style.scss';

class HeaderContainer extends Component {
  renderUserMenu() {
    const { currentUser, router } = this.props;
    const { query } = router;
    if (!currentUser.uid) {
      let menuQuery;
      if (query.redirect) {
        menuQuery = query;
      } else if (router.asPath.indexOf('auth') === -1) {
        menuQuery = {
          redirect: router.asPath,
        };
      }
      return (
        <Menu>
          <Link
            href={{
              pathname: '/auth/login',
              query: menuQuery,
            }}
          >
            <a
              className={classNames('ft-Menu__item', {
                'is-active': asPathname(router.asPath) === '/auth/login',
              })}
              data-track-anchor="Login"
              data-anchor-type="UserMenu"
            >
              <FormattedMessage {...mMessages.signIn} />
            </a>
          </Link>
          <Link
            href={{
              pathname: '/auth/register',
              query: menuQuery,
            }}
          >
            <a
              className={classNames('ft-Menu__item', {
                'is-active': asPathname(router.asPath) === '/auth/register',
              })}
              data-track-anchor="Register"
              data-anchor-type="UserMenu"
            >
              <FormattedMessage {...mMessages.signUp} />
            </a>
          </Link>
        </Menu>
      );
    }
    return <UserMenu user={currentUser} />;
  }

  renderRootLinks() {
    const { router } = this.props;
    return (
      <div id="header-main-menu" className="ft-Menu">
        {/* <Link href={{ pathname: '/about' }}>
          <div
            className="Header__menuIcon"
            dangerouslySetInnerHTML={{ __html: feat }}
          />
        </Link> */}
        <Link href={{ pathname: '/dimzou-index' }} as="/">
          <a
            className={classNames('ft-Menu__item', {
              'is-active': asPathname(router.asPath) === '/',
            })}
          >
            Home
          </a>
        </Link>
      </div>
    );
  }

  render() {
    const { subMenu } = this.props;

    return (
      <Header
        className={classNames('Header', {
          'has-subMenu': !!subMenu,
        })}
        id="header"
      >
        <Navbar>
          <Navbar.Left>
            <div className="Header__navLink">{this.renderRootLinks()}</div>
          </Navbar.Left>
          <Navbar.Right>
            <LanguageSelectModal isRegion />
            {this.renderUserMenu()}
          </Navbar.Right>
          <div className="ft-Navbar__bottom">
            <LanguageSelectTrigger className="ft-Menu__item" />
          </div>
          <TranslateLocaleSelectModal />
          <TranslatableModeHint />
        </Navbar>
        {subMenu && <div className="Header__subMenu">{subMenu}</div>}
      </Header>
    );
  }
}

HeaderContainer.propTypes = {
  currentUser: PropTypes.object,
  isTranslateModeEnabled: PropTypes.bool,
  isTranslateLanguageSelectOpened: PropTypes.bool,
  disableTranslationMode: PropTypes.func.isRequired,
  closeTranslateLanguageSelect: PropTypes.func.isRequired,
  openTranslateLanguageSelect: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isTranslateModeEnabled,
  isTranslateLanguageSelectOpened,
});

const mapDispatchToProps = {
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  injectIntl,
  withRouter,
  withConnect,
)(HeaderContainer);

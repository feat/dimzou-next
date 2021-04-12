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

import classNames from 'classnames';
import { connect } from 'react-redux';

import Link from 'next/link';
import { withRouter } from 'next/router';

import { asPathname, getAsPath } from '@/utils/router';

import mMessages from '@/messages/menu';
import { selectCurrentUser } from '@/modules/auth/selectors';

import LanguageSelectModal from '@/modules/language/containers/LanguageSelectModal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import LanguageSelectTrigger from '@/modules/language/containers/LanguageSelectTrigger';

import {
  isLanguageSelectOpened,
  isTranslateModeEnabled,
  isTranslateLanguageSelectOpened,
  selectCurrentLocale,
} from '@/modules/language/selectors';
import {
  changeLocale,
  disableTranslationMode,
  closeLanguageSelect,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
} from '@/modules/language/actions';

import { SiteHeader } from '@/components/Layout';
import Navbar from '@feat/feat-ui/lib/navbar';
import Menu from '@feat/feat-ui/lib/menu';

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
          <a
            className={classNames('ft-Menu__item', {
              'is-active': asPathname(router.asPath) === '/auth/login',
            })}
            data-track-anchor="Login"
            data-anchor-type="UserMenu"
            href={getAsPath('/auth/login', menuQuery)}
          >
            <FormattedMessage {...mMessages.signIn} />
          </a>
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
            <TranslatableMessage message={mMessages.home} />
          </a>
        </Link>
      </div>
    );
  }

  render() {
    const { subMenu } = this.props;

    return (
      <SiteHeader
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
            <LanguageSelectModal
              isRegion
              isOpen={this.props.isLanguageSelectOpened}
              selectedLang={this.props.currentLocale}
              onClose={this.props.closeLanguageSelect}
              onConfirm={(locale, option) => {
                this.props.changeLocale({
                  locale,
                  localeLabel: option.label,
                  localeRegion: option.label_region,
                  forceRefresh: true,
                });
              }}
            />
            <LanguageSelectTrigger
              className="ft-Menu__item"
              style={{ marginRight: 10 }}
            />
            {this.renderUserMenu()}
          </Navbar.Right>
        </Navbar>
        {subMenu && <div className="Header__subMenu">{subMenu}</div>}
      </SiteHeader>
    );
  }
}

HeaderContainer.propTypes = {
  currentUser: PropTypes.object,
  // language select modal
  isLanguageSelectOpened: PropTypes.bool,
  changeLocale: PropTypes.func,
  currentLocale: PropTypes.string,
  // translate lang select modal
  isTranslateModeEnabled: PropTypes.bool,
  isTranslateLanguageSelectOpened: PropTypes.bool,
  disableTranslationMode: PropTypes.func.isRequired,
  closeLanguageSelect: PropTypes.func,
  closeTranslateLanguageSelect: PropTypes.func.isRequired,
  openTranslateLanguageSelect: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentLocale: selectCurrentLocale,
  isLanguageSelectOpened,
  isTranslateModeEnabled,
  isTranslateLanguageSelectOpened,
});

const mapDispatchToProps = {
  disableTranslationMode,
  closeLanguageSelect,
  closeTranslateLanguageSelect,
  openTranslateLanguageSelect,
  changeLocale,
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

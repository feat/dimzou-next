/**
 *
 * MenuPages
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux';
import classNames from 'classnames'

import Link from 'next/link'
import { withRouter } from 'next/router'

import { createStructuredSelector } from 'reselect';
import { formatMessage } from '@/services/intl';
import commonMessages from '@/messages/common';

import notification from '@feat/feat-ui/lib/notification'

import Template from '@/components/CommonPageTemplate';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import SplashView from '@/components/SplashView';

import { makeSelectMenu } from '@/modules/menu/selectors';
import { asyncFetchMenu } from '@/modules/menu/actions';
import Terms from '@/modules/terms';
import Publication from '@/modules/dimzou-view/containers/Publication';

export class MenuPages extends React.Component {
  componentDidMount() {
    if (!this.props.menu) {
      this.props.fetchMenu({ name: this.props.menuSlug }).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        })
      });
    }
  }

  renderRoute(item) {
    const link = item.resource;
    const termResult = /\/term\/(.*)$/.exec(link);
    if (termResult) {
      return (
        <Terms
          style={{ maxWidth: 750, paddingBottom: 120, margin: '0 auto' }}
          key={termResult[1]}
          slug={termResult[1]}
        />
      );
    }
    const dimzouResult = /\/dimzou\/(.*)$/.exec(link);
    if (dimzouResult) {
      return <Publication key={dimzouResult[1]} bundleId={dimzouResult[1]} />;
    }

    return <div>{formatMessage(commonMessages.noContentHint)}</div>;
  }

  renderMain() {
    const {
      menu: { items },
      router,
    } = this.props;
    const item = items.find((el) => el.alias === router.asPath)
    if (!item) {
      return <div>404</div>
    }

    return this.renderRoute(item)
  }

  render() {
    const { menu, pageTitle, router } = this.props;
    if (!menu || menu.fetching) {
      return <SplashView />;
    }
    // TODO menu item config
    return (
      <Template
        pageTitle={pageTitle}
        sidebar={
          <div>
            {menu.items.map((item) => (
              <Link
                href={item.alias}
                as={item.alias}
              >
                <a
                  className={classNames("ft-Menu__item", {
                    'is-active': item.alias === router.asPath,
                  })}
                  style={{ display: 'block' }}
                  key={item.id}
                >
                  <TranslatableMessage message={{ id: item.label }} />
                </a>
              </Link>
            ))}
          </div>
        }
        main={this.renderMain()}
      />
    );
  }
}

MenuPages.propTypes = {
  router: PropTypes.object,
  pageTitle: PropTypes.string,
  fetchMenu: PropTypes.func,
  menu: PropTypes.object,
  menuSlug: PropTypes.string,
};

const mapStateToProps = (_, props) =>
  createStructuredSelector({
    menu: makeSelectMenu(props.menuSlug),
  });


const withConnect = connect(
  mapStateToProps,
  {
    fetchMenu: asyncFetchMenu,
  }
);

export default compose(
  withRouter,
  withConnect,
)(MenuPages);

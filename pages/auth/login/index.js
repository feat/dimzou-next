import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import dynamic from 'next/dynamic';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';

import commonMessages from '@/messages/common';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';
import '../style.scss';

const DynamicPhoneLoginForm = dynamic(
  () => import('@/components/PhoneLoginForm'),
  { ssr: false },
);

// eslint-disable-next-line
class LoginPage extends Component {
  renderMain() {
    return (
      <div className="p-AuthTemplate">
        <div className="p-AuthTemplate__promoteContainer">
          <div className="p-AuthTemplate__promoteWrapper">
            <h1 className="p-AuthTemplate__title">
              <SvgIcon className="p-AuthTemplate__logo" icon="feat-v2" />
            </h1>
            <p className="p-AuthTemplate__promoteWords">
              <FormattedMessage {...commonMessages.slogan} />
            </p>
          </div>
        </div>
        <div className="p-AuthTemplate__formContainer">
          <div className="p-AuthTemplate__form">
            <DynamicPhoneLoginForm />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <SiteLayout mode="fixed-header">
        <Header />
        <Content>
          <Layout>
            <Layout.Main>
              <Layout.Main modifier="base" id="main">
                {this.renderMain()}
              </Layout.Main>
            </Layout.Main>
            <Footer />
          </Layout>
        </Content>
      </SiteLayout>
    );
  }
}

export default LoginPage;

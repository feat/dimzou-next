import React, { Component } from 'react';
import dynamic from 'next/dynamic';

import Layout, { Site, SiteContent } from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';

import '../style.scss';

const Dynamic = dynamic(() => import('@/routes/Auth/AccountRecovery'), {
  ssr: false,
});

// eslint-disable-next-line
class LoginPage extends Component {
  render() {
    return (
      <Site mode="fixed-header">
        <Header />
        <SiteContent>
          <Layout>
            <Layout.Main>
              <Layout.Main modifier="base" id="main">
                <Dynamic />
              </Layout.Main>
            </Layout.Main>
            <Footer />
          </Layout>
        </SiteContent>
      </Site>
    );
  }
}

export default LoginPage;

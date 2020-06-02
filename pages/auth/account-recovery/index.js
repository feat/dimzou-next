import React, { Component } from 'react';
import dynamic from 'next/dynamic'

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';

import '../style.scss'

const Dynamic = dynamic(
  () => import('@/routes/Auth/AccountRecovery'),
  { ssr: false }
)

// eslint-disable-next-line
class LoginPage extends Component {
  render() {
    return (
      <SiteLayout mode="fixed-header">
        <Header />
        <Content>
          <Layout>
            <Layout.Main>
              <Layout.Main modifier="base" id="main">
                <Dynamic />
              </Layout.Main>
            </Layout.Main>
            <Footer />
          </Layout>
        </Content>
      </SiteLayout>
    )
  }
}

export default LoginPage;

import React from 'react';
import Navbar from '@feat/feat-ui/lib/navbar';
import Layout, { Site, SiteHeader, SiteContent } from './index';
import '@/routes/DimzouIndex/style.scss';

export default {
  title: 'Componenets/PageLayout',
  component: Layout,
};

export const Common = () => (
  <Site mode="fixed-header">
    <SiteHeader>
      <Navbar>
        <Navbar.Left>
          <div className="Header__navLink">FEAT</div>
        </Navbar.Left>
      </Navbar>
    </SiteHeader>
    <SiteContent style={{ height: '100%', background: '#f3f3f3' }}>
      <div style={{ padding: 16 }}>Content</div>
    </SiteContent>
  </Site>
);

export const DimzouIndex = () => (
  <Site mode="fixed-header">
    <SiteHeader>
      <Navbar>
        <Navbar.Left>
          <div className="Header__navLink">FEAT</div>
        </Navbar.Left>
      </Navbar>
    </SiteHeader>
    <SiteContent style={{ height: '100%', background: '#f3f3f3' }}>
      <Layout>
        <Layout.Main>
          <div className="p-DimzouIndex">
            <div className="p-DimzouIndex__side">
              <div
                className="p-DimzouIndex__sideInner"
                style={{ backgroundColor: '#33a9dd30', height: '80vh' }}
              >
                SideInner
              </div>
            </div>
            <div className="p-DimzouIndex__main">
              <div className="p-DimzouIndex__filterWrap">Sticky</div>
              <div style={{ backgroundColor: '#33a9dd30', height: '200vh' }}>
                Main
              </div>
            </div>
            <div className="p-DimzouIndex__right">
              <div style={{ backgroundColor: '#33a9dd30', height: '80vh' }}>
                Right
              </div>
            </div>
          </div>
        </Layout.Main>
        <Layout.Sidebar>
          <div style={{ backgroundColor: '#33a9dd30', height: '80vh' }}>
            AdPanel
          </div>
        </Layout.Sidebar>
      </Layout>
    </SiteContent>
  </Site>
);

import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import SplashView from '@/components/SplashView'

const DynamicEdit = dynamic(
  () => import('@/modules/dimzou-edit'),
  {
    loading: () => <SplashView hint='Chunk loading...' />,
    ssr: false,
  }
)

function DimzouEdit() {
  const router = useRouter()

  return (
    <SiteLayout 
      mode="fixed-header"
    >
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <DynamicEdit 
                {...router.query}
              />
            </Layout.Main>
          </Layout.Main>
          <Footer />
        </Layout>
      </Content>
    </SiteLayout>
  )
}




export default DimzouEdit
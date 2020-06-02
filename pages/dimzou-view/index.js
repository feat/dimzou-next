import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import get from 'lodash/get'

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import SplashView from '@/components/SplashView';
import { REDUCER_KEY } from '@/modules/dimzou-view/reducer';
import { asyncInitDimzouView } from '@/modules/dimzou-view/actions';

const Dynamic = dynamic(
  () => import('@/modules/dimzou-view/containers/DimzouView'),
  {
    loading: () => <SplashView />,
  }
)

function DimzouDetail() {
  const router = useRouter();
  return (
    <SiteLayout mode="fixed-header">
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic  
                bundleId={router.query.bundleId}
                nodeId={router.query.nodeId}
              />
            </Layout.Main>
          </Layout.Main>
          <Footer />
        </Layout>
      </Content>
    </SiteLayout>
  )
}

DimzouDetail.getInitialProps = async ({ store, query, req }) => {
  // select state
  const state = get(store.getState(), [REDUCER_KEY, query.bundleId])
  if (!state || !state.initialized) {
    try {
      await store.dispatch(asyncInitDimzouView({
        ...query,
        related: true,
      }, req ? {
        headers: req.getApiHeaders(),
      } : undefined))
    } catch (err) {
      if (err.code !== 'NOT_FOUND') {
        // TODO
      }
    };
    
  }
  
  return {}
}
  
export default DimzouDetail
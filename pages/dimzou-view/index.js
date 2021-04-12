import { useRouter } from 'next/router';

import getReducerInjectors from '@/utils/reducerInjectors';

import Layout, { Site, SiteContent } from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import { REDUCER_KEY } from '@/modules/dimzou-view/config';
import {
  asyncFetchBundlePublicationMeta,
  asyncFetchNodePublication,
} from '@/modules/dimzou-view/actions';
import Render from '@/modules/dimzou-view';

function DimzouDetail() {
  const router = useRouter();
  return (
    <Site mode="fixed-header">
      <Header />
      <SiteContent>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Render
                bundleId={router.query.bundleId}
                nodeId={router.query.nodeId}
              />
            </Layout.Main>
          </Layout.Main>
          <Footer />
        </Layout>
      </SiteContent>
    </Site>
  );
}

DimzouDetail.getInitialProps = async ({ store, query }) => {
  if (typeof window === 'undefined') {
    const { default: reducer } = await import('@/modules/dimzou-view/reducer');
    getReducerInjectors(store).injectReducer(REDUCER_KEY, reducer);
    const info = await store.dispatch(
      asyncFetchBundlePublicationMeta({
        bundleId: query.bundleId,
      }),
    );
    if (info) {
      await store.dispatch(
        asyncFetchNodePublication({
          bundleId: query.bundleId,
          nodeId: query.nodeId || info.nodes[0].id,
          related: !info.bundle_is_multi_chapter,
        }),
      );
    }
  }
  return {};
};

export default DimzouDetail;

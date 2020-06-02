import dynamic from 'next/dynamic';
import get from 'lodash/get';

// import request from '@/utils/request';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import Sidebar from '@/containers/Sidebar';
import SplashView from '@/components/SplashView';

import { REDUCER_KEY } from '@/routes/DimzouIndex/reducer';
import {
  asyncFetchCategories,
  asyncFetchMostReadList,
  asyncFetchMostCommentedList,
  asyncFetchMostModifiedList,
  asyncFetchMostTrackList,
  asyncFetchCategoryFeed,
  // fetchCategories,
  // fetchMostReadList,
  // fetchMostCommentedList,
  // fetchMostModifiedList,
} from '@/routes/DimzouIndex/actions';

const Dynamic = dynamic(
  () => import(/* webpackChunkName: "dimzou-index" */ '@/routes/DimzouIndex'),
  {
    loading: () => <SplashView />,
  },
);

function DimzouIndex() {
  return (
    <SiteLayout mode="fixed-header">
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic />
            </Layout.Main>
            <Footer />
          </Layout.Main>
          <Sidebar />
        </Layout>
      </Content>
    </SiteLayout>
  );
}

DimzouIndex.getInitialProps = async ({ store, req }) => {
  const state = store.getState()[REDUCER_KEY];
  const promises = [];
  try {
    if (!state.category.onceFetched) {
      promises.push(
        store.dispatch(
          asyncFetchCategories(
            req ? { headers: req.getApiHeaders() } : undefined,
          ),
        ),
      );
    }
    if (!state.mostRead.onceFetched) {
      promises.push(
        store.dispatch(
          asyncFetchMostReadList(
            req
              ? {
                headers: req.getApiHeaders(),
              }
              : undefined,
          ),
        ),
      );
    }
    if (!state.mostCommented.onceFetched) {
      promises.push(
        store.dispatch(
          asyncFetchMostCommentedList(
            req ? { headers: req.getApiHeaders() } : undefined,
          ),
        ),
      );
    }
    if (!state.mostModified.onceFetched) {
      promises.push(
        store.dispatch(
          asyncFetchMostModifiedList(
            req ? { headers: req.getApiHeaders() } : undefined,
          ),
        ),
      );
    }
    if (!state.mostTrack.onceFetched) {
      promises.push(
        store.dispatch(
          asyncFetchMostTrackList(
            req ? { headers: req.getApiHeaders() } : undefined,
          ),
        ),
      );
    }

    await Promise.all(promises);

    const categories = get(store.getState(), [REDUCER_KEY, 'category', 'data']);
    const sections = get(store.getState(), [REDUCER_KEY, 'sections']);
    if (Object.keys(sections).length === 0) {
      const prefetch = categories.slice(0, 3);
      await Promise.all(
        prefetch.map((cat) =>
          store.dispatch(
            asyncFetchCategoryFeed(
              { categoryId: cat.id },
              req ? { headers: req.getApiHeaders() } : undefined,
            ),
          ),
        ),
      );
    }
  } catch (err) {
    logging.error(err);
  }

  return {};
};

export default DimzouIndex;

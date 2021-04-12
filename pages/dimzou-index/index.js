import Head from 'next/head';
import get from 'lodash/get';
// import request from '@/utils/request';
import getReducerInjectors from '@/utils/reducerInjectors';

import Layout, { Site, SiteContent } from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import Sidebar from '@/containers/Sidebar';

import Render from '@/routes/DimzouIndex';
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

function DimzouIndex() {
  return (
    <Site mode="fixed-header">
      <Header />
      <SiteContent>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Head>
                <title>Dimzou</title>
              </Head>
              <Render />
            </Layout.Main>
            <Footer />
          </Layout.Main>
          <Sidebar />
        </Layout>
      </SiteContent>
    </Site>
  );
}

DimzouIndex.getInitialProps = async ({ store, req }) => {
  if (typeof window === 'undefined') {
    const {
      REDUCER_KEY,
      default: reducer,
    } = await import('@/routes/DimzouIndex/reducer');

    getReducerInjectors(store).injectReducer(REDUCER_KEY, reducer);

    const promises = [];
    try {
      promises.push(store.dispatch(asyncFetchCategories()));
      promises.push(store.dispatch(asyncFetchMostReadList()));
      promises.push(store.dispatch(asyncFetchMostCommentedList()));
      promises.push(store.dispatch(asyncFetchMostModifiedList()));
      promises.push(store.dispatch(asyncFetchMostTrackList()));
      await Promise.all(promises);

      const categories = get(store.getState(), [
        REDUCER_KEY,
        'category',
        'data',
      ]);
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
  }

  return {};
};

export default DimzouIndex;

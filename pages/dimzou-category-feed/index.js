import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Layout, { Site, SiteContent } from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import SplashView from '@/components/SplashView';

const Dynamic = dynamic(
  () => import('@/routes/CategoryPage/DimzouCategoryPage'),
  {
    loading: () => <SplashView />,
  },
);

function CategoryFeed() {
  const router = useRouter();
  return (
    <Site mode="fixed-header">
      <Header />
      <SiteContent>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic categoryId={router.query.id} />
            </Layout.Main>
          </Layout.Main>
          <Footer />
        </Layout>
      </SiteContent>
    </Site>
  );
}

export default CategoryFeed;

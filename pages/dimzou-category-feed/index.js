import dynamic from 'next/dynamic';
import { useRouter } from 'next/router'


import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import Footer from '@/containers/Footer';
import SplashView from '@/components/SplashView';

const Dynamic = dynamic(() => import('@/routes/CategoryPage/DimzouCategoryPage'), {
  loading: () => <SplashView />,
});


function CategoryFeed() {
  const router = useRouter();
  return (
    <SiteLayout mode="fixed-header">
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic categoryId={router.query.id} />
            </Layout.Main>
          </Layout.Main>
          <Footer />
        </Layout>
      </Content>
    </SiteLayout>
  )
}
  
export default CategoryFeed
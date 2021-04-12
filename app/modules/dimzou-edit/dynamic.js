import dynamic from 'next/dynamic';
import SplashView from '@/components/SplashView';

const DynamicEdit = dynamic(
  () =>
    import(/* webpackChunkName: 'dimzou-edit' */ '@/modules/dimzou-edit').catch(
      (err) => {
        logging.debug(err.message);
      },
    ),
  {
    loading: () => <SplashView hint="Chunk loading..." />,
    ssr: false,
  },
);

export default DynamicEdit;

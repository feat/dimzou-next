import dynamic from 'next/dynamic';
export const BundleOutline = dynamic(() => import('./BundleOutline'), {
  ssr: false,
});
export const WorkOutline = dynamic(() => import('./WorkOutline'), {
  ssr: false,
});

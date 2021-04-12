import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { maxTextContent } from '@/utils/content';
import {
  selectContentState,
  selectPublicationMetaState,
} from '../../selectors';

function PublicationMeta(props) {
  const metaState = useSelector((state) =>
    selectPublicationMetaState(state, props),
  );
  const contentState = useSelector((state) =>
    selectContentState(state, {
      bundleId: props.bundleId,
      nodeId: props.nodeId || metaState?.data?.node_id,
    }),
  );
  const publication = contentState?.data?.publication;
  const router = useRouter();
  if (!publication) {
    return null;
  }
  const textTitle = maxTextContent(publication.title);

  return (
    <Head>
      <title>{textTitle}</title>
      <meta property="og:title" content={textTitle} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={router.asPath} />
    </Head>
  );
}

export default PublicationMeta;

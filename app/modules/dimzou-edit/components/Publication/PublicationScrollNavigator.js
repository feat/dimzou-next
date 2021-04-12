import { useContext, useCallback } from 'react';
import { useRouter } from 'next/router';

import {
  WorkshopContext,
  PublicationBundleContext,
  AppContext,
} from '../../context';
import ScrollNavigator from '../ScrollNavigator';
import { getAsPath } from '../../utils/router';

const getUpdateHref = (bundleId, nodeId, hash) => {
  const href = {
    pathname: '/dimzou-edit',
    query: {
      pageName: 'view',
      bundleId,
      nodeId,
    },
    hash,
  };
  return {
    href,
    as: getAsPath(href),
  };
};

function PublicationScrollNavigator(props) {
  const { data: bundleData } = useContext(PublicationBundleContext);
  const { bundleId, nodeId } = useContext(AppContext);
  const workshopContext = useContext(WorkshopContext);
  const bundles = workshopContext?.classified.created?.published;
  const router = useRouter();

  const onToPrev = useCallback(
    () => {
      // to previous node
      if (
        bundleData &&
        bundleData.is_multi_chapter &&
        // eslint-disable-next-line eqeqeq
        bundleData.nodes[0].id != nodeId
      ) {
        // eslint-disable-next-line eqeqeq
        const nodeIndex = bundleData.nodes.findIndex((n) => n.id == nodeId);
        if (nodeIndex === -1) {
          return;
        }
        const prevNode = bundleData.nodes[nodeIndex - 1];
        const newHref = getUpdateHref(bundleId, prevNode.id, '#tailing');
        router.push(newHref.href, newHref.as);
        return;
      }
      // to previous bundle
      const bundleIndex = bundles.findIndex((d) => d.id === bundleData.id);
      // check if previous bundle exist
      const hasPreviousBundle = bundles.length > 1 && bundleIndex > 0;
      if (hasPreviousBundle) {
        // get previous bundle infor
        const previousBundleIndex = bundleIndex - 1;
        const previousBundleId = bundles[previousBundleIndex].id;
        const nodeLength = bundles[previousBundleIndex].nodes
          ? bundles[previousBundleIndex].nodes.length
          : 0;
        const previousBundleNodeId = bundles[previousBundleIndex].nodes
          ? bundles[previousBundleIndex].nodes[nodeLength - 1].id
          : undefined;

        // update href
        const newHref = getUpdateHref(
          previousBundleId,
          previousBundleNodeId,
          '#tailing',
        );

        // to previous Bundle
        // scrollContext.setScrollToBottom(true);
        router.push(newHref.href, newHref.as);
      }
    },
    [bundles, bundleId, nodeId],
  );

  const onToNext = useCallback(
    () => {
      if (
        bundleData.is_multi_chapter &&
        // eslint-disable-next-line eqeqeq
        bundleData.nodes[bundleData.nodes.length - 1].id != nodeId
      ) {
        // to next node
        // eslint-disable-next-line eqeqeq
        const nodeIndex = bundleData.nodes.findIndex((n) => n.id == nodeId);
        if (nodeIndex === -1) {
          return;
        }
        const nextNode = bundleData.nodes[nodeIndex + 1];
        const newHref = getUpdateHref(bundleId, nextNode.id);
        window.scrollTo(0, 0);
        router.push(newHref.href, newHref.as);
        return;
      }

      const bundleIndex = bundles.findIndex((d) => d.id === bundleData.id);
      // check if next bundle exist
      const hasNextBundle =
        bundles.length > 1 && bundleIndex < bundles.length - 1;
      if (hasNextBundle) {
        // get next bundle infor
        const nextBundleId = bundles[bundleIndex + 1].id;
        const nextBundleNodeId = bundles[bundleIndex + 1].nodes
          ? bundles[bundleIndex + 1].nodes[0].id
          : undefined;

        // update href
        const newHref = getUpdateHref(nextBundleId, nextBundleNodeId);

        // to next Bundle
        window.scrollTo(0, 0);
        router.push(newHref.href, newHref.as);
      }
    },
    [bundles, bundleId, nodeId],
  );

  return (
    <ScrollNavigator
      onToPrev={onToPrev}
      onToNext={onToNext}
      excepts={['.dz-App__sidebarFirst']}
    >
      {props.children}
    </ScrollNavigator>
  );
}

export default PublicationScrollNavigator;

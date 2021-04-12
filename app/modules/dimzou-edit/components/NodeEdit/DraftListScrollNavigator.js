/**
 * 处理滚动加载上一章节，或者滚动加载下一章节的问题
 */

import { useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import ScrollNavigator from '../ScrollNavigator';

import {
  BundleContext,
  WorkspaceContext,
  // ScrollContext,
  WorkshopContext,
} from '../../context';
import { getAsPath } from '../../utils/router';

const getUpdateHref = (bundleId, nodeId, hash) => {
  const href = {
    pathname: '/dimzou-edit',
    query: {
      pageName: 'draft',
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

// TODO: update navigator data tree.
function DraftListScrollNavigator(props) {
  const { data: bundleData } = useContext(BundleContext);
  const { bundleId, nodeId, isEditingCover } = useContext(WorkspaceContext);
  const workshopContext = useContext(WorkshopContext);
  // const scrollContext = useContext(ScrollContext);
  const router = useRouter();

  const { classified } = workshopContext;
  const drafts = get(classified, 'created.draft');

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
      if (!drafts) {
        return;
      }
      // to previous bundle
      const bundleIndex = drafts.findIndex((d) => d.id === bundleData.id);
      // check if previous bundle exist
      const hasPreviousBundle = drafts.length > 1 && bundleIndex > 0;
      if (hasPreviousBundle) {
        // get previous bundle infor
        const previousBundleIndex = bundleIndex - 1;
        const previousBundleId = drafts[previousBundleIndex].id;
        const nodeLength = drafts[previousBundleIndex].nodes
          ? drafts[previousBundleIndex].nodes.length
          : 0;
        const previousBundleNodeId = drafts[previousBundleIndex].nodes
          ? drafts[previousBundleIndex].nodes[nodeLength - 1].id
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
    [drafts, bundleId, nodeId],
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
      if (!drafts) {
        return;
      }
      const bundleIndex = drafts.findIndex((d) => d.id === bundleData.id);
      // check if next bundle exist
      const hasNextBundle =
        drafts.length > 1 && bundleIndex < drafts.length - 1;
      if (hasNextBundle) {
        // get next bundle infor
        const nextBundleId = drafts[bundleIndex + 1].id;
        const nextBundleNodeId = drafts[bundleIndex + 1].nodes
          ? drafts[bundleIndex + 1].nodes[0].id
          : undefined;

        // update href
        const newHref = getUpdateHref(nextBundleId, nextBundleNodeId);

        // to next Bundle
        window.scrollTo(0, 0);
        router.push(newHref.href, newHref.as);
      }
    },
    [drafts, bundleId, nodeId],
  );

  return (
    <ScrollNavigator
      disabled={isEditingCover}
      onToPrev={onToPrev}
      onToNext={onToNext}
      excepts={['.dz-App__sidebarFirst']}
    >
      {props.children}
    </ScrollNavigator>
  );
}

export default DraftListScrollNavigator;

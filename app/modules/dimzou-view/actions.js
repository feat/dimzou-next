/*
 *
 * ViewUserWorks actions
 *
 */

import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import { dimzouPublication as publicationSchema } from '@/schema';

import { fetchPublication as fetchPublicationRequest } from './requests';

const NS = 'DZ_VIEW';

export const fetchBundlePublicationMeta = createRoutine(
  `${NS}/FETCH_BUNDLE_PUB_META`,
);

/**
 * 出版物阅读初始化
 * @param {} payload
 */
export const asyncFetchBundlePublicationMeta = (payload) => async (
  dispatch,
) => {
  dispatch(fetchBundlePublicationMeta.trigger(payload));

  const { bundleId } = payload;
  try {
    dispatch(fetchBundlePublicationMeta.request(payload));
    const { data } = await fetchPublicationRequest({
      bundle: bundleId,
      related: true,
    });
    const info = {
      pub_type: data.pub_type,
      title: data.title,
      nodes: data.nodes,
      author: data.author,
      category: data.category,
      created_at: data.created_at,
      updated_at: data.updated_at,
      language: data.language,
      bundle_is_multi_chapter: data.bundle_is_multi_chapter,
      bundle_id: data.bundle_id,
      template: data.template,
      related: data.related,
      node_id: data.node_id,
    };

    // if (data.pub_type === PUB_TYPE_WORK || !data.is_binding_publish) {
    //   info.type = DETAIL_VIEW_TYPE_WORK;
    //   info.nodes = data.nodes;
    // } else {
    //   info.type = DETAIL_VIEW_TYPE_BOOK;
    //   info.nodes = data.nodes;
    //   info.nodeId = data.node_id;
    //   info.publicationId = data.id;
    // }

    dispatch(
      fetchBundlePublicationMeta.success({
        bundleId,
        data: info,
      }),
    );
    return info;
  } catch (err) {
    dispatch(
      fetchBundlePublicationMeta.failure({
        bundleId,
        data: err,
      }),
    );
    return undefined;
  } finally {
    dispatch(
      fetchBundlePublicationMeta.fulfill({
        bundleId,
      }),
    );
  }
};

export const fetchNodePublication = createRoutine(
  `${NS}/FETCH_NODE_PUBLICATION`,
);

export const asyncFetchNodePublication = (payload) => async (dispatch) => {
  const { bundleId, nodeId } = payload;
  dispatch(fetchNodePublication.trigger(payload));
  try {
    dispatch(fetchNodePublication.request(payload));
    const { data: publication } = await fetchPublicationRequest({
      bundle: bundleId,
      node: nodeId,
    });
    const normalized = normalize(publication, publicationSchema);
    dispatch(
      fetchNodePublication.success({
        nodeId,
        data: {
          publication: normalized.result,
        },
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchNodePublication.failure({
        nodeId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchNodePublication.fulfill(payload));
  }
};

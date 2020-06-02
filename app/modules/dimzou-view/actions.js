/*
 *
 * ViewUserWorks actions
 *
 */

import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import { 
  dimzouBundle as dimzouBundleSchema,
  dimzouPublication as publicationSchema,
} from '@/schema';

import configTemplates from '@/components/FeedTemplate/configTemplates';
import { selectUserListState } from './selectors';
import { 
  fetchUserDimzous as fetchUserDimzousRequest,
  fetchPublication as fetchPublicationRequest,
} from './requests';

import { DETAIL_VIEW_TYPE_WORK, DETAIL_VIEW_TYPE_BOOK, PUB_TYPE_WORK } from './constants';

const NS = 'DZ_VIEW';

export const fetchUserDimzous = createRoutine(`${NS}/FETCH_USER_WORKS`);

export const asyncFetchUserDimzous = (payload) => async (dispatch, getState) => {
  const { userId } = payload
  dispatch(fetchUserDimzous.trigger(payload))
  const pageState = selectUserListState(getState(), { userId })
  if (pageState.loading) {
    return
  }
  try {
    dispatch(fetchUserDimzous.request(payload))
    const params = pageState.next || { page_size: 10 }
    const { data, pagination } = await fetchUserDimzousRequest(
      userId,
      params,
    );
    const templates = configTemplates(
      pageState.templates,
      data.length,
      pagination.total_count,
    );
    const normalized = normalize(data, [dimzouBundleSchema]);

    dispatch(
      fetchUserDimzous.success({
        userId,
        list: normalized.result,
        next: pagination.next
          ? {
            page: pagination.next,
            page_size: pagination.page_size,
          }
          : null,
        templates,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchUserDimzous.failure({
        userId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(
      fetchUserDimzous.fulfill({
        userId,
      }),
    );
  }
}

export const initDimzouView = createRoutine(`${NS}/INIT_DIMZOU_VIEW`);
export const asyncInitDimzouView = (payload, meta = {}) => async (dispatch) => {
  dispatch(initDimzouView.request(payload));
  const { bundleId, nodeId } = payload;
  try {
    const { data: publication } = await fetchPublicationRequest(
      {
        bundle: bundleId,
        node: nodeId,
        related: true, // fetch related info
      },
      meta.headers,
    );
    const info = {};
    if (publication.pub_type === PUB_TYPE_WORK || !publication.is_binding_publish) {
      info.type = DETAIL_VIEW_TYPE_WORK;
      info.nodes = publication.nodes;
      info.publicationId = publication.id;
      info.nodeId = publication.node_id;
    } else {
      info.type = DETAIL_VIEW_TYPE_BOOK;
      info.nodes = publication.nodes;
      info.nodeId = publication.node_id;
      info.publicationId = publication.id;
    }
    const normalized = normalize(publication, publicationSchema);
    dispatch(
      initDimzouView.success({
        bundleId,
        data: info,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(initDimzouView.failure({
      bundleId,
      data: err,
    }))
  } finally {
    dispatch(initDimzouView.fulfill({
      bundleId,
    }))
  }
}


export const fetchNodePublication = createRoutine(`${NS}/FETCH_NODE_PUBLICATION`);

export const asyncFetchNodePublication = (payload) => async (dispatch) => {
  const { bundleId, data } = payload;
  try {
    const { data: publication } = await fetchPublicationRequest({
      bundle: bundleId,
      node: data.nodeId,
    });
    const normalized = normalize(publication, publicationSchema);
    dispatch(
      fetchNodePublication.success({
        bundleId,
        data: {
          publicationId: normalized.result,
          nodeId: data.nodeId,
        },
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchNodePublication.failure({
        bundleId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchNodePublication.fulfill(payload));
  }
};
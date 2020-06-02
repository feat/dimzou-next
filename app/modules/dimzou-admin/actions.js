import { createRoutine } from 'redux-saga-routines'
import { normalize } from 'normalizr'
import { dimzouBundle as dimzouBundleSchema } from '@/schema'
import {
  fetchDimzouList as fetchDimzouListRequest,
} from './requests'

const NS = 'DIMZOU_ADMIN';

export const fetchDimzouList = createRoutine(`${NS}/FETCH_DIMZOU_LIST`);

export const asyncFetchDimzouList = (payload) => async (dispatch) => {
  dispatch(fetchDimzouList.trigger(payload))
  try {
    dispatch(fetchDimzouList.request(payload))
    const { data, pagination } = await fetchDimzouListRequest(payload);
    const normalized = normalize(data, [dimzouBundleSchema])
    dispatch(fetchDimzouList.success({
      params: payload,
      data: normalized.result,
      pagination:  {
        next: pagination.next ?{
          page_size: pagination.page_size,
          page: pagination.next,
        } : null,
        total: pagination.total_count,
      },
      entities: normalized.entities,
    }))
  } catch (err) {
    logging.debug(err);
    dispatch(fetchDimzouList.failure({
      params: payload,
      data: err,
    }))
  } finally {
    dispatch(fetchDimzouList.fulfill(payload))
  }
}
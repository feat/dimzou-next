import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import { provider } from '@/components/FeedRender/helpers';

import { dimzouBundle as dimzouBundleSchema } from '../dimzou-edit/schema';

import { fetchUserDimzous as fetchUserDimzousRequest } from './requests';
import { selectListState } from './selectors';

export const fetchUserDimzous = createRoutine('DZ/USER_WORK_LIST');
export const asyncFetchUserDimzous = (payload) => async (
  dispatch,
  getState,
) => {
  const { userId } = payload;
  dispatch(fetchUserDimzous.trigger(payload));
  const listState = selectListState(getState(), { userId });
  if (listState.loading) {
    return;
  }
  try {
    dispatch(fetchUserDimzous.request(payload));
    const params = listState.next || { page_size: 10 };
    const { data, pagination } = await fetchUserDimzousRequest(userId, params);
    const templates = provider.getTemplates(data.length, listState.templates);
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
};

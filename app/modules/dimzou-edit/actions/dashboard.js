import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

export const setResourceStatsQuery = createAction(
  `DZ/DASH/RESOURCE_STATS/SET_QUERY`,
);

export const fetchResourceStats = createRoutine(`DZ/DASH/RESOURCE_STATS/FETCH`);

const fakeContent = (page = 1, pageCount = 8) => {
  const initId = (page - 1) * 8 + 1;
  const output = [];
  for (let i = 0; i < pageCount; i += 1) {
    output.push({
      id: initId + i,
      title: `演示数据 ${initId + i}`,
      viewCount: Math.floor(Math.random() * 393233),
      commentCount: Math.floor(Math.random() * 393233),
      likeCount: Math.floor(Math.random() * 393233),
      rewardCount: Math.floor(Math.random() * 393233),
    });
  }
  return output;
};

export const asyncFetchResourceStats = (payload) => async (dispatch) => {
  dispatch(fetchResourceStats.trigger(payload));
  const { query = {} } = payload;
  try {
    dispatch(fetchResourceStats.request(payload));
    // const res = await fetchResourceStatsRequest(payload.query);
    const res = {
      data: fakeContent(query.page),
      pagination: {
        current: query.page || 1,
        pageSize: 8,
        total: 120,
        showQuickJumper: true,
      },
    };
    dispatch(
      fetchResourceStats.success({
        query: payload.query,
        ...res,
      }),
    );
  } catch (err) {
    dispatch(
      fetchResourceStats.failure({
        query: payload.query,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchResourceStats.fulfill(payload));
  }
};

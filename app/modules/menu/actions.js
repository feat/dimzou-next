import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

import { fetchMenu as fetchMenuRequest } from '@/client/menu';
const NS = 'MENU';

export const resetMenuData = createAction(`${NS}/RESET_MENU_DATA`);

export const fetchMenu = createRoutine(`${NS}/FETCH_MENU`);

export const asyncFetchMenu = (payload) => async (dispatch) => {
  dispatch(fetchMenu.request(payload))
  try {
    const { data } = await fetchMenuRequest(payload.name);
    dispatch(fetchMenu.success({
      name: payload.name,
      items: data.items,
    }))
  } catch (err) {
    dispatch(fetchMenu.failure({
      name: payload.name,
      data: err,
    }))
  } finally {
    dispatch(fetchMenu.fulfill({
      name: payload.name,
    }))
  }
}
import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

const NS = 'LIKE';

export const createLike = createRoutine(`${NS}/CREATE_LIKE`);
export const deleteLike = createRoutine(`${NS}/DELETE_LIKE`);
export const fetchLikes = createRoutine(`${NS}/FETCH_LIKES`);
export const likeSignal = createAction(`${NS}/LIKE_SIGNAL`);

export const initWidget = createAction(`${NS}/INIT_WIDGET`);
export const initWidgetSuccess = createAction(`${NS}/INIT_WIDGET_SUCCESS`);
export const initWidgetFailure = createAction(`${NS}/INIT_WIDGET_FAILURE`);

import { createAction } from 'redux-actions';

export const workshopNavPin = createAction('DZ/WORKSHOP/PIN');
export const workshopNavUnpin = createAction('DZ/WORKSHOP/UNPIN');
export const workshopNavForward = createAction('DZ/WORKSHOP/FORWARD');
export const workshopNavBackward = createAction('DZ/WORKSHOP/BACKWARD');
export const workshopNavPush = createAction('DZ/WORKSHOP/PUSH');
export const workshopNavInit = createAction('DZ/WORKSHOP/INIT');
export const workshopNavReset = createAction('DZ/WORKSHOP/RESET');

export const workshopUpdateFilter = createAction('DZ/WORKSHOP/UPDATE_FILTER');

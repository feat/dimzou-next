// import { createAction } from 'redux-actions';
import { createRoutine, promisifyRoutine } from 'redux-saga-routines';

export const login = createRoutine('auth/LOGIN');
export const loginPromiseCreator = promisifyRoutine(login);

export const loginWithPhone = createRoutine('auth/LOGIN_WITH_PHONE');
export const loginWithPhonePromiseCreator = promisifyRoutine(loginWithPhone);

export const registerWithPhone = createRoutine('auth/REGISTER_WITH_PHONE');
export const registerWithPhonePromiseCreator = promisifyRoutine(
  registerWithPhone,
);

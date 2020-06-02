/*
 *
 * Choices actions
 *
 */

import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';

import {
  fetchCountryCallingCodes as fetchCountryCallingCodesRequest,
  getCurrencyOptions as getCurrencyOptionsRequest,
} from '@/client/choices';

const NS = 'CHOICES';

export const fetchChoices = createAction('CHOICES/FETCH_CHOICES');

export const fetchCountries = createRoutine('CHOICES/FETCH_COUNTRIES');

export const fetchCountryCallingCodes = createRoutine(
  `${NS}/FETCH_CALLING_CODE`,
);

export const fetchCurrencyOptions = createRoutine('CHOICES/FETCH_CURRENCY');

export const asyncFetchCountryCallingCodes = () => async (dispatch) => {
  dispatch(fetchCountryCallingCodes());
  try {
    const { data, meta } = await fetchCountryCallingCodesRequest();
    const sorted = data.sort((a, b) => a.label > b.label ? 1 : -1);
    dispatch(
      fetchCountryCallingCodes.success({
        data: sorted,
        meta,
      }),
    );
  } catch (err) {
    dispatch(fetchCountryCallingCodes.failure(err))
  } finally {
    dispatch(fetchCountryCallingCodes.fulfill());
  }
};

export const asyncFetchCurrencyOptions = () => async (dispatch) => {
  dispatch(fetchCountryCallingCodes());
  try {
    const { data } = await getCurrencyOptionsRequest();
    dispatch(fetchCurrencyOptions.success(data));
  } catch (err) {
    dispatch(fetchCurrencyOptions.failure(err));
    throw err;
  } finally {
    dispatch(fetchCurrencyOptions.fulfill());
  }
}

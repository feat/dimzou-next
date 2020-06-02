/*
 *
 * Choices reducer
 *
 */

import { handleActions } from 'redux-actions';
import {
  fetchCountries,
  fetchCountryCallingCodes,
  fetchCurrencyOptions,
} from './actions';

export const initialState = {
  countries: null,
  callingCodes: null,
  isFetchingCountries: false,
  isFetchingCallingCodes: false,
};

const choicesReducer = handleActions(
  {
    [fetchCountries.REQUEST]: (state) => ({
      ...state,
      isFetchingCountries: true,
    }),
    [fetchCountries.SUCCESS]: (state, action) => ({
      ...state,
      countries: action.payload,
      countriesFetched: true,
    }),
    [fetchCountries.FULFILL]: (state) => ({
      ...state,
      isFetchingCountries: false,
    }),
    [fetchCountryCallingCodes.REQUEST]: (state) => ({
      ...state,
      isFetchingCallingCodes: true,
    }),
    [fetchCountryCallingCodes.SUCCESS]: (state, action) => ({
      ...state,
      callingCodes: action.payload,
      callingCodesFetched: true,
    }),
    [fetchCountryCallingCodes.FULFILL]: (state) => ({
      ...state,
      isFetchingCallingCodes: false,
    }),
    [fetchCurrencyOptions.REQUEST]: (state) => ({
      ...state,
      isFetchingCurrencyOptions: true,
    }),
    [fetchCurrencyOptions.SUCCESS]: (state, action) => ({
      ...state,
      currencyOptions: action.payload,
      currencyOptionsFetched: true,
    }),
    [fetchCurrencyOptions.FULFILL]: (state) => ({
      ...state,
      isFetchingCurrencyOptions: false,
    }),
  },
  initialState,
);

export default choicesReducer;

export const REDUCER_KEY = 'choices';

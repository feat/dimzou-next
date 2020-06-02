import { initialState, REDUCER_KEY } from './reducer';

/**
 * Direct selector to the choices state domain
 */

export const selectChoicesDomain = (state) =>
  state[REDUCER_KEY] || initialState;

export const selectCountries = () => undefined;

export const selectCountryCallingCodes = (state) => {
  const subState = selectChoicesDomain(state);
  return subState.callingCodes;
};

export const selectCurrencyOptions = (state) => {
  const subState = selectChoicesDomain(state);
  return subState.currencyOptions;
};

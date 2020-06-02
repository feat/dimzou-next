import {
  fetchCountries,
  fetchCountryCallingCodes,
  fetchCurrencyOptions,
} from '../actions';
import reducer from '../reducer';

describe('choices', () => {
  let state;
  describe('countries', () => {
    // it('trigger', () => {});
    it('request', () => {
      const action = fetchCountries.request();
      state = reducer(state, action);
      expect(state.isFetchingCountries).toBe(true);
    });
    it('success', () => {
      const data = [{ id: 1 }];
      const action = fetchCountries.success(data);
      state = reducer(state, action);
      expect(state.countriesFetched).toBe(true);
      expect(state.countries).toBe(data);
    });
    // it('failure', () => {});
    it('fulfill', () => {
      const action = fetchCountries.fulfill();
      state = reducer(state, action);
      expect(state.isFetchingCountries).toBe(false);
    });
  });
  describe('calling code', () => {
    // it('trigger', () => {});
    it('request', () => {
      const action = fetchCountryCallingCodes.request();
      state = reducer(state, action);
      expect(state.isFetchingCallingCodes).toBe(true);
    });
    it('success', () => {
      const data = [{ id: 1 }];
      const action = fetchCountryCallingCodes.success(data);
      state = reducer(state, action);
      expect(state.callingCodesFetched).toBe(true);
      expect(state.callingCodes).toBe(data);
    });
    // it('failure', () => {});
    it('fulfill', () => {
      const action = fetchCountryCallingCodes.fulfill();
      state = reducer(state, action);
      expect(state.isFetchingCallingCodes).toBe(false);
    });
  });
  describe('currency', () => {
    // it('trigger', () => {});
    it('request', () => {
      const action = fetchCurrencyOptions.request();
      state = reducer(state, action);
      expect(state.isFetchingCurrencyOptions).toBe(true);
    });
    it('success', () => {
      const data = [{ id: 1 }];
      const action = fetchCurrencyOptions.success(data);
      state = reducer(state, action);
      expect(state.currencyOptionsFetched).toBe(true);
      expect(state.currencyOptions).toBe(data);
    });
    // it('failure', () => {});
    it('fulfill', () => {
      const action = fetchCurrencyOptions.fulfill();
      state = reducer(state, action);
      expect(state.isFetchingCurrencyOptions).toBe(false);
    });
  });
});

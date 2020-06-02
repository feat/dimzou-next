import request from '@/utils/request';

export const getChoices = () =>
  request({
    url: '/api/choices/',
  });

/**
 *
 * @param {name: string, country_code: string} params
 */
export const getCountryOptions = (params) =>
  request({
    url: `/api/choices/country/`,
    method: 'GET',
    params,
  });

/**
 *
 * @param {name: string, iso_code: string} params
 */
export const getCurrencyOptions = (params) =>
  request({
    url: `/api/choices/currency/`,
    method: 'GET',
    params,
  });

export const fetchCountryCallingCodes = () =>
  request({
    url: '/api/choices/phone-country-code/',
  });

/**
 *
 * @param {name: string, utc_offset: string} params
 */
export const getTimezoneOptions = (params) =>
  request({
    url: '/api/choices/timezone/',
    method: 'GET',
    params,
  });

import request from '@/utils/request';

export const fetchLocales = () =>
  request({
    url: '/api/language-locale/',
  });

export const createLocale = (data) =>
  request({
    url: '/api/locale',
    method: 'POST',
    data,
  });

export const fetchLanguages = () =>
  request({
    url: '/api/languages',
  });

export const fetchPublicTranslations = (params) =>
  request({
    url: '/api/ui-translation/public/',
    method: 'GET',
    params,
  });

export const fetchCustomTranslations = (params) =>
  request({
    url: '/api/ui-translation/custom/',
    method: 'GET',
    params,
  });

export const submitTranslation = (data) =>
  request({
    url: '/api/ui-translation/',
    method: 'POST',
    data,
  });

export const deleteTranslation = (data) =>
  request({
    url: '/api/ui-translation/del-custom-translation/',
    params: {
      msg_id: data.msgId,
      locale: data.locale,
    },
    method: 'POST',
  });

export const setUserLocale = (data) =>
  request({
    url: '/api/language-locale/set-language/',
    method: 'POST',
    data,
  });

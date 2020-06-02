import request from '@/utils/request';

export const createAdvertiser = ({ data }) =>
  request({
    url: '/api/v1/ad/create',
    method: 'POST',
    data,
  });

export const fetchAdvertiser = () =>
  request({
    url: '/api/v1/ad/get_ads_card',
    method: 'GET',
  });

export const fetchAdCondition = ({ data }) =>
  request({
    url: '/api/v1/ad/conditions',
    method: 'GET',
    params: data,
  });

export const uploadAdPic = ({ data }) =>
  request({
    url: '/api/v1/ad/upload',
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data,
  });

export const showAdvertiser = ({ data }) =>
  request({
    url: '/api/v1/ad/show_ads',
    method: 'GET',
    params: data,
  });

export const deleteAdvertiser = ({ id }) =>
  request({
    url: `/api/v1/ad/${id}`,
    method: 'DELETE',
  });

export const fetchUnitPrices = (params) =>
  request({
    url: '/api/v1/ad/prices',
    method: 'GET',
    params,
  });

export const getAdAuth = (data) =>
  request({
    url: `/api/admin/v1/auth/get-ad-auth`,
    method: 'POST',
    data,
  });

export const createUnitPrice = ({ data }) =>
  request({
    url: '/api/admin/v1/ad/create_price',
    method: 'POST',
    data,
  });

export const changePrice = ({ id, data }) =>
  request({
    url: `/api/admin/v1/ad/price/${id}`,
    method: 'POST',
    data,
  });

export const adHandleClick = ({ id }) =>
  request({
    url: `/api/v1/ad/click?adid=${id}`,
    method: 'GET',
  });

export const adHitCounts = ({ id }) =>
  request({
    url: `/api/v1/ad/hits?adid=${id}`,
    method: 'GET',
  });

export const adRecords = ({ aid, page }) =>
  request({
    url: `/api/v1/ad/records?adid=${aid}&page=${page}`,
    method: 'GET',
  });

export const wtzSendConsumeCode = (data, aid) =>
  request({
    // url: '/api/payment/unpay/send_vcode/',
    url: `/api/v1/ad/payment/send_vcode/${aid}`,
    method: 'POST',
    data,
  });

export const wtzOpenQuery = (data) =>
  request({
    // url: '/api/payment/unpay/open_query/',
    url: '/api/v1/ad/payment/open_query',
    method: 'POST',
    data,
  });

export const wtzGetOpenTemplate = (data) =>
  request({
    url: `/api/payment/unpay/open_card_front/`,
    method: 'POST',
    data,
  });

export const adPaySuccess = (data) =>
  request({
    url: '/api/v1/ad/pay-success',
    method: 'POST',
    data,
  });

export const adTradePay = (data, aid) =>
  request({
    // url: '/api/payment/trade/pay/',
    url: `/api/v1/ad/payment/pay/${aid}`,
    method: 'POST',
    data,
  });

export const pollTradeInfo = (data) =>
  request({
    url: '/api/payment/trade/',
    method: 'GET',
    params: data,
  });

export const adTradeRefund = (id) =>
  request({
    url: `/api/v1/ad/refund/${id}`,
    method: 'POST',
  });

export const adStateUpdate = ({ aid, action }) =>
  request({
    url: `/api/v1/ad/${aid}/update`,
    method: 'POST',
    data: { action },
  });

export const adShowSuccess = (data) =>
  request({
    url: '/api/v1/ad/show_success',
    method: 'POST',
    data,
  });

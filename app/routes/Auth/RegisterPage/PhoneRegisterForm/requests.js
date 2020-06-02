import request from '@/utils/request';

export const verifyCode = ({ country_code, phone, vcode, form_id }) =>
  request({
    url: '/api/auth/phone/verification/',
    method: 'post',
    data: {
      country_code,
      phone,
      vcode,
      form_id,
    },
  });

export const getVerificationCode = ({
  country_code,
  phone,
  form_id,
  invitation_code,
}) =>
  // const [country_code, local_phone] = phone.replace('+', '').split('-');
  request({
    url: '/api/auth/phone/code/',
    method: 'post',
    data: {
      country_code,
      phone,
      form_id,
      invitation_code,
    },
  });

export const register = ({
  phone,
  password,
  form_id,
  token,
  vcode,
  country_code,
  security_key,
  security_value,
}) =>
  request({
    url: '/api/auth/phone/register/',
    method: 'post',
    data: {
      phone,
      password,
      form_id,
      token,
      vcode,
      country_code,
      security_key,
      security_value,
    },
  });

import request from '@/utils/request';

export const getCurrentUserInfo = () =>
  request({
    url: '/api/user/basic-info/',
  });

export const getUserInfo = (params, headers) =>
  request({
    url: '/api/user/user-info/',
    method: 'GET',
    params,
    headers,
  });
export const getProfile = () =>
  request({
    url: '/api/user/profile/',
  });
export const updateProfile = (id, data) =>
  request({
    url: `/api/user/profile/${id}/`,
    method: 'PATCH',
    data,
  });
export const getEducations = () =>
  request({
    url: '/api/user/education/',
  });

export const addEducation = (data) => {
  const endpoint = `/api/user/education/`;
  if (data.pic) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return request({
      url: endpoint,
      method: 'POST',
      headers: { 'Content-Type': false },
      data: formData,
    });
  }
  return request({
    url: endpoint,
    method: 'POST',
    data,
  });
};

export const updateEducation = (id, data) =>
  request({
    url: `/api/user/education/${id}/`,
    method: 'PUT',
    data,
  });

export const deleteEducation = (id) =>
  request({
    url: `/api/user/education/${id}/`,
    method: 'DELETE',
  });

export const getCareers = () =>
  request({
    url: `/api/user/career/`,
  });

export const addCareer = (data) => {
  const endpoint = `/api/user/career/`;
  if (data.pic) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return request({
      url: endpoint,
      method: 'POST',
      headers: { 'Content-Type': false },
      data: formData,
    });
  }
  return request({
    url: endpoint,
    method: 'POST',
    data,
  });
};

export const updateCareer = (id, data) =>
  request({
    url: `/api/user/career/${id}/`,
    method: 'PUT',
    data,
  });

export const deleteCareer = (id) =>
  request({
    url: `/api/user/career/${id}/`,
    method: 'DELETE',
  });
  
export const getHonors = () => request({
  url: '/api/user/honors-awards/',
});

export const addHonor = (data) =>
  request({
    url: `/api/user/honors-awards/`,
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data,
  });

export const deleteHonor = (id) =>
  request({
    url: `/api/user/honors-awards/${id}/`,
    method: 'DELETE',
  });

export const getOpenTimes = () =>
  request({
    url: `/api/user/opentime/`,
  });

export const updateUserOpenTime = (userId, data) =>
  request({
    url: `/api/user/opentime/${userId}/`,
    method: 'PUT',
    data,
  });

export const getExpertises = () =>
  request({
    url: '/api/user/expertise/',
  });

export const addExpertise = (data) =>
  request({
    url: '/api/user/expertise/',
    method: 'POST',
    data,
  });

export const updateExpertise = (id, data) =>
  request({
    url: `/api/user/expertise/${id}/`,
    method: 'PUT',
    data,
  });

export const patchExpertise = (id, data) =>
  request({
    url: `/api/user/expertise/${id}/`,
    method: 'PATCH',
    data,
  });

export const deleteExpertise = (id) =>
  request({
    url: `/api/user/expertise/${id}/`,
    method: 'DELETE',
  });

export const getWorkplace = () =>
  request({
    url: '/api/geo/user-address/',
    method: 'GET',
    params: { address_type: 100 },
  }).then(({ data }) => data[0]);

/** TODO: check if address_type is required */
let workplaceLatLngPromise;

export const updateWorkplace = (data) =>
  request({
    url: `/api/geo/user-workplace/`,
    method: 'POST',
    data,
  }).then((res) => {
    workplaceLatLngPromise = undefined;
    return res;
  });

export const getUserWorkplaceLatLng = () => {
  if (!workplaceLatLngPromise) {
    workplaceLatLngPromise = getWorkplace();
  }
  return workplaceLatLngPromise;
};

export const getLanguages = () =>
  request({
    url: `/api/user/user-language/`,
  });

/**
 *
 * @param { language: string, level: string } data
 */
export const addLanguage = (data) =>
  request({
    url: '/api/user/user-language/',
    method: 'POST',
    data,
  });

export const deleteLanguage = (id) =>
  request({
    url: `/api/user/user-language/${id}/`,
    method: 'DELETE',
  });

export const getTrustWorthyContacts = () =>
  request({
    url: '/api/user/trust-worthy-contact/',
  });

export const addTrustWorthyContact = (data) =>
  request({
    url: '/api/user/trust-worthy-contact/',
    method: 'POST',
    data,
  });

export const deleteTrustWorthyContact = (id) =>
  request({
    url: `/api/user/trust-worthy-contact/${id}/`,
    method: 'DELETE',
  });

export const getBlackList = () =>
  request({
    url: '/api/party/contact-list/black_list/',
  });

/**
 *
 * @param {balck_user: string} data
 */
export const addBlackUser = (data) =>
  request({
    url: '/api/user/black-list/',
    method: 'POST',
    data,
  });

export const deleteBlackUser = (id) =>
  request({
    url: `/api/user/black-list/${id}`,
    method: 'DELETE',
  });

export const getEmails = () =>
  request({
    url: '/api/user/email/',
  });

/**
 *
 * @param {email: string} data
 */
export const addEmail = (data) =>
  request({
    url: '/api/user/email/',
    method: 'POST',
    data,
  });

export const deleteEmail = (id) =>
  request({
    url: `/api/user/email/${id}/`,
    method: 'DELETE',
  });

export const getMobiles = () =>
  request({
    url: '/api/user/mobile/',
  });

/**
 *
 * @param {mobile: string, vcode: number, add_to_main: bool, country_code: string} data
 */
export const addMobile = (data) =>
  request({
    url: '/api/user/mobile/',
    method: 'POST',
    data,
  });

export const deleteMobile = (id) =>
  request({
    url: `/api/user/email/${id}/`,
    method: 'DELETE',
  });

export const getMessageSetting = () =>
  request({
    url: `/api/user/message/`,
  });

/**
 *
 * @param {receive_account_activity: bool, receiving_method: string, receive_security_risks: bool} data
 */
export const updateMessageSetting = (data) =>
  request({
    url: '/api/user/message/',
    method: 'PUT',
    data,
  });

export const getPrivacySetting = () =>
  request({
    url: `/api/user/privacy/`,
  });

export const updatePrivacySettings = (data) =>
  request({
    url: '/api/user/privacy/',
    method: 'PUT',
    data,
  });

export const updatePaymentSetting = (data) =>
  request({
    url: '/api/user/payment/',
    method: 'PUT',
    data,
  });

export const getSocialRelationSetting = () =>
  request({
    url: '/api/user/social-relation/',
  });

export const updateSocialRelationSetting = (data) =>
  request({
    url: '/api/user/social-relation/',
    method: 'PUT',
    data,
  });

export const getSocialRelationAllowedFriends = () =>
  request({
    url: '/api/user/social-relation/get_allow_friends/',
  });

/**
 *
 * @param {Object} data
 * @param {String} data.user
 */
export const addSocialRelationAllowedFriend = (data) =>
  request({
    url: '/api/user/social-relation/add_friend/',
    method: 'POST',
    data,
  });

/**
 *
 * @param {Object} data
 * @param {String} data.user
 */
export const removeSocialRelationAllowedFriend = (data) =>
  request({
    url: `/api/user/social-relation/remove_friend/`,
    method: 'POST',
    data,
  });

export const postAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request({
    url: '/api/user/profile/avatar/',
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const postOriginAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request({
    url: '/api/user/profile/orig_avatar/',
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const getUserInfoByUserId = (id, params) =>
  request({
    url: `/api/user/user-info/${id}/`,
    method: 'GET',
    params,
  });

export const getApplicationAvailableInfo = (userId) => 
  request({
    url: `/api/user/user-application-available/`,
    params: { uid: userId },
  })

export const getProfileByUserId = (id) =>
  request({ url: `/api/user/profile/${id}/` });

export const getEducationsByUserId = (id) =>
  request({ url: `/api/user/education/${id}` });

export const getCareersByUserId = (id) =>
  request({ url: `/api/user/career/${id}` });

export const getLoginRecord = (params) =>
  request({
    url: '/api/user/login-record/',
    method: 'GET',
    params,
  });

export const getSecurityQuestions = () =>
  request({ url: '/api/user/security-question/' });

export const getUserSecurityQuestions = () =>
  request({ url: '/api/user/user-security-question/' });

export const setUserSecurityQuestions = (data) =>
  request({
    url: '/api/user/user-security-question/',
    method: 'POST',
    data,
  });

export const verifyUserSecurityQuestions = (data) =>
  request({
    url: '/api/user/user-security-question/verify/',
    method: 'POST',
    data,
  });

// Other Function
export const getCareerAutoComplete = (value) =>
  request({
    url: '/api/user/career/auto_complete/',
    method: 'GET',
    params: { q: value },
  });

export const getApplyScenes = (name) =>
  request({
    url: '/api/user/apply-scene/',
    method: 'GET',
    params: { name },
  });

/**
 *
 * @param {Object} data
 * @param {String} data.home_domain
 */
export const setHomeDomain = (data) =>
  request({
    url: '/api/user/profile/home_domain/',
    method: 'POST',
    data,
  });

export const fetchUserAddresses = () =>
  request({
    url: '/api/geo/user-address/',
    method: 'GET',
  });

export const addUserAddress = (data) =>
  request({
    url: '/api/geo/user-address/',
    method: 'POST',
    data,
  });

export const updateUserAddress = (id, data) =>
  request({
    url: `/api/geo/user-address/${id}/`,
    method: 'PUT',
    data,
  });

export const postUserAddress = (data) => {
  const { id, is_update, ...rest } = data;
  if (id) {
    return updateUserAddress(id, rest);
  }
  return addUserAddress(data);
};

export const deleteUserAddress = (id) =>
  request({
    url: `/api/geo/user-address/${id}/`,
    method: 'DELETE',
  });

export const setDefaultAddress = (id) => 
  request({
    url: '/api/geo/user-address/default-address/',
    method: 'POST',
    data: { address_id: id },
  })

// Security

export const getUserSecurityInfo = () =>
  request({
    url: '/api/user/user-security-question/',
    method: 'GET',
  });
export const updateUserSecurityInfo = (data) =>
  request({
    url: '/api/user/user-security-question/',
    method: 'POST',
    data,
  });
export const verifyUserSecurityInfo = (data) =>
  request({
    url: '/api/user/user-security-question/verify/',
    method: 'POST',
    data,
  });

// wechat

export const fetchWechatInfo = () => request({
  url: '/api/user/profile/wechat-info/',
  method: 'GET',
})

export const fetchWechatUnbindingInfo = () => request({
  url: '/api/user/profile/wechat-unbinding/',
  method: 'GET',
})
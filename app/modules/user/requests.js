export const getUsersBasic = (uids) => ({
  url: `/api/user/user-simple-info/`,
  method: 'POST',
  data: {
    uid: uids,
  },
});

export const getUserInfo = ({ id, params }) => ({
  url: `/api/user/user-info/${id}/`,
  method: 'GET',
  params,
});

export const getApplicationAvailableInfo = ({ params }) => ({
  url: `/api/user/user-application-available/`,
  params,
});

import request from '@/utils/request';


export const fetchUserCategories = () =>
  request({
    url: `/api/category/expertise-category/my_category_list/`,
    method: 'GET',
  });

export const createCategory = (data) =>
  request({
    url: `/api/category/expertise-category/`,
    method: 'POST',
    data,
  });

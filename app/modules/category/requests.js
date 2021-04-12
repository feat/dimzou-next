import request from '@/utils/request';

export const fetchCategories = () =>
  request({
    url: `/api/dimzou/category/`,
    method: 'GET',
  });

export const fetchUserCategories = () =>
  request({
    url: `/api/dimzou/category/my_category_list/`,
    method: 'GET',
  });

export const createCategory = (data) =>
  request({
    url: `/api/dimzou/category/`,
    method: 'POST',
    data,
  });

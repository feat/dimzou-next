import request from '@/utils/request';

export const getComment = (id) =>
  request({
    url: `/api/activity/comment/${id}/`,
  });

export const getComments = ({ entity_type, entity_id }) =>
  request({
    url: '/api/activity/comment/comment-list/',
    params: {
      target_type: entity_type,
      object_id: entity_id,
    },
  });

export const createComment = ({ entity_type, entity_id, content }) =>
  request({
    url: '/api/activity/comment/',
    method: 'POST',
    data: {
      target_type: entity_type,
      object_id: entity_id,
      content,
    },
  });

export const updateComment = (data) =>
  request({
    url: `/api/activity/comment/${data.id}/`,
    method: 'PUT',
    data: {
      content: data.content,
    },
  });

export const deleteComment = (id, data) =>
  request({
    url: `/api/activity/comment/${id}/`,
    method: 'DELETE',
    data,
  });

export const replyComment = (data) => {
  const { entity_type, entity_id, parent_id, content } = data;
  return request({
    url: `/api/activity/comment/${parent_id}/reply/`,
    method: 'POST',
    data: {
      target_type: entity_type,
      object_id: entity_id,
      content,
    },
  });
};

export const getCommentReplies = () => {
  logging.debug('TODO');
};
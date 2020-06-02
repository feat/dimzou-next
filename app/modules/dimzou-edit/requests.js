import request from '../../utils/request';
import { BUNDLE_TYPE_ORIGIN, BUNDLE_TYPE_TRANSLATE } from './constants';

// bundle
export const createBundle = (data) =>
  request({
    url: '/api/dimzou/bundle/',
    method: 'POST',
    data,
  });

export const createOriginBundle = (data) => {
  const preData = {
    type: BUNDLE_TYPE_ORIGIN,
    payload: data,
  };
  return createBundle(preData);
};

export const createTranslationBundle = (data) => {
  const preData = {
    type: BUNDLE_TYPE_TRANSLATE,
    payload: data,
  }
  return createBundle(preData);
}

export const createCopyBundle = (bundleId) => request({
  url: `/api/dimzou/bundle/${bundleId}/create-copy/`,
  method: 'POST',
})

export const getBundleDesc = (bundleId) => request({
  url: `/api/dimzou/bundle/${bundleId}/`,
  method: 'GET',
})

export const deleteBundle = (bundleId) => request({
  url: `/api/dimzou/bundle/${bundleId}/`,
  method: 'DELETE',
});

export const insertContent = (bundleId, nodeId, data) =>
  request({
    url: `/api/dimzou/bundle/${bundleId}/insert-paragraph/?node=${nodeId}`,
    method: 'POST',
    data,
  });

export const removeContent = (bundleId, nodeId, data) =>
  request({
    url: `/api/dimzou/bundle/${bundleId}/remove-paragraph/?node=${nodeId}`,
    method: 'POST',
    data,
  });

export const insertMediaBlock = (bundleId, nodeId, data) => {
  const formData = new FormData();
  if (data.paragraph_id) {
    formData.append('paragraph_id', data.paragraph_id);
  }
  if (data.is_first) {
    formData.append('is_first', data.is_first);
  }
  formData.append('html_content', data.html_content);
  formData.append('img', data.file);
  return request({
    url: `/api/dimzou/bundle/${bundleId}/insert-paragraph/?node=${nodeId}`,
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const submitEdit = (bundleId, nodeId, data) =>
  request({
    url: `/api/dimzou/bundle/${bundleId}/edit/?node=${nodeId}`,
    method: 'POST',
    data,
  });

export const submitCover = (bundleId, nodeId, data) => {
  const formData = new FormData();
  if (data.img) {
    formData.append('img', data.img);
  }
  if (data.crop_img) {
    formData.append('crop_img', data.crop_img);
  }
  if (data.template_config) {
    formData.append('template_config', JSON.stringify(data.template_config));
  }
  if (data.reword_id) {
    formData.append('reword_id', data.reword_id);
  }
  return request({
    url: `/api/dimzou/bundle/${bundleId}/upload/?node=${nodeId}`,
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const submitMediaEdit = (bundleId, nodeId, data) => {
  const formData = new FormData();
  formData.append('reword_type', data.reword_type);
  formData.append('paragraph_id', data.paragraph_id);
  formData.append('html_content', data.html_content);
  formData.append('img', data.file);

  return request({
    url: `/api/dimzou/bundle/${bundleId}/edit/?node=${nodeId}`,
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const checkEdit = (bundleId, nodeId, data) =>
  request({
    url: `/api/dimzou/bundle/${bundleId}/check/?node=${nodeId}`,
    method: 'POST',
    data,
  });

export const createNode = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/chapter/`,
    method: 'POST',
    data,
  });

export const getBundleEditInfo = (id, params, onDownloadProgress) =>
  request({
    url: `/api/dimzou/bundle/${id}/detail/`,
    method: 'GET',
    params,
    onDownloadProgress,
  });

export const updateBundleConfig = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/`,
    method: 'PATCH',
    data,
  });

export const addCollaborator = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/collaborator/`,
    method: 'POST',
    data,
  });

export const removeCollaborator = (id, data) => 
  request({
    url: `/api/dimzou/bundle/${id}/collaborator-delete/`,
    method: 'DELETE',
    data,
  })

export const updateCollaborator = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/collaborator/`,
    method: 'POST',
    data,
  });

export const fetchCollaborators = (params) => 
  request({
    url: '/api/dimzou/collaborator/',
    params,
  })

export const createBundleInvitation = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/invitation/`,
    method: 'POST',
    data,
  });

export const prePublish = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/pre-publish/`,
    method: 'POST',
    data,
  });

export const publish = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/publish/`,
    method: 'POST',
    data,
  });

export const sectionRelease = (bundleId, data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    form.append(key, value);
  })
  return request({
    url: `/api/dimzou/bundle/${bundleId}/publish-node-section/`,
    method: 'POST',
    data: form,
    headers: {
      'Content-Type': false,
    },
  })
}

// node
export const getDimzouEditInfo = (id, params) =>
  request({
    url: `/api/v1/dimzou/${id}/edit`,
    method: 'GET',
    params,
  });

export const patchDimzouEditInfo = (id, data) => {
  if (data.params.structure === 'cover') {
    const formData = new FormData();
    formData.append('method', data.method);

    Object.keys(data.params).forEach((key) => {
      if (key === 'cropped_image' || key === 'source_image') {
        formData.append(key, data.params[key]);
      } else if (data.params[key] instanceof Object) {
        formData.append(`params[${key}]`, JSON.stringify(data.params[key]));
      } else {
        formData.append(`params[${key}]`, data.params[key]);
      }
    });
    return request({
      url: `/api/v1/dimzou/${id}/edit`,
      method: 'POST',
      headers: {
        'Content-Type': false,
      },
      data: formData,
    });
  }
  return request({
    url: `/api/v1/dimzou/${id}/edit`,
    method: 'POST',
    data,
  });
};

export const addAttachment = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: `/api/v1/dimzou/${id}/attachment`,
    method: 'POST',
    headers: {
      'Content-Type': false,
    },
    data: formData,
  });
};

export const publishNode = (id, data) =>
  request({
    url: `/api/v1/dimzou/${id}/publish`,
    method: 'POST',
    data,
  });

export const patchNodeConfig = (id, data) =>
  request({
    url: `/api/v1/dimzou/${id}/config`,
    method: 'POST',
    data,
  });

export const getRewordingCommentList = ({ rewording_id, page, page_size }) =>
  request({
    url: `/api/activity/comment/comment-list/`,
    method: 'GET',
    params: {
      target_type: 400, // 
      object_id: rewording_id,
      page,
      page_size,
    },
  });

export const getRewordingComment = ({ id }) =>
  request({
    url: `/api/dimzou/reword-comment/${id}/`,
  });

export const createRewordingComment = ({ rewording_id, parent_id, content }) => {
  if (parent_id) {
    return request({
      url: `/api/activity/comment/${parent_id}/reply/`,
      method: 'POST',
      data: {
        target_type: 400,
        object_id: rewording_id,
        content,
      },
    })
  }
  return request({
    url: '/api/activity/comment/',
    method: 'POST',
    data: {
      target_type: 400,
      object_id: rewording_id,
      content,
    },
  })
}

export const updateRewordingComment = ({ id, content }) =>
  request({
    url: `/api/activity/comment/${id}/`,
    method: 'PATCH',
    data: {
      content,
    },
  });

export const deleteRewordingComment = ({ id }) =>
  request({
    url: `/api/activity/comment/${id}/`,
    method: 'DELETE',
  });

export const likeRewording = ({ rewording_id }) =>
  request({
    url: `/api/activity/like/`,
    method: 'POST',
    data: {
      target_type: 100,
      object_id: rewording_id,
    },
  });

export const unlikeRewording = ({ rewording_id }) =>
  request({
    url: `/api/activity/like/`,
    method: 'POST',
    data: {
      target_type: 100,
      object_id: rewording_id,
    },
  });

export const getBlockTranslation = (node_id, { structure, block_id }) =>
  request({
    url: `/api/v1/dimzou/${node_id}/content-translate`,
    method: 'GET',
    params: {
      structure,
      block_id,
    },
  });

export const setApplyScenes = (id, data) =>
  request({
    url: `/api/dimzou/bundle/${id}/set-apply-scenes/`,
    method: 'POST',
    data: {
      apply_scenes: data,
    },
  });

export const updateNodeSort = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/sort-chapter/`,
    method: 'POST',
    data,
  })

export const setChapterNode = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/set-general-chapter/`,
    method: 'POST',
    data,
  })

export const setCoverNode = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/set-cover-chapter/`,
    method: 'POST',
    data,
  })

export const deleteNode = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/remove-chapter/`,
    method: 'POST',
    data,
  })

export const restoreNode = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/restore-chapter/`,
    method: 'POST',
    data,
  })

export const updateNodeVisibility = (bundleId, data) => 
  request({
    url: `/api/dimzou/bundle/${bundleId}/set-chapter-visibility/`,
    method: 'POST',
    data,
  })

export const updateManuscript = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/set-chapter-manuscript/`,
  method: 'POST',
  data,
})

export const updateBlockSort = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/sort-paragraph/`,
  method: 'POST',
  data,
})

export const markRewordShared = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/mark-shared/`,
  method: 'POST',
  data,
})

export const fetchUserDrafts = (params) => request({
  url: `/api/dimzou/bundle/user-related-drafts/`,
  method: 'GET',
  params,
})

export const mergeBundle = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/merge-bundle/`,
  method: 'POST',
  data,
})

export const separateNode = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/separate-chapter/`,
  method: 'POST',
  data,
})

export const updateChapter = (bundleId, data) => request({
  url: `/api/dimzou/bundle/${bundleId}/update-chapter/`,
  method: 'POST',
  data,
})

export const fetchUserCreated = (params) => request({
  url: `/api/dimzou/bundle/user-created-drafts/`,
  method: 'GET',
  params,
})

export const fetchUserRelated = (params) => request({
  url: '/api/dimzou/bundle/target-user-related-drafts/',
  method: 'GET',
  params,
})

export const fetchBundlePublication = (params) => request({
  url: '/api/dimzou/publication/',
  method: 'GET',
  params,
})

// dashboard
export function fetchDimzouReports(params) {
  return request({
    url: '/api/dimzou/bundle/',
    method: 'GET',
    params,
  });
}

export const fetchReaderReport = () =>
  request({
    url: `/api/user/reader-report/`,
  });

export const fetchReaderTaste = (params) =>
  request({
    url: `/api/user/reader-articles/`,
    params,
  });

export const fetchReaderCommented = () =>
  request({
    url: '/api/user/new-comment/',
  });

export const getApplyScenes = (name) =>
  request({
    url: '/api/user/apply-scene/',
    method: 'GET',
    params: { name },
  });

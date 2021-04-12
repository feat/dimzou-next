import { combineReducers } from 'redux';

import bundleReducer from './bundle';
import commentReducer from './comment';
import nodeReducer from './node';
import blockReducer from './block';
import rewordingReducer from './rewording';
import appendingReducer from './appending';
import likeReducer from './like';
import workspaceReducer from './workspace';
import userRelatedReducer from './userRelated';
import publicationReducer from './publication';
import dashboardReducer from './dashboard';
import workshopReducer from './workshop';

// TODO request queue-idle machine

export default combineReducers({
  dimzouBundles: bundleReducer,
  dimzouNodes: nodeReducer,
  dimzouBlocks: blockReducer,
  rewordings: rewordingReducer,
  appendings: appendingReducer,
  rewordingComments: commentReducer,
  likes: likeReducer,
  workspace: workspaceReducer,
  workshop: workshopReducer,
  userRelated: userRelatedReducer,
  publications: publicationReducer,
  dashboard: dashboardReducer,
});

export const REDUCER_KEY = 'dimzou-edit';

import { mapHandleActions } from '@/utils/reducerCreators';
import {
  fetchBundleEditInfo,
  fetchBundleEditInfoFailure,
  initBundle,
  loadBundleEditInfo,
} from '../actions';

import {
  EDIT_MODE_ORIGIN,
  EDIT_MODE_TRANSLATION,
  CONTENT_TYPE_TRANSLATE,
  FEATURES_OMCB,
  FEATURES_OSCB,
  FEATURES_TB,
} from '../constants';

export const initialBundleState = {
  isReady: false,
  isFetchingEditInfo: false,
  fetchError: null,
  data: null, // bundle data
  features: undefined,
  mode: undefined,
};

const getBundleFeatures = (data) => {
  if (data.type === CONTENT_TYPE_TRANSLATE) {
    return FEATURES_TB;
  }
  if (data.is_multi_chapter) {
    return FEATURES_OMCB;
  }
  return FEATURES_OSCB;
};

const bundleEditReducer = mapHandleActions(
  {
    [initBundle]: (bundleState, action) => {
      const {
        payload: { invitationCode },
      } = action;
      return {
        ...bundleState,
        invitationCode,
        fetchError: null,
      };
    },
    [fetchBundleEditInfo]: (bundleState) => ({
      ...bundleState,
      isFetchingEditInfo: true,
    }),
    [fetchBundleEditInfoFailure]: (bundleState, action) => {
      const {
        payload: { data: error },
      } = action;
      return {
        ...bundleState,
        isFetchingEditInfo: false,
        fetchError: error,
      };
    },
    [loadBundleEditInfo]: (bundleState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...bundleState,
        isFetchingEditInfo: false,
        isReady: true,
        fetchError: null,
        data: data.id,
        mode:
          data.type === CONTENT_TYPE_TRANSLATE
            ? EDIT_MODE_TRANSLATION
            : EDIT_MODE_ORIGIN,
        features: getBundleFeatures(data),
      };
    },
  },
  initialBundleState,
  (action) => action.payload.bundleId,
);

export default bundleEditReducer;

import { mapHandleActions } from '@/utils/reducerCreators';
import { fetchMenu } from './actions';

const initialState = {
  fetched: undefined,
  items: undefined,
};

const reducer = mapHandleActions(
  {
    [fetchMenu.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [fetchMenu.SUCCESS]: (state, action) => ({
      ...state,
      fetched: true,
      items: action.payload.items,
    }),
    [fetchMenu.FULFILL]: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  initialState,
  (action) => action.payload.name,
);

export default reducer;

export const REDUCER_KEY = 'menu';

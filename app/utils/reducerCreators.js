import { handleActions, combineActions } from 'redux-actions';
import update from 'immutability-helper';

const initialBlockState = {
  loading: false,
  error: null,
  data: null,
  onceFetched: false,
};

export function createBlockReducer(routine) {
  const reducer = handleActions(
    {
      [routine.TRIGGER]: (state) => ({
        ...state,
        error: null,
        onceFetched: true,
      }),
      [routine.REQUEST]: (state, action) => {
        const nextState = {
          ...state,
          loading: true,
        };
        if (action.payload) {
          nextState.data = {
            ...(nextState.data || {}),
            ...action.payload,
          };
        }
        return nextState;
      },
      [routine.SUCCESS]: (state, action) => ({
        ...state,
        data: action.payload,
      }),
      [routine.FAILURE]: (state, action) => ({
        ...state,
        error: action.payload,
      }),
      [routine.FULFILL]: (state) => ({
        ...state,
        loading: false,
        onceFetched: true,
      }),
    },
    initialBlockState,
  );
  return reducer;
}

export function createBlockMapReducer(routine, keyExtractor) {
  const blockReducer = createBlockReducer(routine);
  const reducer = handleActions(
    {
      [combineActions(
        routine.TRIGGER,
        routine.REQUEST,
        routine.SUCCESS,
        routine.FAILURE,
        routine.FULFILL,
      )]: (state, action) => {
        const key = keyExtractor(action);
        return update(state, {
          [key]: {
            $apply: (subState) => blockReducer(subState, action),
          },
        });
      },
    },
    {},
  );
  return reducer;
}

const initialListState = {
  loading: false,
  items: [],
  error: null,
  pagination: null,
  onceFetched: false,
};

export function createListReducer(routine, initialState = initialListState) {
  const reducer = handleActions(
    {
      [routine.TRIGGER]: (state) => ({
        ...state,
        error: null,
      }),
      [routine.REQUEST]: (state) => ({
        ...state,
        loading: true,
      }),
      [routine.SUCCESS]: (state, action) => {
        const { items, ...rest } = action.payload;
        return {
          ...state,
          items: [...state.items, ...action.payload.items],
          ...rest,
          onceFetched: true,
        };
      },
      [routine.FAILURE]: (state, action) => ({
        ...state,
        error: action.payload,
        onceFetched: true,
      }),
      [routine.FULFILL]: (state) => ({
        ...state,
        loading: false,
      }),
    },
    initialState,
  );
  return reducer;
}

export function mapHandleActions(map, initialState, keyExtractor) {
  const wrapped = {};
  Object.entries(map).forEach(([key, func]) => {
    wrapped[key] = (state, action) => {
      const mapKey = keyExtractor(action);
      return {
        ...state,
        [mapKey]: func(state[mapKey] || initialState, action),
      };
    };
  });
  return handleActions(wrapped, {});
}

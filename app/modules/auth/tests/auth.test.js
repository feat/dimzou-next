import reducer from '../reducer';
import { setCurrentUser } from '../actions';

describe('Auth Module Test', () => {
  let state = reducer(undefined, { type: 'INIT' });
  it('Set AuthInfo', () => {
    const action = setCurrentUser({
      user: 1,
      meta: { a: 1 },
    });
    state = reducer(state, action);
    expect(state.user).toEqual(1);
    expect(state.userMeta).toEqual({
      a: 1,
    });
  });
});

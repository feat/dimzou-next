import {
  workshopNavBackward,
  workshopNavForward,
  workshopNavPin,
  workshopNavPush,
  workshopNavUnpin,
  workshopNavInit,
  workshopNavReset,
} from '../actions';
import workshopReducer from '../reducers/workshop';

describe('Dimzou workspace', () => {
  describe('navigator', () => {
    describe('init', () => {
      it('initial', () => {
        const action = workshopNavInit({
          userId: 1,
        });
        const state = workshopReducer(undefined, action);
        expect(state.navigator.current).toBe(1);
      });
      it('initialized', () => {
        const action = workshopNavInit({
          userId: 1,
        });
        const state = workshopReducer(
          {
            navigator: {
              current: 2,
            },
          },
          action,
        );
        expect(state.navigator.current).toBe(2);
      });
    });

    describe('reset', () => {
      const action = workshopNavReset({
        userId: 1,
      });
      const state = workshopReducer(
        {
          navigator: {
            current: 2,
          },
        },
        action,
      );
      expect(state.navigator.current).toBe(1);
    });
    describe('pin', () => {
      it('pin', () => {
        const action = workshopNavPin();
        const state = workshopReducer(
          {
            navigator: {
              currentPinned: false,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(true);
      });
      it('unpin', () => {
        const action = workshopNavUnpin();
        const state = workshopReducer(
          {
            navigator: {
              currentPinned: true,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(false);
      });
      it('release pinned if backward', () => {
        const action = workshopNavBackward();
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
              currentPinned: true,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(false);
      });

      it('release pinned if forward', () => {
        const action = workshopNavForward();
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
              currentPinned: true,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(false);
      });
    });

    describe('nav', () => {
      it('backward', () => {
        const action = workshopNavBackward();
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [],
            },
          },
          action,
        );
        expect(state.navigator.prev).toEqual([]);
        expect(state.navigator.current).toEqual(1);
        expect(state.navigator.next).toEqual([2]);
      });

      it('forward', () => {
        const action = workshopNavForward();
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
            },
          },
          action,
        );
        expect(state.navigator.prev).toEqual([1, 2]);
        expect(state.navigator.current).toEqual(3);
        expect(state.navigator.next).toEqual([]);
      });

      it('push -- auto', () => {
        const action = workshopNavPush({
          userId: 4,
        });
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
              currentPinned: true,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(true);
        expect(state.navigator.current).toEqual(2);
        expect(state.navigator.prev).toEqual([1]);
        expect(state.navigator.next).toEqual([3]);
      });

      it('push -- prevent same push', () => {
        const action = workshopNavPush({
          userId: 2,
        });
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
            },
          },
          action,
        );
        expect(state.navigator.current).toEqual(2);
        expect(state.navigator.prev).toEqual([1]);
        expect(state.navigator.next).toEqual([3]);
      });

      it('push -- force', () => {
        const action = workshopNavPush({
          userId: 4,
          force: true,
        });
        const state = workshopReducer(
          {
            navigator: {
              prev: [1],
              current: 2,
              next: [3],
              currentPinned: true,
            },
          },
          action,
        );
        expect(state.navigator.currentPinned).toBe(false);
        expect(state.navigator.current).toEqual(4);
        expect(state.navigator.prev).toEqual([1, 2]);
        expect(state.navigator.next).toEqual([]);
      });
    });
  });

  describe('user workshop', () => {});
});

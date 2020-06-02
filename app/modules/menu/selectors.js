import { createSelector } from 'reselect';

const selectMenuDomain = (state) => state.menu;

export const makeSelectMenu = (name) =>
  createSelector(selectMenuDomain, (subState) => subState[name]);

import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

import { selectWorkshopNavigator, selectUserRelatedDrafts } from '../selectors';
import { OwnerContext, WorkshopContext, AppContext } from '../context';
import {
  workshopNavInit,
  workshopNavPush,
  asyncFetchUserRelated,
  workshopUpdateFilter,
} from '../actions';
import dimzouSocket from '../socket';
import { ROLE_OWNER } from '../constants';
import { groupByStatus } from '../utils/bundle';

const PAGE_SIZE = 999;
function WorkshopContextProvider(props) {
  const appContext = useContext(AppContext);
  const ownerContext = useContext(OwnerContext);
  const navigatorState = useSelector((state) => selectWorkshopNavigator(state));
  const dispatch = useDispatch();

  /* Auto update workshop list */
  useEffect(
    () => {
      const ownerId = ownerContext && ownerContext.uid;
      if (!navigatorState.current) {
        dispatch(
          workshopNavInit({
            userId: ownerId,
          }),
        );
      } else if (navigatorState.current !== ownerId && ownerId) {
        dispatch(
          workshopNavPush({
            userId: ownerId,
          }),
        );
      }
    },
    [ownerContext ? ownerContext.uid : undefined],
  );

  const currentState =
    useSelector((state) =>
      selectUserRelatedDrafts(state, { userId: navigatorState.current }),
    ) || {};

  useEffect(
    () => {
      if (!navigatorState.current) {
        return;
      }
      if (!currentState.onceFetched && !currentState.loading) {
        dispatch(
          asyncFetchUserRelated({
            userId: navigatorState.current,
            pageSize: PAGE_SIZE,
          }),
        );
      }
      dimzouSocket.private(`dimzou-user-${navigatorState.current}`);
    },
    [navigatorState.current],
  );

  const bundleNodes = useMemo(
    () => {
      const extraNodes = currentState.loaded
        ? currentState.loaded.filter((item) => !currentState.ids[item.id])
        : [];
      const merged = [...extraNodes, ...(currentState.data || [])];
      if (currentState.filter) {
        return merged.filter(
          (b) =>
            b.title.indexOf(currentState.filter) > -1 ||
            String(b.id) === appContext.bundleId, // 始终显示当前 Bundle
        );
      }
      return merged;
    },
    [currentState.data, currentState.loaded, currentState.filter],
  );

  const classified = useMemo(
    () => {
      const roleGrouped = groupBy(bundleNodes, (bundle) => {
        const collaborators = get(bundle, 'nodes.0.collaborators');
        if (collaborators) {
          const info = collaborators.find(
            // eslint-disable-next-line eqeqeq
            (item) => item.user_id == navigatorState.current,
          );
          if (info && info.role === ROLE_OWNER) {
            return 'created';
          }
          return 'participated';
        }

        // eslint-disable-next-line eqeqeq
        if (bundle.user_id == navigatorState.current) {
          return 'created';
        }
        return 'participated';
      });
      const output = {};
      Object.keys(roleGrouped).forEach((key) => {
        output[key] = groupByStatus(roleGrouped[key]);
      });
      if (roleGrouped.created && roleGrouped.created.length) {
        output.hasCreated = true;
      }
      if (roleGrouped.participated && roleGrouped.participated.length) {
        output.hasParticipated = true;
      }
      return output;
    },
    [bundleNodes, navigatorState.current],
  );

  // TODO: add load more method.
  const workshopState = useMemo(
    () => ({
      ...currentState,
      classified,
      userId: navigatorState.current,
      updateFilter: (filter) => {
        dispatch(
          workshopUpdateFilter({
            userId: navigatorState.current,
            filter,
          }),
        );
      },
    }),
    [currentState, navigatorState.current],
  );

  return (
    <WorkshopContext.Provider value={workshopState}>
      {props.children}
    </WorkshopContext.Provider>
  );
}

WorkshopContextProvider.propTypes = {
  children: PropTypes.any,
};

export default WorkshopContextProvider;

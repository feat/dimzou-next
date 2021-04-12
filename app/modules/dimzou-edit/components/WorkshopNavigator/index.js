import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import Router from 'next/router';

import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import { selectUsername } from '@/modules/user/selectors';
import { selectCurrentUserId } from '@/modules/auth/selectors';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import { selectWorkshopNavigator } from '../../selectors';
import UserDimzouTree from '../UserDimzouTree';
import Icon from '../Icon';

import {
  workshopNavBackward,
  workshopNavForward,
  workshopNavPush,
} from '../../actions';
import dzMessages from '../../messages';
import './style.scss';

function WorkshopNavigator() {
  const navigatorState = useSelector((state) => selectWorkshopNavigator(state));
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const username = useSelector((state) =>
    selectUsername(state, {
      userId: navigatorState.current,
    }),
  );

  // eslint-disable-next-line eqeqeq
  const isWorkshopOfCurrentUser = currentUserId == navigatorState.current;
  let displayName;
  if (isWorkshopOfCurrentUser) {
    displayName = <TranslatableMessage message={dzMessages.my} />;
  } else if (navigatorState.current) {
    displayName = username || navigatorState.current;
  }

  return (
    <div className="dz-WorkshopNavigator">
      <div className="dz-WorkshopNavigator__header">
        <div className="dz-WorkshopNavigator__title">{displayName}</div>
        <div className="dz-WorkshopNavigator__navs">
          <ButtonBase
            onClick={() => {
              dispatch(workshopNavBackward());
            }}
            disabled={!navigatorState.prev.length}
          >
            <Icon name="back" className="size_xs" />
          </ButtonBase>
          <ButtonBase
            disabled={!navigatorState.next.length}
            onClick={() => {
              dispatch(workshopNavForward());
            }}
          >
            <Icon name="forward" className="size_xs" />
          </ButtonBase>
          <Tooltip title="Home" placement="top">
            <ButtonBase
              onClick={() => {
                if (!currentUserId) {
                  Router.push({
                    pathname: '/auth/login',
                    query: {
                      redirect: window.location.pathname,
                    },
                  });
                } else {
                  dispatch(
                    workshopNavPush({
                      userId: currentUserId,
                    }),
                  );
                }
              }}
              className={classNames({
                'is-selected':
                  currentUserId && currentUserId === navigatorState.current,
              })}
            >
              <Icon name="home" className="size_xs" />
            </ButtonBase>
          </Tooltip>
        </div>
      </div>
      <div className="dz-WorkshopNavigator__content">
        {navigatorState.current && <UserDimzouTree />}
      </div>
    </div>
  );
}

export default WorkshopNavigator;

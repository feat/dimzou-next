import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';

import commonMessages from '@/messages/common';

import { hasAuthedUser } from '@/modules/auth/selectors';
import { initOrderCreation } from '@/modules/commerce/actions/creation';

import { UserInfo } from '../../UserInfoProvider';

import ViewProfileTemplateI from './ViewProfileTemplateI';
import ViewProfileTemplateII from './ViewProfileTemplateII';
import ViewProfileTemplateIII from './ViewProfileTemplateIII';

import './style.scss';

const getPageTemplate = (userInfo) => {
  const hasService = userInfo.expertise && userInfo.expertise.some((item) => !!item.available_services.length);
  const hasExpertise = userInfo.expertise && userInfo.expertise.length;
  if (hasExpertise && !hasService) {
    return ViewProfileTemplateIII;
  }

  if (userInfo.workplace && hasService
  ) {
    return ViewProfileTemplateI;
  }

  return ViewProfileTemplateII;
}

function ViewProfile() {
  const userContext = useContext(UserInfo);
  const hasAuthed = useSelector(hasAuthedUser);
  const dispatch = useDispatch();
  const router = useRouter();
  if (userContext.fetchError) {
    return (
      <div>{userContext.fetchError.message}</div>
    )
  }
  if (userContext.data) {
    const Template = getPageTemplate(userContext.data);
    return (
      <Template
        key={userContext.data.uid}
        {...userContext.data}
        initOrderCreation={(data) => {
          if (hasAuthed) {
            dispatch(initOrderCreation(data));
          } else {
            router.push({
              pathname: '/auth/login',
              query: {
                redirect: window.location.pathname,
              },
            })
          }
        }}
      />
    )
  }
  if (userContext.fetching) {
    return (
      <div>
        <FormattedMessage {...commonMessages.loading} />
      </div>
    )
  }
  return null;
}

export default ViewProfile;
import React from 'react';
import PropTypes from 'prop-types';
import {  useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { BundleRender } from '../AppRenders'

import CoverCreate from "../CoverCreate";
import AppSidebarFirst from '../AppSidebarFirst';

function CoverNodeCreation(props) {
  const currentUser = useSelector(selectCurrentUser);
  
  return (
    <BundleRender
      main={
        <CoverCreate 
          cacheKey={props.cacheKey}
          currentUser={currentUser}
          onSubmit={props.onSubmit}
          onCancel={props.onCancel}
          titlePlaceholder={props.titlePlaceholder}
          summaryPlaceholder={props.summaryPlaceholder}
        />
      }
      sidebarFirst={
        <AppSidebarFirst />
      }
      sidebarSecond={null}
    />
  )
}


CoverNodeCreation.propTypes = {
  cacheKey: PropTypes.string,
  titlePlaceholder: PropTypes.node,
  summaryPlaceholder: PropTypes.node,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

export default CoverNodeCreation;
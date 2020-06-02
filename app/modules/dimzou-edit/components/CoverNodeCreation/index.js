import React from 'react';
import PropTypes from 'prop-types';
import {  useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import Sticky from '@feat/feat-ui/lib/sticky';
import {
  TemplateI,
} from "../Template"

import CoverCreate from "../CoverCreate";
import UsersDraftsPanel from '../UserDraftsPanel';

function CoverNodeCreation(props) {
  const currentUser = useSelector(selectCurrentUser);
  
  return (
    <TemplateI
      cover={null}
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
        <Sticky top="#header" bottomBoundary="#dimzou-edit">
          <div className="dz-Edit__pageTitle">Draft</div>
          <UsersDraftsPanel />
        </Sticky>
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
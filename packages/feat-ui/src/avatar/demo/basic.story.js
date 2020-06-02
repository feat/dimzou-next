import React from "react";
import PropTypes from "prop-types";
import Avatar from "@feat/feat-ui/lib/avatar";
import demoAvatar from './avatar.png';

const Basic = (props) => (
  <div>
    <div>
      <Avatar avatar={demoAvatar} size="xxs" /> xxs
    </div>
    <div>
      <Avatar avatar={demoAvatar} size="xs" />  xs
    </div>
    <div>
      <Avatar avatar={demoAvatar} size="sm" />  sm
    </div>
    <div>
      <Avatar avatar={demoAvatar} size="md" />  md
    </div>
    <div>
      <Avatar avatar={demoAvatar} size="lg" />  lg
    </div>
    <div>
      <Avatar avatar={demoAvatar} size="xl" />  xl
    </div>
  </div>

);

export default Basic;

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import AvatarStamp from "../avatar/AvatarStampII";

const isDayTime = (localTime) => {

};

const AwesomeCard = (props) => {
  const {
    namespace,
    commercialSign,
    promoteWords,
    username,
    avatar,
    expertise,
    location,
    localTime,
    openTimePeriod,
    nightTheme,
    ...restProps
  } = props;

  const blockName = `${namespace}-AwesomeCard`;
  return (
    <div
      className={classNames(blockName, {
        "is-clickable": Boolean(restProps.onClick),
        [`${blockName}_nightTheme`]: nightTheme,
      })}
    >
      <div className={`${blockName}__header`}>
        <h3 className={`${blockName}__title`}>{commercialSign}</h3>
        <p className={`${blockName}__desc`}>{promoteWords}</p>
      </div>
      <div className={`${blockName}__content`} >
        <div className={`${blockName}__avatarStamp`}>
          <AvatarStamp
            avatar={avatar}
            username={username}
            expertise={expertise}
            location={location}
            localTime={localTime}
            meta={["expertise"]}
            extraMeta={["location", "localTime"]}
          />
        </div>
        <div>
          {openTimePeriod}
        </div>
      </div>
    </div>
  );
};

AwesomeCard.defaultProps = {
  namespace: "ft",
};

export default AwesomeCard;

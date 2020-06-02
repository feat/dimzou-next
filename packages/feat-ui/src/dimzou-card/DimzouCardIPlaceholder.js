import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";
import { RectShape, TextBlock, TextRow } from "../placeholder";
import AvatarStampPlaceholder from "../avatar/AvatarStampPlaceholder";

export default function DimzouCardI(props) {
  const {
    layoutType,
    titleLines,
    bodyLines,
    showAvatar,
    imageRatio,
    avatarSize,
    ...restProps
  } = props;

  return (
    <DimzouCard
      className={classNames("dz-Card_I dz-Card_placeholder")}
      {...restProps}
    >
      <DimzouCard.ImageWrap
        className={classNames({
          "pull-left": layoutType === "J",
          "pull-right": layoutType === "L",
        })}
      >
        <RectShape ratio={imageRatio} />
      </DimzouCard.ImageWrap>

      <DimzouCard.TTitle>
        <TextRow modifier="title" randomWidth />
      </DimzouCard.TTitle>

      <DimzouCard.Avatar>
        <AvatarStampPlaceholder size={avatarSize} />
      </DimzouCard.Avatar>

      <DimzouCard.TBody>
        <TextBlock row={bodyLines} />
      </DimzouCard.TBody>
    </DimzouCard>
  );
}

DimzouCardI.propTypes = {
  showAvatar: PropTypes.bool,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  layoutType: PropTypes.oneOf(["J", "L"]),
};

DimzouCardI.defaultProps = {
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
  imageRatio: 16 / 9,
};

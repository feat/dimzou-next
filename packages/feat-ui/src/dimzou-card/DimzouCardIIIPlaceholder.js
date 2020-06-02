import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { RectShape, TextBlock, TextRow } from "../placeholder";
import AvatarStampPlaceholder from "../avatar/AvatarStampPlaceholder";
import DimzouCard from "./DimzouCard";

export default function DimzouCardIII(props) {
  const {
    layoutType,
    titleLines,
    bodyLines,
    showAvatar,
    avatarSize,
    imageRatio,
    ...restProps
  } = props;

  return (
    <DimzouCard
      className={classNames("dz-Card_III dz-Card_placeholder")}
      {...restProps}
    >
      <DimzouCard.ImageWrap>
        <RectShape ratio={imageRatio} />
      </DimzouCard.ImageWrap>

      <DimzouCard.TTitle>
        <TextRow modifier="title" randomWidth />
      </DimzouCard.TTitle>
      {showAvatar && (
        <DimzouCard.Avatar>
          <AvatarStampPlaceholder size={avatarSize} />
        </DimzouCard.Avatar>
      )}
      <DimzouCard.TBody>
        <TextBlock row={bodyLines} />
      </DimzouCard.TBody>
    </DimzouCard>
  );
}

DimzouCardIII.propTypes = {
  showAvatar: PropTypes.bool,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  layoutType: PropTypes.oneOf(["J", "L"]),
  imageRatio: PropTypes.number,
  avatarSize: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
};

DimzouCardIII.defaultProps = {
  layoutType: "J",
  imageRatio: 16 / 9,
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
};

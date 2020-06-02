import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { RectShape, TextBlock, TextRow } from "../placeholder";
import AvatarStampPlaceholder from "../avatar/AvatarStampPlaceholder";
import DimzouCard from "./DimzouCard";

export default function DimzouCardIV(props) {
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
      className={classNames("dz-Card_IV dz-Card_placeholder")}
      {...restProps}
    >
      <DimzouCard.ImageWrap>
        <RectShape ratio={imageRatio} />
      </DimzouCard.ImageWrap>

      <DimzouCard.Content>
        <DimzouCard.TTitle>
          <TextRow randomWidth modifier="title" />
        </DimzouCard.TTitle>

        <DimzouCard.Avatar>
          <AvatarStampPlaceholder size={avatarSize} />
        </DimzouCard.Avatar>

        <DimzouCard.TBody>
          <TextBlock row={bodyLines} />
        </DimzouCard.TBody>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardIV.propTypes = {
  showAvatar: PropTypes.bool,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  layoutType: PropTypes.oneOf(["J", "L"]),
};

DimzouCardIV.defaultProps = {
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
  imageRatio: 32 / 18,
};

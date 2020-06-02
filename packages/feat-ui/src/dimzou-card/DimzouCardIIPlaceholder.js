import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";
import { RectShape, TextBlock, TextRow } from "../placeholder";
import AvatarStampPlaceholder from "../avatar/AvatarStampPlaceholder";

export default function DimzouCardII(props) {
  const {
    layoutType,
    titleLines,
    bodyLines,
    imageRatio,
    avatarSize,
    ...restProps
  } = props;
  return (
    <DimzouCard className="dz-Card_II dz-Card_placeholder" {...restProps}>
      <DimzouCard.TTitle>
        <TextRow randomWidth modifier="title" />
      </DimzouCard.TTitle>

      <DimzouCard.Avatar>
        <AvatarStampPlaceholder size={avatarSize} />
      </DimzouCard.Avatar>

      <DimzouCard.Content>
        <DimzouCard.ImageWrap
          className={classNames({
            "pull-left": layoutType === "J",
            "pull-right": layoutType === "L",
          })}
        >
          <RectShape ratio={imageRatio} />
        </DimzouCard.ImageWrap>
        <DimzouCard.TBody>
          <TextBlock row={bodyLines} />
        </DimzouCard.TBody>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardII.propTypes = {
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  layoutType: PropTypes.oneOf(["J", "L"]),
  imageRatio: PropTypes.number,
  avatarSize: PropTypes.string,
};

DimzouCardII.defaultProps = {
  imageRatio: 16 / 9,
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
  avatarSize: "sm",
};

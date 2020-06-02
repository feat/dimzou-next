import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";
import AvatarStampII from "../avatar/AvatarStampII";

export default function DimzouCardIV(props) {
  const {
    title,
    body,
    author,
    cover,
    layoutType,
    titleLines,
    bodyLines,
    showAvatar,
    renderAvatar,
    ...restProps
  } = props;

  return (
    <DimzouCard
      className={classNames("dz-Card_IV", {
        "js-clickable": Boolean(restProps.onClick),
      })}
      {...restProps}
    >
      <DimzouCard.ImageWrap>
        <DimzouCard.Image src={cover} />
      </DimzouCard.ImageWrap>
      <DimzouCard.Content>
        <DimzouCard.Title
          lines={titleLines}
          ellipsis
        >
          {title}
        </DimzouCard.Title>
        {showAvatar && author && (
          <DimzouCard.Avatar>
            {renderAvatar ? (
              renderAvatar(author)
            ) : (
              <AvatarStampII
                username={author.username}
                avatar={author.avatar}
                meta={["expertise"]}
                expertise={author.expertise}
                extraMeta={["location", "localTime"]}
                location={author.location}
                localTime={author.localTime}
              />
            )}
          </DimzouCard.Avatar>
        )}
        <DimzouCard.Body
          lines={bodyLines}
          ellipsis
        >
          {body}
        </DimzouCard.Body>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardIV.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  cover: PropTypes.string,
  author: PropTypes.object,
  showAvatar: PropTypes.bool,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  layoutType: PropTypes.oneOf(["J", "L"]),
  renderAvatar: PropTypes.func,
};

DimzouCardIV.defaultProps = {
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
};

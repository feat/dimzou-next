import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";
import AvatarStampII from "../avatar/AvatarStampII";

export default function DimzouCardI(props) {
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
      className={classNames("dz-Card_I", {
        "js-clickable": Boolean(restProps.onClick),
      })}
      {...restProps}
    >
      <DimzouCard.ImageWrap
        className={classNames({
          "pull-left": layoutType === "J",
          "pull-right": layoutType === "L",
        })}
      >
        <DimzouCard.Image src={cover} />
      </DimzouCard.ImageWrap>
      <DimzouCard.Title lines={titleLines} ellipsis>
        {title}
      </DimzouCard.Title>
      {showAvatar &&
        author && (
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
      <DimzouCard.Body lines={bodyLines} ellipsis>
        {body}
      </DimzouCard.Body>
    </DimzouCard>
  );
}

DimzouCardI.propTypes = {
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

DimzouCardI.defaultProps = {
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
};

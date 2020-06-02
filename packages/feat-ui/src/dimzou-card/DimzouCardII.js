import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";
import AvatarStampII from "../avatar/AvatarStampII";

export default function DimzouCardII(props) {
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
  const isready = false;
  return (
    <DimzouCard
      className={classNames("dz-Card_II", {
        "js-clickable": Boolean(restProps.onClick),
      })}
      {...restProps}
    >
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

      <DimzouCard.Content>
        <DimzouCard.ImageWrap
          className={classNames({
            "pull-left": layoutType === "J",
            "pull-right": layoutType === "L",
          })}
        >
          <DimzouCard.Image src={cover} />
        </DimzouCard.ImageWrap>
        <DimzouCard.Body lines={bodyLines} ellipsis>
          {body}
        </DimzouCard.Body>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardII.propTypes = {
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

DimzouCardII.defaultProps = {
  layoutType: "J",
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
};

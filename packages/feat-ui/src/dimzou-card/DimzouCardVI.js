import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import DimzouCard from "./DimzouCard";

export default function DimzouCardVI(props) {
  const {
    title,
    body,
    author,
    cover,
    meta,
    titleLines,
    bodyLines,
    ...restProps
  } = props;

  return (
    <DimzouCard
      className={classNames("dz-Card_VI", {
        "js-clickable": Boolean(restProps.onClick),
      })}
      {...restProps}
    >
      <DimzouCard.Title
        lines={titleLines}
        ellipsis
      >
        {title}
      </DimzouCard.Title>
      <DimzouCard.Content>
        {meta && (
          <DimzouCard.MetaWrap>
            {meta}
          </DimzouCard.MetaWrap>
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

DimzouCardVI.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  cover: PropTypes.string,
  author: PropTypes.object,
  meta: PropTypes.node,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
};

DimzouCardVI.defaultProps = {
  titleLines: 2,
  bodyLines: 4,
};

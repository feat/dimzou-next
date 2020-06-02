import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { RectShape, TextBlock, TextRow } from "../placeholder";
import DimzouCard from "./DimzouCard";

export default function DimzouCardVI(props) {
  const { meta, titleLines, bodyLines, imageRatio, ...restProps } = props;

  return (
    <DimzouCard className={classNames("dz-Card_VI")} {...restProps}>
      <DimzouCard.Title lines={titleLines} ellipsis>
        <TextRow randomWidth modifier="title" />
      </DimzouCard.Title>
      <DimzouCard.Content>
        <DimzouCard.MetaWrap>
          <RectShape ratio={imageRatio} />
        </DimzouCard.MetaWrap>
        <DimzouCard.Body lines={bodyLines} ellipsis>
          <TextBlock row={bodyLines} />
        </DimzouCard.Body>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardVI.propTypes = {
  meta: PropTypes.node,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  imageRatio: PropTypes.number,
};

DimzouCardVI.defaultProps = {
  titleLines: 2,
  bodyLines: 4,
  imageRatio: 16 / 4,
};

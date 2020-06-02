import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RectShape, TextBlock, TextRow } from '../placeholder';
import AvatarStampPlaceholder from '../avatar/AvatarStampPlaceholder';
import DimzouCard from './DimzouCard';

export default function DimzouCardV(props) {
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
      className={classNames('dz-Card_V dz-Card_placeholder')}
      {...restProps}
    >
      <DimzouCard.ImageWrap>
        <RectShape ratio={imageRatio} />
      </DimzouCard.ImageWrap>
      <DimzouCard.Content>
        <DimzouCard.ContentWrap>
          <DimzouCard.TTitle>
            <TextRow modifier="title" randomWidth />
          </DimzouCard.TTitle>

          <DimzouCard.Avatar>
            <AvatarStampPlaceholder size={avatarSize} />
          </DimzouCard.Avatar>
          <DimzouCard.TBody>
            <TextBlock row={bodyLines} />
          </DimzouCard.TBody>
        </DimzouCard.ContentWrap>
      </DimzouCard.Content>
    </DimzouCard>
  );
}

DimzouCardV.propTypes = {
  showAvatar: PropTypes.bool,
  titleLines: PropTypes.number,
  bodyLines: PropTypes.number,
  imageRatio: PropTypes.number,
  avatarSize: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'lg']),
  layoutType: PropTypes.oneOf(['J', 'L']),
};

DimzouCardV.defaultProps = {
  layoutType: 'J',
  titleLines: 2,
  bodyLines: 4,
  showAvatar: true,
  imageRatio: 16 / 9,
};

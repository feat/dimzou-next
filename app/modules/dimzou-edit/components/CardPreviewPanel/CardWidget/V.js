import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import AvatarStamp from '@/containers/AvatarStamp';
import { getCardVariables } from '@/components/FeedRender/Card/V';
import { getBaseVariables } from '@/components/FeedRender/Card/utils';
import { FeedRenderContext } from '@/components/FeedRender/Provider';
import FieldTextEditable from './FieldTextEditable';
import CoverDropzone from './CoverDropzone';
import { resetOverflowPosition } from './utils';

function CardV(props) {
  const { title, body, cover, author, onChange } = props;
  const context = useContext(FeedRenderContext);
  const layoutVars = useMemo(
    () => {
      const base = getBaseVariables(context.containerWidth);
      const card = getCardVariables(context.gridWidth);
      return {
        ...base,
        ...card,
      };
    },
    [context],
  );
  return (
    <article
      role="presentation"
      style={layoutVars}
      className="DimzouFeedCard DimzouFeedCard_V dz-CardWidget dz-CardWidget_V"
      onBlur={props.onBlur}
    >
      <h1 className="DimzouFeedCard__title" onBlur={resetOverflowPosition}>
        <FieldTextEditable
          value={title}
          onChange={(value) => {
            onChange({
              field: 'title',
              value,
            });
          }}
        />
      </h1>
      <div className="DimzouFeedCard__avatar">
        <AvatarStamp size="xs" {...author} />
      </div>
      <div className="DimzouFeedCard__coverWrap">
        <CoverDropzone
          className="DimzouFeedCard__cover"
          value={cover}
          canReset={props.coverCanReset}
          onDrop={props.uploadCover}
          onReset={() =>
            onChange({
              field: 'cover',
              value: undefined,
            })
          }
        />
      </div>
      <div className="DimzouFeedCard__content" onBlur={resetOverflowPosition}>
        <FieldTextEditable
          value={body}
          onChange={(value) => {
            onChange({
              field: 'body',
              value,
            });
          }}
        />
      </div>
    </article>
  );
}

CardV.propTypes = {
  author: PropTypes.object.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  cover: PropTypes.string,
  coverCanReset: PropTypes.bool,
  onChange: PropTypes.func,
  uploadCover: PropTypes.func,
};

export default CardV;

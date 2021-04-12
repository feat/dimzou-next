import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import { RectShape, TextBlock } from '@feat/feat-ui/lib/placeholder';
import { FeedRenderContext } from '../Provider';
import {
  useHandleClick,
  getBaseVariables,
  cardPropTypes,
  renderAvatar as defaultAvatarRender,
} from './utils';

const DimzouFeedCardVIII = (props) => {
  const { data, index, onClick, showAvatar } = props;
  const handleClick = useHandleClick([data, onClick]);
  const context = useContext(FeedRenderContext);
  const avatarRender = context.avatarRender || props.avatarRender;

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

  // placeholder
  if (!data) {
    return (
      <article
        style={layoutVars}
        role="presentation"
        className={classNames('DimzouFeedCard DimzouFeedCard_VIII', {
          'has-avatar': showAvatar,
        })}
      >
        <div className="DimzouFeedCard__header">
          <div className="DimzouFeedCard__coverWrap">
            <RectShape ratio={16 / 9} />
          </div>
          <h1 className="DimzouFeedCard__title">
            <TextBlock row={layoutVars['--title-line-clamp']} />
          </h1>
          {showAvatar && (
            <div className="DimzouFeedCard__avatar">{avatarRender({})}</div>
          )}
        </div>
        <div className="DimzouFeedCard__content">
          <TextBlock row={layoutVars['--content-line-clamp']} />
        </div>
      </article>
    );
  }

  const renderData = context.mapData
    ? context.mapData(data, index, DimzouFeedCardVIII.code)
    : data;
  const {
    cover,
    title,
    body,
    author,
    isDraft,
    isTranslation,
    dataSet = {},
  } = renderData;

  return (
    <article
      {...dataSet}
      style={layoutVars}
      role="presentation"
      className={classNames('DimzouFeedCard DimzouFeedCard_VIII', {
        'js-clickable': handleClick,
        'is-draft': isDraft,
        'is-translation': isTranslation,
        'has-avatar': showAvatar,
      })}
      onClick={handleClick}
    >
      <div className="DimzouFeedCard__header">
        <div className="DimzouFeedCard__coverWrap">
          <LazyImage src={cover} />
        </div>
        <h1 className="DimzouFeedCard__title">{title}</h1>
        {showAvatar && (
          <div className="DimzouFeedCard__avatar">
            {avatarRender({
              author,
            })}
          </div>
        )}
      </div>
      <div className="DimzouFeedCard__content">{body}</div>
    </article>
  );
};

export const getCardVariables = (width) => {
  // --cover-width
  const vars = {};
  if (width >= 1000 / 2) {
    vars['--title-font-size'] = '1.5rem';
    vars['--content-font-size'] = '1rem';
  }
  if (width >= 800 / 2) {
    vars['--title-font-size'] = '20px';
    vars['--content-font-size'] = '16px';
  }
  return vars;
};

DimzouFeedCardVIII.propTypes = cardPropTypes;
DimzouFeedCardVIII.defaultProps = {
  showAvatar: true,
  avatarRender: defaultAvatarRender,
};
DimzouFeedCardVIII.code = 'CardVIII';

export default DimzouFeedCardVIII;

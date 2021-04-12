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

const DimzouFeedCardI = (props) => {
  const { data, index, showAvatar, onClick } = props;
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

  // placeholder rendering
  if (!data) {
    return (
      <article
        role="presentation"
        style={layoutVars}
        className={classNames('DimzouFeedCard DimzouFeedCard_I', {
          'has-avatar': showAvatar,
        })}
      >
        <RectShape ratio={16 / 9} />
        <h1 className="DimzouFeedCard__title">
          <TextBlock modifier="title" row={layoutVars['--title-line-clamp']} />
        </h1>
        {showAvatar && (
          <div className="DimzouFeedCard__avatar">{avatarRender({})}</div>
        )}
        <div className="DimzouFeedCard__content">
          <TextBlock row={layoutVars['--content-line-clamp']} />
        </div>
      </article>
    );
  }

  const renderData = context.mapData
    ? context.mapData(data, index, DimzouFeedCardI.code)
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
      className={classNames('DimzouFeedCard DimzouFeedCard_I', {
        'js-clickable': handleClick,
        'is-draft': isDraft,
        'is-translation': isTranslation,
        'has-avatar': showAvatar,
      })}
      onClick={handleClick}
    >
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
      <div className="DimzouFeedCard__content">{body}</div>
    </article>
  );
};

export const getCardVariables = (width) => {
  const vars = {
    '--title-font-size': '16px',
    '--content-font-size': '14px',
  };
  if (width >= 250) {
    vars['--title-font-size'] = '1.5rem';
    vars['--content-font-size'] = '1rem';
  } else if (width >= 200) {
    vars['--title-font-size'] = '16px';
    vars['--content-font-size'] = '14px';
  }
  return vars;
};

DimzouFeedCardI.propTypes = cardPropTypes;
DimzouFeedCardI.defaultProps = {
  showAvatar: true,
  avatarRender: defaultAvatarRender,
};
DimzouFeedCardI.code = 'CardI';

export default DimzouFeedCardI;

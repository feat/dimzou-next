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

const DimzouFeedCardII = (props) => {
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

  if (!data) {
    return (
      <article
        style={layoutVars}
        role="presentation"
        className={classNames('DimzouFeedCard DimzouFeedCard_II', {
          'has-avatar': showAvatar,
        })}
      >
        <RectShape ratio={16 / 9} />
        <h1 className="DimzouFeedCard__title">
          <TextBlock row={layoutVars['--title-line-clamp']} />
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
    ? context.mapData(data, index, DimzouFeedCardII.code)
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
      className={classNames('DimzouFeedCard DimzouFeedCard_II', {
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
    '--content-line-clamp': 2,
  };
  if (width >= 1000 / 3) {
    vars['--title-font-size'] = '1.5rem';
    vars['--content-font-size'] = '1rem';
  } else if (width >= 800 / 3) {
    vars['--title-font-size'] = '20px';
    vars['--content-font-size'] = '16px';
  }
  return vars;
};

DimzouFeedCardII.propTypes = cardPropTypes;
DimzouFeedCardII.defaultProps = {
  showAvatar: true,
  avatarRender: defaultAvatarRender,
};
DimzouFeedCardII.code = 'CardII';

export default DimzouFeedCardII;

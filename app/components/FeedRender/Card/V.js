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

const DimzouFeedCardV = (props) => {
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
        className={classNames('DimzouFeedCard DimzouFeedCard_V', {
          'has-avatar': showAvatar,
        })}
      >
        <h1 className="DimzouFeedCard__title">
          <TextBlock row={layoutVars['--title-line-clamp']} />
        </h1>
        {showAvatar && (
          <div className="DimzouFeedCard__avatar">{avatarRender({})}</div>
        )}
        <div className="DimzouFeedCard__coverWrap">
          <RectShape ratio={16 / 9} />
        </div>
        <div className="DimzouFeedCard__content">
          <TextBlock row={layoutVars['--content-line-clamp']} />
        </div>
      </article>
    );
  }

  const renderData = context.mapData
    ? context.mapData(data, index, DimzouFeedCardV.code)
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
      className={classNames('DimzouFeedCard DimzouFeedCard_V', {
        'js-clickable': handleClick,
        'is-draft': isDraft,
        'is-translation': isTranslation,
        'has-avatar': showAvatar,
      })}
      onClick={handleClick}
    >
      <h1 className="DimzouFeedCard__title">{title}</h1>
      {showAvatar && (
        <div className="DimzouFeedCard__avatar">
          {avatarRender({
            author,
          })}
        </div>
      )}
      <div className="DimzouFeedCard__coverWrap">
        <LazyImage src={cover} />
      </div>
      <div className="DimzouFeedCard__content">{body}</div>
    </article>
  );
};

export const getCardVariables = (width) => {
  const vars = {
    '--title-font-size': '20px',
    '--content-font-size': '14px',
    '--cover-gap': '5px',
    '--content-line-clamp': 4,
  };
  if (width >= 1000 / 2) {
    vars['--title-font-size'] = '1.5rem';
    vars['--content-font-size'] = '1rem';
  } else if (width >= 800 / 2) {
    vars['--title-font-size'] = '20px';
    vars['--content-font-size'] = '16px';
  }
  return vars;
};

DimzouFeedCardV.propTypes = cardPropTypes;
DimzouFeedCardV.defaultProps = {
  showAvatar: true,
  avatarRender: defaultAvatarRender,
};
DimzouFeedCardV.code = 'CardV';

export default DimzouFeedCardV;

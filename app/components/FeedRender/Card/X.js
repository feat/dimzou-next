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

const DimzouFeedCardX = (props) => {
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
        className={classNames('DimzouFeedCard DimzouFeedCard_X', {
          'has-avatar': showAvatar,
        })}
      >
        <div className="DimzouFeedCard__coverWrap">
          <RectShape
            className="DimzouFeedCard__cover ft-Placeholder"
            ratio={16 / 9}
          />
        </div>
        <div className="DimzouFeedCard__inner">
          <h1 className="DimzouFeedCard__title">
            <TextBlock row={layoutVars['--title-line-clamp']} />
          </h1>
          {showAvatar && (
            <div className="DimzouFeedCard__avatar">{avatarRender({})}</div>
          )}
          <div className="DimzouFeedCard__content">
            <TextBlock row={layoutVars['--content-line-clamp']} />
          </div>
        </div>
      </article>
    );
  }

  const renderData = context.mapData
    ? context.mapData(data, index, DimzouFeedCardX.code)
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
      className={classNames('DimzouFeedCard DimzouFeedCard_X', {
        'js-clickable': handleClick,
        'is-draft': isDraft,
        'is-translation': isTranslation,
        'has-avatar': showAvatar,
      })}
      onClick={handleClick}
    >
      <div className="DimzouFeedCard__coverWrap">
        <LazyImage className="DimzouFeedCard__cover" src={cover} />
      </div>
      <div className="DimzouFeedCard__inner">
        <h1 className="DimzouFeedCard__title">{title}</h1>
        {showAvatar && (
          <div className="DimzouFeedCard__avatar">
            {avatarRender({
              author,
            })}
          </div>
        )}
        <div className="DimzouFeedCard__content">{body}</div>
      </div>
    </article>
  );
};

export const getCardVariables = (width) => {
  const vars = {
    '--title-font-size': '26px',
  };
  if (width >= 1300) {
    vars['--title-font-size'] = '3rem';
    vars['--content-font-size'] = '1rem';
  } else if (width >= 1000) {
    vars['--title-font-size'] = '2rem';
    vars['--content-font-size'] = '1rem';
  } else if (width >= 800) {
    vars['--title-font-size'] = '28px';
    vars['--content-font-size'] = '16px';
  }
  return vars;
};

DimzouFeedCardX.propTypes = cardPropTypes;
DimzouFeedCardX.defaultProps = {
  showAvatar: true,
  avatarRender: defaultAvatarRender,
};
DimzouFeedCardX.code = 'CardX';

export default DimzouFeedCardX;

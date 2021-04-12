import { useMemo } from 'react';
import PropTypes from 'prop-types';
import AvatarStamp from '@/containers/AvatarStamp';
import AvatarStampPlaceholder from '@feat/feat-ui/lib/avatar/AvatarStampPlaceholder';

export const useHandleClick = (deps) =>
  useMemo(() => {
    const [data, onClick] = deps;
    if (data && onClick) {
      return () => {
        onClick(data);
      };
    }
    return undefined;
  }, deps);

const CARD_H_GAP = '--card-horizontal-gap';
const CARD_V_GAP = '--card-vertical-gap';
const TITLE_LINE_CLAMP = '--title-line-clamp';
const CONTENT_LINE_CLAMP = '--content-line-clamp';
const TITLE_FONT_SIZE = '--title-font-size';
const CONTENT_FONT_SIZE = '--content-font-size';
const TEXT_FONT_SIZE = '--text-font-size';

// get card base padding, margin based on outer most container width
export const getBaseVariables = (containerWidth) => {
  const vars = {
    [CARD_H_GAP]: '12px',
    [CARD_V_GAP]: '10px',
    [TITLE_LINE_CLAMP]: 2,
    [CONTENT_LINE_CLAMP]: 3,
    [TITLE_FONT_SIZE]: '16px',
    [CONTENT_FONT_SIZE]: '14px',
    [TEXT_FONT_SIZE]: '14px',
  };
  if (containerWidth > 1200) {
    vars[CARD_H_GAP] = '16px';
    vars[CARD_V_GAP] = '14px';
    return vars;
  }
  if (containerWidth > 900) {
    vars[CARD_H_GAP] = '14px';
    vars[CARD_V_GAP] = '10px';
    return vars;
  }
  return vars;
};

export const cardPropTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  showAvatar: PropTypes.bool,
  onClick: PropTypes.func,
};

export function renderAvatar({ author }) {
  if (author) {
    return <AvatarStamp {...author} size="xs" round />;
  }
  return <AvatarStampPlaceholder size="xs" round />;
}

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { getText } from '@/utils/content';
import { getAvatar } from '@/utils/user';

import LineTruncate from '@feat/feat-ui/lib/clamp/LineTruncate';

import AvatarStamp from '@/containers/AvatarStamp';

const colorList = [
  '#00efc7',
  '#26b252',
  '#7d21be',
  '#009cff',
  '#ee135c',
  '#0080d0',
];
const len = colorList.length;

const MostItemComponent = (props) => {
  const { number, title, user, link, prefix, customKey, cover } = props;
  const color = colorList[number % len];
  const maskId = `${prefix}-mostItem__numberMask-${customKey}`;
  const textTitle = getText(title);
  return (
    <li
      className="mostItem js-DimzouCard"
      style={cover ? { backgroundImage: `url(${cover})` } : undefined}
    >
      <div className="mostItem__number">
        <svg viewBox="0 0 48 100" preserveAspectRatio="none">
          <defs>
            <mask id={maskId}>
              <rect fill="#fff" width="100%" height="100%" />
              <text fill="#000000" x="50%" y="50%" fontSize="48px" dy=".35em">
                {number}
              </text>
            </mask>
          </defs>
          <rect
            className="mostItem__maskRect"
            width="100%"
            height="100%"
            fill="#fff"
            mask={`url(#${maskId})`}
          />
          <text
            className="mostItem__numberText"
            fill={color}
            x="50%"
            y="50%"
            fontSize="48px"
            dy=".35em"
          >
            {number}
          </text>
        </svg>
      </div>
      <div className="mostItem__info">
        <Link {...link}>
          <a className="mostItem__title" style={{ color }} title={textTitle}>
            <LineTruncate lines={2} ellipsis>
              {textTitle}
            </LineTruncate>
          </a>
        </Link>
        <div className="mostItem__author">
          <AvatarStamp
            uid={user.uid}
            username={user.username}
            avatar={getAvatar(user, 'md')}
            uiMeta={['expertise']}
            expertise={user.expertise}
            size="xs"
          />
        </div>
      </div>
    </li>
  );
};

MostItemComponent.propTypes = {
  prefix: PropTypes.string,
  number: PropTypes.number,
  cover: PropTypes.string,
  customKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  link: PropTypes.object,
  user: PropTypes.object,
};

export default MostItemComponent;

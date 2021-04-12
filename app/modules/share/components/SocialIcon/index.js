import invariant from 'invariant';
import PropTypes from 'prop-types';

import { ReactComponent as googlePlus } from './assets/google-plus.svg';
import { ReactComponent as facebook } from './assets/facebook.svg';
import { ReactComponent as twitter } from './assets/twitter.svg';
import { ReactComponent as linkedIn } from './assets/linkedin.svg';
import { ReactComponent as weibo } from './assets/weibo.svg';
import { ReactComponent as email } from './assets/email.svg';

const iconMap = {
  googlePlus,
  facebook,
  twitter,
  linkedIn,
  weibo,
  email,
};

export const names = Object.keys(iconMap);

export default function SocialIcon({ name, ...rest }) {
  const Icon = iconMap[name];
  invariant(Icon, `Not related social icon found: ${name}`);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon {...rest} />;
}

SocialIcon.propTypes = {
  name: PropTypes.oneOf(names),
};

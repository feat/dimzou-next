import classNames from 'classnames';
import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const modifierState = ({ namespace, baseName, modifier }) => {
  if (modifier) {
    return `${namespace}-${baseName}_${modifier}`;
  }
  return undefined;
};

const Card = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard',
  displayName: 'HomeCard',
  customProps: ['modifier'],
  state: (props) => {
    const classes = {};
    if (props.modifier) {
      classes[`${props.namespace}-${props.baseName}_${props.modifier}`] = true;
    }
    classes['js-clickable'] = Boolean(props.onClick);
    return classNames(classes);
  },
});
Card.Title = createTemplate({
  Compo: 'h1',
  baseName: 'HomeCard__title',
  displayName: 'HomeCard.Title',
  customProps: ['modifier'],
  state: modifierState,
});
Card.Image = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard__image',
  displayName: 'HomeCard.Image',
});
Card.Content = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard__content',
  displayName: 'HomeCard.Content',
});
Card.Body = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard__body',
  displayName: 'HomeCard.Body',
  customProps: ['modifier'],
  state: modifierState,
});
Card.Extra = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard__extra',
  displayName: 'HomeCard.Extra',
});
Card.Avatar = createTemplate({
  Compo: 'div',
  baseName: 'HomeCard__avatar',
  displayName: 'HomeCard.Avatar',
});

export default Card;

import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const FeedCard = createTemplate({
  Compo: 'article',
  namespace: 'ft',
  baseName: 'FeedCard',
  state: (props) => {
    if (props.onClick) {
      return 'js-clickable';
    }
    return undefined;
  },
  displayName: 'FeedCard',
});

FeedCard.TypeLabel = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__type',
  displayName: 'FeedCard.TypeLabel',
});

FeedCard.Content = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__content',
  displayName: 'FeedCard.Content',
});

FeedCard.Title = createTemplate({
  Compo: 'h1',
  namespace: 'ft',
  baseName: 'FeedCard__title',
  displayName: 'FeedCard.Title',
});

FeedCard.Avatar = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__avatar',
  displayName: 'FeedCard.Avatar',
});

FeedCard.Date = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__date',
  displayName: 'FeedCard.Date',
});

FeedCard.Header = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__header',
  displayName: 'FeedCard.Header',
});
FeedCard.Footer = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'FeedCard__footer',
  displayName: 'FeedCard.Footer',
});

export default FeedCard;

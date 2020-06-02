import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const CommentBoard = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'CommentBoard',
  displayName: 'CommentBoard',
});

CommentBoard.Header = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'CommentBoard__header',
  displayName: 'CommentBoard.Header',
});

CommentBoard.Title = createTemplate({
  Compo: 'h3',
  namespace: 'cm',
  baseName: 'CommentBoard__title',
  displayName: 'CommentBoard.Title',
});

CommentBoard.Content = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'CommentBoard__content',
  displayName: 'CommentBoard.Content',
});

export default CommentBoard;

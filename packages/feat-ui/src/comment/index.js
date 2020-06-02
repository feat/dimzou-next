import createTemplate from "../util/createTemplate";

const Comment = createTemplate({
  Compo: "div",
  baseName: "Comment",
  displayName: "Comment",
  customProps: ["modifier"],
  state: ({ namespace, modifier }) => ({
    [`${namespace}-Comment_${modifier}`]: modifier,
  }),
});
Comment.List = createTemplate({
  Compo: "div",
  baseName: "CommentList",
  customProps: ["noIndent"],
  state: ({ noIndent }) => ({
    "no-indent": noIndent,
  }),
});
Comment.Wrap = createTemplate({
  Compo: "div",
  baseName: "CommentWrap",
  displayName: "Comment.Wrap",
});
Comment.Avatar = createTemplate({
  Compo: "div",
  baseName: "Comment__avatar",
  displayName: "Comment.Avatar",
});
Comment.Main = createTemplate({
  Compo: "div",
  baseName: "Comment__main",
  displayName: "Comment.Main",
});
Comment.Header = createTemplate({
  Compo: "div",
  baseName: "Comment__header",
  displayName: "Comment.Header",
});
Comment.Content = createTemplate({
  Compo: "div",
  baseName: "Comment__content",
  displayName: "Comment.Content",
});
Comment.Footer = createTemplate({
  Compo: "div",
  baseName: "Comment__footer",
  displayName: "Comment.Footer",
});
Comment.Author = createTemplate({
  Compo: "span",
  baseName: "Comment__author",
  displayName: "Comment.Author",
});
Comment.Desc = createTemplate({
  Compo: "span",
  baseName: "Comment__desc",
  displayName: "Comment.Desc",
});
Comment.Meta = createTemplate({
  Compo: "span",
  baseName: "Comment__meta",
  displayName: "Comment.Meta",
});
Comment.Body = createTemplate({
  Compo: "div",
  baseName: "Comment__body",
  displayName: "Comment.Body",
});

export default Comment;

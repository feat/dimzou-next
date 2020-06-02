import classNames from "classnames";
import createTemplate from "../util/createTemplate";

const RecordItem = createTemplate({
  Compo: "div",
  baseName: "RecordItem",
  displayName: "RecordItem",
  customProps: ['hasPic', 'modifier'],
  state: ({ hasPic, namespace, baseName, modifier }) =>
    classNames({
      "has-pic": hasPic,
      [`${namespace}-${baseName}_${modifier}`]: modifier,
    }),
});

RecordItem.Header = createTemplate({
  Compo: "div",
  baseName: "RecordItem__header",
  displayName: "RecordItem.Header",
});

RecordItem.Title = createTemplate({
  Compo: "h3",
  baseName: "RecordItem__title",
  displayName: "RecordItem.Title",
});
RecordItem.Content = createTemplate({
  Compo: "div",
  baseName: "RecordItem__content",
  displayName: "RecordItem.Content",
});

RecordItem.Date = createTemplate({
  Compo: "span",
  baseName: "RecordItem__date",
  displayName: "RecordItem.Date",
});

RecordItem.Desc = createTemplate({
  Compo: "span",
  baseName: "RecordItem__desc",
  displayName: "RecordItem.Desc",
});

RecordItem.ImagePreview = createTemplate({
  Compo: "span",
  baseName: "RecordItem__imagePreview",
  displayName: "RecordItem.ImagePreview",
});

export default RecordItem;

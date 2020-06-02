import createTemplate from "../util/createTemplate";

const Card = createTemplate({
  Compo: "div",
  baseName: "Card",
  displayName: "Card",
});
Card.Title = createTemplate({
  Compo: "h1",
  baseName: "Card__title",
  displayName: "Card.Title",
});
Card.Image = createTemplate({
  Compo: "div",
  baseName: "Card__image",
  displayName: "Card.Image",
});
Card.Content = createTemplate({
  Compo: "div",
  baseName: "Card__content",
  displayName: "Card.Content",
});
Card.Extra = createTemplate({
  Compo: "div",
  baseName: "Card__extra",
  displayName: "Card.Extra",
});
Card.Avatar = createTemplate({
  Compo: "div",
  baseName: "Card__avatar",
  displayName: "Card.Avatar",
});

export default Card;

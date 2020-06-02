import createTemplate from "../util/createTemplate";

const AvatarStamp = createTemplate({
  Compo: "div",
  baseName: "AvatarStamp",
  displayName: "AvatarStamp",
});
AvatarStamp.Avatar = createTemplate({
  Compo: "div",
  baseName: "AvatarStamp__avatar",
  displayName: "AvatarStamp.Avatar",
  state: (props) => ({
    "js-clickable": props.onClick,
  }),
});
AvatarStamp.Info = createTemplate({
  Compo: "div",
  baseName: "AvatarStamp__info",
  displayName: "AvatarStamp.Info",
});
AvatarStamp.Username = createTemplate({
  Compo: "span",
  baseName: "AvatarStamp__username",
  displayName: "AvatarStamp.Username",
  state: (props) => ({
    "js-clickable": props.onClick,
  }),
});
AvatarStamp.Meta = createTemplate({
  Compo: "span",
  baseName: "AvatarStamp__meta",
  displayName: "AvatarStamp.Meta",
});
AvatarStamp.Desc = createTemplate({
  Compo: "span",
  baseName: "AvatarStamp__desc",
  displayName: "AvatarStamp.Desc",
});

export default AvatarStamp;

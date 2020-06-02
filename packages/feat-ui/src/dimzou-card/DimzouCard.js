import React from "react";
import classNames from "classnames";
import withClamp from "../clamp/lib/withClamp";

import createTemplate from "../util/createTemplate";
import { RectShape } from "../placeholder";

import "./style/index.scss";

const DZ_NAMESPACE = "dz";

const DimzouCard = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card",
  displayName: "DzCard",
  customProps: ["isDraft", "isTranslation"],
  state: ({ isDraft, isTranslation }) => ({
    "is-draft": isDraft,
    "is-translation": isTranslation,
  }),
});

const DimzouCardTitle = createTemplate({
  Compo: "h1",
  namespace: DZ_NAMESPACE,
  baseName: "Card__title",
  displayName: "DzCard.Title",
});

const DimzouCardBody = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__body",
  displayName: "DzCard.Body",
});
const DimzouCardContent = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__content",
  displayName: "DzCard.Content",
});

const DimzouCardAvatar = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__avatar",
  displayName: "DzCard.Avatar",
});

const DimzouCardContenWrap = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__contentWrap",
  displayName: "DzCard.ContentWrap",
});

const DimzouCardImageWrap = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__imageWrap",
  displayName: "DzCard.ImageWrap",
});

const DimzouCardMetaWrap = createTemplate({
  Compo: "div",
  namespace: DZ_NAMESPACE,
  baseName: "Card__metaWrap",
  displayName: "DzCard.MetaWrap",
});

class Image extends React.Component {
  static defaultProps = {
    namespace: DZ_NAMESPACE,
  };

  constructor(props) {
    super(props);
    this.state = {
      shouldLoadImage: false,
    };
  }

  render() {
    const { namespace, style, className, src, ...rest } = this.props;
    const mergedStyle = src ? {
      ...style,
      backgroundImage: `url(${src})`,
    } : style;

    return (
      <div
        className={classNames(`${namespace}-Card__image`, className)}
        style={mergedStyle}
        {...rest}
      />
    );
  }
}

const DimzouCardImage = createTemplate({
  Compo: RectShape,
  namespace: DZ_NAMESPACE,
  baseName: "Card__image",
  displayName: "DzCard.Image",
});

DimzouCard.TTitle = DimzouCardTitle;
DimzouCard.TBody = DimzouCardBody;
DimzouCard.Title = withClamp(DimzouCardTitle);
DimzouCard.Body = withClamp(DimzouCardBody);
DimzouCard.Content = DimzouCardContent;
DimzouCard.Avatar = DimzouCardAvatar;
DimzouCard.ImageWrap = DimzouCardImageWrap;
DimzouCard.MetaWrap = DimzouCardMetaWrap;
DimzouCard.ContentWrap = DimzouCardContenWrap;
DimzouCard.Image = Image;
DimzouCard.NAMESPACE = DZ_NAMESPACE;

export default DimzouCard;

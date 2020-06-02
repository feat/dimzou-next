/**
 *
 * FeatModal
 *
 */

import createTemplate from "../util/createTemplate";
// import styled from 'styled-components';
// import classNames from 'classnames';

const FeatModal = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal",
});

FeatModal.Wrap = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal__wrap",
});

FeatModal.Header = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal__header",
});

FeatModal.SubHeader = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal__subHeader",
});

FeatModal.Title = createTemplate({
  Compo: "h3",
  namespace: "ft",
  baseName: "FeatModal__title",
});

FeatModal.Content = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal__content",
});

FeatModal.Footer = createTemplate({
  Compo: "div",
  namespace: "ft",
  baseName: "FeatModal__footer",
});

export default FeatModal;

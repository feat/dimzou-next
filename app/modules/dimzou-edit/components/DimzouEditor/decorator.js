import MultiDecorator from '@feat/feat-editor/lib/libs/MultiDecorator';
// import PrismDecorator from '@feat/feat-editor/lib/plugins/PrismDecorator';
import CodeLineDecorator from '@feat/feat-editor/lib/plugins/CodeLineDecorator';
import AnnotationDecorator from '@feat/feat-editor/lib/plugins/Annotation/AnnotationDecorator';

const decorator = new MultiDecorator([
  // new PrismDecorator({ defaultSyntax: 'javascript' }),
  new CodeLineDecorator(),
  new AnnotationDecorator(),
]);

export default decorator;

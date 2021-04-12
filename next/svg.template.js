function defaultTemplate(
  { types: t, template },
  opts,
  { imports, interfaces, componentName, props, jsx, exports },
) {
  const plugins = ['jsx'];

  if (opts.typescript) {
    plugins.push('typescript');
  }
  const classNameAttr = jsx.openingElement.attributes.find(
    (item) => item.name.name === 'className',
  );
  if (classNameAttr) {
    classNameAttr.value = t.jsxExpressionContainer(
      template.ast(
        `className ? className + ' ${classNameAttr.value.value}' : '${
          classNameAttr.value.value
        }'`,
      ).expression,
    );
  } else {
    jsx.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('className'),
        t.jsxExpressionContainer(t.identifier('className')),
      ),
    );
  }

  jsx.openingElement.attributes.push(
    t.jsxSpreadAttribute(t.identifier('rest')),
  );

  props.push(t.Identifier('props'));

  // console.log(props);

  const typeScriptTpl = template.smart({ plugins });
  return typeScriptTpl.ast`${imports}
  ${interfaces}
  function ${componentName}(${props}) {
    const { className, ...rest } = props;
    return ${jsx};
  }
  ${exports}
    `;
}
module.exports = defaultTemplate;

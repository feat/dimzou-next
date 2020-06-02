export default {
  blocks: [
    {
      key: '30krc',
      text: 'Custom',
      type: 'header-one',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '13g7a',
      text: 'Light text',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 0, length: 10, style: 'LIGHT' },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: '3uds4',
      text:
        'Protégé Desktop supports creation and editing of one or more ontologies in a single workspace via a completely customizable user interface. Visualization tools allow for interactive navigation of ontology relationships. Advanced explanation support aids in tracking down inconsistencies. Refactor operations available including ontology merging, moving axioms between ontologies, rename of multiple entities, and more.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'cdd41',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: '9083s',
      text:
        "Get overviews and more in-depth information about Protégé and ontology development on the Protégé Wiki – the official home for all of our documentation. You'll find FAQs, tutorials, user guides, developer guides, and much more.",
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '90cx8',
      text: 'order list item-01',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'fo63b',
      text: 'order list item 02',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'bu9iv',
      text: 'order list item 03',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '7r8de',
      text:
        "Get overviews and more in-depth information about Protégé and ontology development on the Protégé Wiki – the official home for all of our documentation. You'll find FAQs, tutorials, user guides, developer guides, and much more.",
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '61c59',
      text: 'unorder list item 01',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'eqg0j',
      text: 'unorder list item 02',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '18iom',
      text: 'unorder list item 03',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'cac6h',
      text: 'Get overviews and more in-depth information about Protégé and then.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '89cge',
      text: 'order list item-01',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '8ks01',
      text: 'order list depth 1-1',
      type: 'ordered-list-item',
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'eh8i6',
      text: 'order list depth 1-2',
      type: 'ordered-list-item',
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'e6n2q',
      text: 'order list item 02',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '5q3li',
      text: 'order list item 03',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {
    0: {
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        src: 'https://tpc.googlesyndication.com/simgad/7164956003424764919',
        'data-id': 'DEMO',
        'data-mime-type': 'DEMO_MIMETYPE',
      },
    },
  },
};

export const html = `
<h1>Custom</h1>
<p>Protégé Desktop supports creation and editing of one or more ontologies in a single workspace via a completely customizable user interface. Visualization tools allow for interactive navigation of ontology relationships. Advanced explanation support aids in tracking down inconsistencies. Refactor operations available including ontology merging, moving axioms between ontologies, rename of multiple entities, and more.</p>
<figure><img src="https://tpc.googlesyndication.com/simgad/7164956003424764919" data-id="DEMO" data-mime-type="DEMO_MIMETYPE"/></figure>
<p>Get overviews and more in-depth information about Protégé and ontology development on the Protégé Wiki – the official home for all of our documentation. You'll find FAQs, tutorials, user guides, developer guides, and much more.</p>
<ol>
  <li>order list item-01</li>
  <li>order list item 02</li>
  <li>order list item 03</li>
</ol>
<p>Get overviews and more in-depth information about Protégé and ontology development on the Protégé Wiki – the official home for all of our documentation. You'll find FAQs, tutorials, user guides, developer guides, and much more.</p>
<ul>
  <li>unorder list item 01</li>
  <li>unorder list item 02</li>
  <li>unorder list item 03</li>
</ul>
<p>Get overviews and more in-depth information about Protégé and then.</p>
<ol>
  <li>order list item-01
    <ol>
      <li>order list depth 1-1</li>
      <li>order list depth 1-2</li>
    </ol>
  </li>
  <li>order list item 02</li>
  <li>order list item 03</li>
</ol>
`;

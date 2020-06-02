import { convertToRaw, convertFromRaw } from '@feat/draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

import stateToHTMLConfig from './stateToHTMLConfig';
import stateFromHTMLConfig from './stateFromHTMLConfig';

import { BLOCK_TYPE, ENTITY_TYPE } from '../../../constants';

describe('Annotation stateFromHTML', () => {
  test('Basic HTML', () => {
    const basicHTML = '<p>Basic HTML</p>';
    const contentState = stateFromHTML(basicHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    expect(rawData.blocks.length).toEqual(1);
    expect(rawData.blocks[0].type).toEqual('unstyled');
    expect(rawData.entityMap).toEqual({});
    expect(rawData.blocks[0].text).toEqual('Basic HTML');
  });

  test('Code Block', () => {
    const codeBlockHTML =
      '<pre data-language="javascript"><code data-language="javascript">console.log(123);</code></pre>';
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    expect(rawData.blocks.length).toEqual(1);
    const block = rawData.blocks[0];
    expect(block.type).toEqual('code-block');
    expect(block.data).toEqual({ language: 'javascript' });
  });

  test('Code Block with multiple lines', () => {
    const codeBlockHTML = `<pre data-language="javascript"><code data-language="javascript">const a = 123;
const b = 123;
console.log(a + b); // 246;</code></pre>`;
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual(codeBlockHTML);
  });

  test('Code Block With Html Entities', () => {
    const codeBlockHTML =
      `<pre data-language="javascript"><code data-language="javascript">&lt;span&gt;
123
&lt;/span&gt;</code></pre>`;
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual(codeBlockHTML);
    expect(contentState.getFirstBlock().getText()).toEqual('<span>\n123\n</span>');
  });

  test('Code Block with add annotation', () => {
    const codeBlockHTML =
      '<pre data-language="javascript"><code data-language="javascript">console.log(12<span data-entity-type="annotation:add">// annotation</span>);</code></pre>';
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    expect(rawData.blocks.length).toEqual(1);
    const block = rawData.blocks[0];
    expect(block.type).toEqual('code-block');
    expect(block.data).toEqual({ language: 'javascript' });
    expect(rawData.entityMap).toEqual({
      0: {
        type: 'annotation:add',
        mutability: 'MUTABLE',
        data: {
          entityType: 'annotation:add',
        },
      },
    });
  });

  test('Code Block with delete annotation', () => {
    const codeBlockHTML =
      '<pre data-language="javascript"><code data-language="javascript">console.log(12<span data-entity-type="annotation:delete">3</span>);</code></pre>';
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    expect(rawData.blocks.length).toEqual(1);
    const block = rawData.blocks[0];
    expect(block.type).toEqual('code-block');
    expect(block.data).toEqual({ language: 'javascript' });
    expect(rawData.entityMap).toEqual({
      0: {
        type: 'annotation:delete',
        mutability: 'MUTABLE',
        data: {
          entityType: 'annotation:delete',
        },
      },
    });
  });

  test('Code Block with HTML', () => {
    const codeBlockHTML =
      '<pre data-language="html"><code data-language="html">&lt;div&gt;test&lt;/div&gt;</code></pre>';
    const contentState = stateFromHTML(codeBlockHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    expect(rawData.blocks.length).toEqual(1);
    const block = rawData.blocks[0];
    expect(block.text).toEqual('<div>test</div>');
    expect(block.type).toEqual('code-block');
    expect(block.data).toEqual({ language: 'html' });
  });

  test('Header Block Type', () => {
    const blockTypeHTML = `
      <h1>Header One</h1>
      <h2>Header Two</h2>
      <h3>Header Three</h3>
      <h4>Header Four</h4>
      <h5>Header Five</h5>
      <h6>Header Six</h6>
    `;

    const contentState = stateFromHTML(blockTypeHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    expect(blocks[0].type).toEqual('header-one');
    expect(blocks[0].text).toEqual('Header One');

    expect(blocks[1].type).toEqual('header-two');
    expect(blocks[1].text).toEqual('Header Two');

    expect(blocks[2].type).toEqual('header-three');
    expect(blocks[2].text).toEqual('Header Three');

    expect(blocks[3].type).toEqual('header-four');
    expect(blocks[3].text).toEqual('Header Four');

    expect(blocks[4].type).toEqual('header-five');
    expect(blocks[4].text).toEqual('Header Five');

    expect(blocks[5].type).toEqual('header-six');
    expect(blocks[5].text).toEqual('Header Six');
  });

  test('Unordered List Item Block 01', () => {
    const listHTML = `
      <ul>
        <li>item 01</li>
        <li>item 02</li>
      </ul>
    `;

    const contentState = stateFromHTML(listHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    expect(blocks.length).toEqual(2);
    expect(blocks[0].type).toEqual(BLOCK_TYPE.UNORDERED_LIST_ITEM);
  });

  test('Unordered List Item Block 02', () => {
    const listHTML = `
      <ul>
        <li>
          item 01
          <ul>
            <li>SubList 01</li>
          </ul>
        </li>
        <li>item 02</li>
      </ul>
    `;

    const contentState = stateFromHTML(listHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    expect(blocks.length).toEqual(3);
    expect(blocks[0].type).toEqual(BLOCK_TYPE.UNORDERED_LIST_ITEM);
    expect(blocks[1].type).toEqual(BLOCK_TYPE.UNORDERED_LIST_ITEM);
    expect(blocks[1].depth).toEqual(1);
    expect(blocks[1].text).toEqual('SubList 01');
  });

  test('Ordered List Item Block 01', () => {
    const listHTML = `
      <ol>
        <li>item 01</li>
        <li>item 02</li>
      </ol>
    `;

    const contentState = stateFromHTML(listHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    expect(blocks.length).toEqual(2);
    expect(blocks[0].type).toEqual(BLOCK_TYPE.ORDERED_LIST_ITEM);
  });

  test('Ordered List Item Block 02', () => {
    const listHTML = `
      <ul>
        <li>
          item 01
          <ol>
            <li>SubList 01</li>
          </ol>
        </li>
        <li>item 02</li>
      </ul>
    `;

    const contentState = stateFromHTML(listHTML, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    expect(blocks.length).toEqual(3);
    expect(blocks[0].type).toEqual(BLOCK_TYPE.UNORDERED_LIST_ITEM);
    expect(blocks[1].type).toEqual(BLOCK_TYPE.ORDERED_LIST_ITEM);
    expect(blocks[1].depth).toEqual(1);
    expect(blocks[1].text).toEqual('SubList 01');
  });

  // jsDom have no dataset;
  // test('Data Attribute Transform', () => {
  //   const html = '<p data-is-summary="true">This is a summary block</p>';
  //   const contentState = stateFromHTML(html, stateFromHTMLConfig);
  //   const rawData = convertToRaw(contentState);
  //   const blocks = rawData.blocks;
  //   expect(blocks[0].data).toEqual({
  //     isSummary: true,
  //   });
  // });

  test('Atomic Image Block', () => {
    const atomicBock = `
      <figure>
        <img src="http://demo.com/image.jpg" data-id="1" data-mime-type="image/jpeg" />
      </figure>
    `;
    const contentState = stateFromHTML(atomicBock, stateFromHTMLConfig);
    const rawData = convertToRaw(contentState);
    const blocks = rawData.blocks;
    const entityMap = rawData.entityMap;
    const entity = entityMap[Object.keys(entityMap)[0]];
    expect(blocks.length).toEqual(1);
    expect(blocks[0].type).toEqual(BLOCK_TYPE.ATOMIC);
    expect(entity.type).toEqual(ENTITY_TYPE.IMAGE);
    expect(entity.data).toEqual({
      'data-id': '1',
      'data-mime-type': 'image/jpeg',
      src: 'http://demo.com/image.jpg',
    });
  });
});

describe('Annotation stateToHTML', () => {
  test('basic', () => {
    const rawData = {
      blocks: [{ type: BLOCK_TYPE.UNSTYLED, text: 'baisc text' }],
      entityMap: {},
    };
    const contentState = convertFromRaw(rawData);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual('<p>baisc text</p>');
  });

  test('Code Block', () => {
    const rawData = {
      blocks: [
        { type: BLOCK_TYPE.CODE_BLOCK, text: 'console.log(123);', data: { syntax: 'javascript' } },
      ],
      entityMap: {},
    };
    const contentState = convertFromRaw(rawData);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual(
      '<pre data-language="javascript"><code data-language="javascript">console.log(123);</code></pre>',
    );
  });

  test('Code Block With Tags', () => {
    const rawData = {
      blocks: [{ type: BLOCK_TYPE.CODE_BLOCK, text: '<div>test</div>', data: { syntax: 'html' } }],
      entityMap: {},
    };
    const contentState = convertFromRaw(rawData);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual(
      '<pre data-language="html"><code data-language="html">&lt;div&gt;test&lt;/div&gt;</code></pre>',
    );
  });

  test('Atomic Block', () => {
    const rawData = {
      blocks: [
        {
          type: BLOCK_TYPE.ATOMIC,
          text: ' ',
          entityRanges: [
            {
              offset: 0,
              length: 1,
              key: 1,
            },
          ],
        },
      ],
      entityMap: {
        1: {
          type: ENTITY_TYPE.IMAGE,
          mutability: 'IMMUTABLE',
          data: {
            src: 'http://demo.com/image.jpg',
            'data-id': '1',
            'data-mime-type': 'image/jpeg',
          },
        },
      },
    };
    const contentState = convertFromRaw(rawData);
    const outputHTML = stateToHTML(contentState, stateToHTMLConfig);
    expect(outputHTML).toEqual(
      '<figure><img src="http://demo.com/image.jpg" data-id="1" data-mime-type="image/jpeg"/></figure>',
    );
  });

  // TODO: List Item Blocks
});

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EditorBlock, ContentBlock } from '@feat/draft-js';
import DraftEditorLeaf from '@feat/draft-js/lib/DraftEditorLeaf.react';
import DraftOffsetKey from '@feat/draft-js/lib/DraftOffsetKey';

function isBlockOnSelectionEdge(
  selection,
  key,
) {
  return (
    selection.getAnchorKey() === key ||
    selection.getFocusKey() === key
  );
}

class CodeBlock extends EditorBlock {
  _renderChildren() {
    const block = this.props.block;
    const blockKey = block.getKey();
    const text = block.getText();
    const lastLeafSet = this.props.tree.size - 1;
    const hasSelection = isBlockOnSelectionEdge(this.props.selection, blockKey);

    const children = this.props.tree.map((leafSet, ii) => {
      const leavesForLeafSet = leafSet.get('leaves');
      const lastLeaf = leavesForLeafSet.size - 1;
      const leaves = leavesForLeafSet.map((leaf, jj) => {
        const offsetKey = DraftOffsetKey.encode(blockKey, ii, jj);
        const start = leaf.get('start');
        const end = leaf.get('end');
        return (
          /* $FlowFixMe(>=0.53.0 site=www,mobile) This comment suppresses an
           * error when upgrading Flow's support for React. Common errors found
           * when upgrading Flow's React support are documented at
           * https://fburl.com/eq7bs81w */
          <DraftEditorLeaf
            key={offsetKey}
            offsetKey={offsetKey}
            block={block}
            start={start}
            selection={hasSelection ? this.props.selection : undefined}
            forceSelection={this.props.forceSelection}
            text={text.slice(start, end)}
            styleSet={block.getInlineStyleAt(start)}
            customStyleMap={this.props.customStyleMap}
            customStyleFn={this.props.customStyleFn}
            isLast={ii === lastLeafSet && jj === lastLeaf}
          />
        );
      }).toArray();

      const decoratorKey = leafSet.get('decoratorKey');
      if (decoratorKey == null) {
        return leaves;
      }

      if (!this.props.decorator) {
        return leaves;
      }

      const decorator = this.props.decorator;
      // var decorator = nullthrows(this.props.decorator);

      const DecoratorComponent = decorator.getComponentForKey(decoratorKey);
      if (!DecoratorComponent) {
        return leaves;
      }

      const decoratorProps = decorator.getPropsForKey(decoratorKey);
      const decoratorOffsetKey = DraftOffsetKey.encode(blockKey, ii, 0);
      const decoratedText = text.slice(
        leavesForLeafSet.first().get('start'),
        leavesForLeafSet.last().get('end'),
      );

      // Resetting dir to the same value on a child node makes Chrome/Firefox
      // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/
      const dir = 'ltr';
      // var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(
      //   UnicodeBidi.getDirection(decoratedText),
      //   this.props.direction,
      // );

      return (
        <DecoratorComponent
          {...decoratorProps}
          contentState={this.props.contentState}
          decoratedText={decoratedText}
          dir={dir}
          key={decoratorOffsetKey}
          entityKey={block.getEntityAt(leafSet.get('start'))}
          offsetKey={decoratorOffsetKey}
        >
          {leaves}
        </DecoratorComponent>
      );
    }).toArray();

    let start = 0;
    const lines = [];
    for (let cursor = 1; cursor < children.length; cursor += 1) {
      const target = children[cursor];
      if (target.props && target.props.lineBreak) {
        lines.push(<span className="line" key={`line-${target.props.num}`}>
          {children.slice(start, cursor + 1)}
        </span>);
        start = cursor + 1;
      }
    }
    const item = children.slice(start);

    lines.push(<span
      className={classNames('line', {
        'is-empty': item.length === 0,
      })}
      key="last"
    >{item}</span>);


    return (
      <React.Fragment>
        <div className={classNames('public-DraftStyleDefault-codeBlock-content', this.props.className)}>
          {lines}
        </div>
        <div contentEditable={false} className="public-DraftStyleDefault-codeBlock-hint">
          Press <kbd>⌘</kbd> + <kbd>Enter</kbd> to exit.
        </div>
      </React.Fragment>
    );
  }
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  blockProps: PropTypes.shape({
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    setReadOnly: PropTypes.func,
  }).isRequired,
};

export default CodeBlock;

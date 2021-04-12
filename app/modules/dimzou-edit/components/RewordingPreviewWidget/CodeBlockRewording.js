import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CodeRewording extends React.PureComponent {
  componentDidMount() {
    if (this.codeDom) {
      const node = this.codeDom.querySelector('pre code');
      if (node) {
        const lines = node.innerHTML
          .split('\n')
          .map((line) => `<span class="line">${line}</span>`);
        this.codeDom.innerHTML = lines.join('\n');
      }
    }
  }

  render() {
    const { html_content } = this.props.data;
    return (
      <div
        className={classNames('dz-Typo', this.props.className)}
        onClick={this.props.onClick}
        ref={(n) => {
          this.dom = n;
        }}
      >
        <div className="dz-CodeBlock">
          <pre
            className="dz-CodeBlock__content"
            ref={(n) => {
              this.codeDom = n;
            }}
            dangerouslySetInnerHTML={{ __html: html_content }}
          />
        </div>
      </div>
    );
  }
}

CodeRewording.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CodeRewording;

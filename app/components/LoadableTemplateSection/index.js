import React from 'react';
import PropTypes from 'prop-types';
import * as TemplatePlaceholders from '../FeedTemplatePlaceholder';
import * as Templates from '../FeedTemplate';

class LoadableTemplateSection extends React.PureComponent {
  componentDidMount() {
    if (!this.props.initialized && !this.props.loading) {
      this.props.loader();
    }
  }

  render() {
    const { template } = this.props;

    if (!template) {
      return null;
    }

    const TemplatePlaceholder = TemplatePlaceholders[template];
    const Template = Templates[template];
    if (!this.props.initialized || this.props.loading) {
      return (
        <TemplatePlaceholder

          className={this.props.className}
        />
      );
    }

    return (
      <Template
        className={this.props.className}
        items={this.props.items}
        itemProps={{
          onClick: this.props.onItemClick,
        }}
      />
    );
  }
}

LoadableTemplateSection.propTypes = {
  loader: PropTypes.func.isRequired,
  // title: PropTypes.string,
  // link: PropTypes.string,
  template: PropTypes.string,
  className: PropTypes.string,
  initialized: PropTypes.bool,
  loading: PropTypes.bool,
  items: PropTypes.array,
  onItemClick: PropTypes.func,
};

export default LoadableTemplateSection;

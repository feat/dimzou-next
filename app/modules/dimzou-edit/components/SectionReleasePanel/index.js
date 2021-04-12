import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Router from 'next/router';

import ReleasePanel from '../ReleasePanel';
import { selectWorkspaceState } from '../../selectors';
import { exitSectionRelease, asyncSectionRelease } from '../../actions';
import { getAsPath } from '../../utils/router';

class SectionReleasePanel extends React.PureComponent {
  handleCancel = () => {
    this.props.dispatch(exitSectionRelease());
  };

  handleRelease = async (data) => {
    const { context, dispatch } = this.props;
    // TO_ENHANCE: 明确 title, summary 的数据来源
    return dispatch(
      asyncSectionRelease({
        bundleId: context.bundleId,
        nodeId: context.nodeId,
        titleId: context.titleId,
        category: data.category || context.basicInfo.category,
        applyScenes: data.applyScenes || context.basicInfo.applyScenes,
        title: context.basicInfo.title || get(data.cards, ['_base', 'title']),
        summary: get(data.cards, ['_base', 'body']),
        cover: this.file,
        cards: data.cards,
      }),
    ).then((pub) => {
      const href = {
        pathname: '/dimzou-edit',
        query: {
          pageName: 'view',
          bundleId: pub.bundle_id,
          nodeId: pub.node_id,
        },
      };
      Router.push(href, getAsPath(href));
    });
  };

  handleFileUpload = (file) => {
    if (!this.file) {
      this.file = file;
    }
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        const url = reader.result;
        resolve({ url });
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    return (
      <ReleasePanel
        target={this.props.context.basicInfo}
        onCancel={this.handleCancel}
        onSubmit={this.handleRelease}
        onFileUpload={this.handleFileUpload}
      />
    );
  }
}

SectionReleasePanel.propTypes = {
  dispatch: PropTypes.func,
  context: PropTypes.object,
};

const mapStateToProps = (state) => ({
  context: selectWorkspaceState(state).sectionReleaseContext,
});

export default connect(mapStateToProps)(SectionReleasePanel);

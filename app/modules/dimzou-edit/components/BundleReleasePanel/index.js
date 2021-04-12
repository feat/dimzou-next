import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ReleasePanel from '../ReleasePanel';
import { selectWorkspaceState } from '../../selectors';
import {
  asyncPreRelease,
  asyncRelease,
  exitRelease,
  asyncSetApplyScenes,
} from '../../actions';
import { NODE_TYPE_COVER } from '../../constants';
import dzMessages, { release as rMessages } from '../../messages';

class BundleReleasePanel extends React.PureComponent {
  handleCancel = () => {
    this.props.dispatch(exitRelease());
  };

  handleRelease = async (data) => {
    const { context, dispatch } = this.props;
    const bundleId = context.bundle.id;
    const nodeIds = context.nodes.map((item) => item.id);
    // validate
    await dispatch(
      asyncPreRelease({
        bundleId,
        data: nodeIds,
      }),
    );

    if (data.applyScenes && data.applyScenes.length) {
      await dispatch(
        asyncSetApplyScenes({
          bundleId,
          data: data.applyScenes.map((item) => item.label),
        }),
      );
    }

    const releaseConfig = {
      nodes: context.nodes.map((n) => n.id),
      category: data.category || context.basicInfo.category,
    };

    if (data.cards && Object.keys(data.cards).length) {
      releaseConfig.cards = data.cards;
    }
    await dispatch(
      asyncRelease({
        bundleId,
        data: releaseConfig,
      }),
    );

    const pubUrl = `${window.location.origin}/dimzou/${bundleId}`;
    window.open(pubUrl);
  };

  renderReleaseError = (releaseError) => {
    let content;
    if (releaseError.code === 'VALIDATION_EXCEPTION') {
      const { nodes } = this.props.context;
      content = (
        <div style={{ margin: '0px 24px' }}>
          <p>
            <TranslatableMessage message={rMessages.validationFailed} />
          </p>
          {Object.entries(releaseError.data.errors).map(([id, eMessages]) => {
            const node = nodes.find((item) => String(item.id) === String(id));
            if (!node) {
              logging.warn('can not find related node', id);
              return null;
            }
            return (
              <div className="dz-ValidationSection" key={id}>
                <h3 className="dz-ValidationSection__title">
                  {node.text_title || (
                    <TranslatableMessage
                      message={
                        node.type === NODE_TYPE_COVER
                          ? dzMessages.emptyCoverPlaceholder
                          : dzMessages.emptyTitlePlaceholder
                      }
                    />
                  )}
                </h3>
                <ul className="dz-ValidationSection__info">
                  {Object.values(eMessages).map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
    } else {
      content = (
        <div style={{ margin: '0px 24px' }}>{releaseError.message}</div>
      );
    }
    return content;
  };

  render() {
    return (
      <ReleasePanel
        target={this.props.context.basicInfo}
        onCancel={this.handleCancel}
        onSubmit={this.handleRelease}
        renderReleaseError={this.renderReleaseError}
      />
    );
  }
}

BundleReleasePanel.propTypes = {
  dispatch: PropTypes.func,
  context: PropTypes.object,
};

const mapStateToProps = (state) => ({
  context: selectWorkspaceState(state).releaseContext,
});

export default connect(mapStateToProps)(BundleReleasePanel);

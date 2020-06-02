import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import message from '@feat/feat-ui/lib/message';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { formatMessage } from '@/services/intl';

import rMessages from '../../messages';

import ChapterCard from './ChapterCard';
import './style.scss';
import { NODE_TYPE_COVER } from '../../../../constants';

export default class ReleaseNodeSelect extends React.PureComponent {
  state = {
    selected: this.props.selected,
  }

  handleConfirm = () => {
    this.props.onConfirm(this.state.selected);
  }

  toggleSelect = (node) => {
    const index = this.state.selected.findIndex((s) => s.id === node.id);
    if (index === -1) {
      this.setState({
        selected: [
          ...this.state.selected,
          node,
        ],
      })
    } else {
      if (node.node_type === NODE_TYPE_COVER && !node.node_publish_time) {
        message.info(formatMessage(rMessages.coverShouldReleaseForInit))
        return;
      }
      this.setState({
        selected: [
          ...this.state.selected.slice(0, index),
          ...this.state.selected.slice(index+1),
        ],
      });
    }
  }

  render() {
    const { nodes } = this.props;
    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={rMessages.nodeToRelease} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <div style={{ marginTop: 20, paddingLeft: 20, display: 'flex', flexWrap: 'wrap' }}>
              {nodes.map((node) => (
                node.is_deleted ? null : (
                  <ChapterCard 
                    isSelected={!!this.state.selected.find((s) => s.id === node.id)}
                    key={node.id} 
                    onClick={() => {
                      this.toggleSelect(node);
                    }}
                    title={node.text_title}
                    summary={node.text_summary}
                    oncePublished={!!node.node_publish_time}
                    hasUpdate={node.node_publish_time && (
                      new Date(node.updated_at) - new Date(node.node_publish_time) > 0
                    )}
                  />
                )
              ))}
            </div>
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="ok-btn"
              size="md"
              onClick={this.handleConfirm}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    )
  }
}



ReleaseNodeSelect.propTypes = {
  nodes: PropTypes.array,
  selected: PropTypes.array,
  onConfirm: PropTypes.func,
}
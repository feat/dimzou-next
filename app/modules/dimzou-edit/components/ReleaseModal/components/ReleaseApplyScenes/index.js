import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import TagGroupInput from '@/components/TagGroupInput';
import ActionButton from '@/components/ActionButton';
import { getApplyScenes } from '../../../../requests';
import rMessages from '../../messages';

function fetchAsyncOptions(value) {
  return getApplyScenes(value).then(({ data }) =>
    data.map((item) => ({
      data: {
        value: item.label,
        label: item.label,
      },
      key: value,
    })),
  );
}

class ReleaseApplyScenes extends React.PureComponent {
  state = {
    value: this.props.data || [],
  };

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  getTagLabel = (item) => item.label;

  getValueCount = (value) => value.length;

  handleAddItem(origin, item) {
    return [...origin, item];
  }

  handleRemoveItem(origin, index) {
    return [...origin.slice(0, index), ...origin.slice(index + 1)];
  }

  handleChange = (value) => {
    this.setState({ value });
  };

  handleConfirm = () => {
    this.props.onConfirm(this.state.value);
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    return (
      <FeatModal fixedHeight>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={rMessages.applyScenes} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <div style={{ marginTop: 20 }}>
              <TagGroupInput
                ref={(n) => {
                  this.input = n;
                }}
                placeholder={formatMessage(rMessages.applyScenePlaceholder)}
                value={this.state.value}
                onChange={this.handleChange}
                getTagLabel={this.getTagLabel}
                getValueCount={this.getValueCount}
                addItem={this.handleAddItem}
                removeItem={this.handleRemoveItem}
                asyncOptions={fetchAsyncOptions}
              />
            </div>
          </FeatModal.Content>
          <FeatModal.Footer>
            <ActionButton
              type="ok"
              size="md"
              data-type="action"
              data-button-style="icon"
              onClick={this.handleConfirm}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }
}

ReleaseApplyScenes.propTypes = {
  data: PropTypes.array,
  onConfirm: PropTypes.func,

  intl: PropTypes.object,
};

export default injectIntl(ReleaseApplyScenes, { forwardRef: true });

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@feat/feat-ui/lib/button';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import InlineCarouselSelect from '@/components/InlineCarouselSelect';
import FlatSelect from '@feat/feat-ui/lib/flat-select';

// import { Row, Col } from '@feat/feat-ui/lib/grid';

import AddCategoryWidget from '../AddCategoryWidget';

import intlMessages from './messages';

import './style.scss';

class CategorySelectModal extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    if (this.props.isConfirming !== nextProps.isConfirming) {
      return true;
    }
    return false;
  }

  syncCategory = (category) => {
    const { tree } = this.props;
    let rootIndex;
    let secondaryIndex;
    const rootCategory =
      tree.find((item, i) => {
        rootIndex = i;
        return item.id === category.parent_id;
      }) ||
      tree.find((item, i) => {
        rootIndex = i;
        return item.children.some((sub, j) => {
          secondaryIndex = j;
          return sub.id === category.parent_id;
        });
      });
    if (!rootCategory) {
      logging.warn('No Root Category', { category });
      return {};
    }
    const state = {};
    state.rootCategory = rootCategory;
    state.rootCategoryIndex = rootIndex;

    if (secondaryIndex > -1) {
      state.secondaryCategory = rootCategory.children[secondaryIndex];
      state.secondaryCategoryIndex = secondaryIndex;
      state.category = category;
      state.categoryIndex = state.secondaryCategory.children.findIndex(
        (item) => item.id === category.id,
      );
    } else if (rootCategory.id === category.parent_id) {
      state.secondaryCategoryIndex = state.rootCategory.children.findIndex(
        (item) => item.id === category.id,
      );
      state.secondaryCategory = state.rootCategory.children[state.secondaryCategoryIndex];
    } else {
      logging.warn('should handle error');
    }
    return state;
  };

  getInitState() {
    const state = {};
    if (this.props.category) {
      return this.syncCategory(this.props.category);
    }

    const rootCategory = this.props.tree[0];
    state.rootCategory = rootCategory;
    state.rootCategoryIndex = 0;
    state.secondaryCategoryIndex = 0;
    state.secondaryCategory = rootCategory.children && rootCategory.children[0];
    state.category = this.props.category;
    state.categoryList = this.props.categorySelected;
    return state;
  }

  state = this.getInitState();

  handleRootCategoryChange = (rootCategory, rootCategoryIndex) => {
    if (this.state.rootCategory.id === rootCategory.id) {
      return;
    }
    this.setState({
      rootCategory,
      rootCategoryIndex,
      secondaryCategory: rootCategory.children && rootCategory.children[0],
      secondaryCategoryIndex: 0,
    });
  };

  handleSecondaryCategoryChange = (
    secondaryCategory,
    secondaryCategoryIndex,
  ) => {
    if (this.state.secondaryCategory.id === secondaryCategory.id) {
      return;
    }
    this.setState({
      secondaryCategory,
      secondaryCategoryIndex,
    });
  };

  handleCategoryChange = (category) => {
    if (this.state.category && this.state.category.id === category.id) {
      this.setState({
        category: undefined,
      });
    } else {
      this.setState({
        category,
      });
    }
  };

  // options: { parentId: integer, name: string }
  handleCreateCategory = (options) => {
    const isSeconaryCreate = options.parentId === this.state.rootCategory.id;
    return this.props.createCategory(options).then((category) => {
      this.setState(this.syncCategory(category));
      if (isSeconaryCreate) {
        this.secondaryCreateWidget.reset();
      } else {
        this.tertiaryCreateWidget.reset();
      }
    });
  };

  handleConfirm = (e) => {
    e.preventDefault();
    const { secondaryCategory, category } = this.state;
    if (
      !category &&
      secondaryCategory.children &&
      secondaryCategory.children.length === 0
    ) {
      this.props.onConfirm({
        category: secondaryCategory,
      });
    } else {
      this.props.onConfirm({
        category,
      });
    }
  };

  renderRootSelect() {
    const { tree, renderCategoryLabel } = this.props;
    return (
      <div className="CategorySelect__rootSelect">
        <InlineCarouselSelect
          options={tree}
          value={
            this.state.rootCategory ? this.state.rootCategory.id : undefined
          }
          onChange={this.handleRootCategoryChange}
          renderLabel={renderCategoryLabel}
          valueExtractor={(item) => item.id}
        />
      </div>
    );
  }

  renderSecondarySelect() {
    const { tree, renderCategoryLabel, canCreate } = this.props;
    const { rootCategoryIndex } = this.state;
    const rootCategory = tree[rootCategoryIndex];
    const secondaryCats = rootCategory.children;
    return (
      <div className="CategorySelect__secondarySelect">
        {secondaryCats.map((item, index) => (
          <div key={item.id} className="CategorySelect__secondaryOption">
            <Button
              type="merge"
              className={classNames({
                'is-selected': item.id === this.state.secondaryCategory.id,
              })}
              onClick={() => this.handleSecondaryCategoryChange(item, index)}
            >
              {renderCategoryLabel(item)}
            </Button>
          </div>
        ))}
        {canCreate && (
          <AddCategoryWidget
            ref={(n) => {
              this.secondaryCreateWidget = n;
            }}
            newLabel={<TranslatableMessage message={intlMessages.newLabel} />}
            parent={rootCategory}
            onSubmit={this.handleCreateCategory}
          />
        )}
      </div>
    );
  }

  renderTertiarySelect() {
    const { tree, renderCategoryLabel, canCreate } = this.props;
    const { rootCategoryIndex, secondaryCategoryIndex } = this.state;
    const rootCategory = tree[rootCategoryIndex];
    const secondaryCategory = rootCategory.children[secondaryCategoryIndex];
    const cats = secondaryCategory.children;
    return (
      <div className="CategorySelect__tertiarySelect">
        {cats.map((item, index) => (
          <div className="CategorySelect__category">
            <Button
              type="merge"
              className={classNames({
                'is-selected':
                  this.state.category && item.id === this.state.category.id,
              })}
              onClick={() => this.handleCategoryChange(item, index)}
            >
              {renderCategoryLabel(item)}
            </Button>
          </div>
        ))}
        {canCreate && (
          <div className="CategorySelect__category">
            <AddCategoryWidget
              ref={(n) => {
                this.tertiaryCreateWidget = n;
              }}
              parent={secondaryCategory}
              onSubmit={this.handleCreateCategory}
            />
          </div>
        )}
      </div>
    );
  }

  renderTertiaryMultiple() {
    const { tree, renderCategoryLabel, canCreate } = this.props;
    const { rootCategoryIndex, secondaryCategoryIndex } = this.state;
    const rootCategory = tree[rootCategoryIndex];
    const secondaryCategory = rootCategory.children[secondaryCategoryIndex];
    const cats = secondaryCategory ? secondaryCategory.children : [];
    return (
      <div>
        <FlatSelect
          multiple
          value={this.state.categoryList}
          onChange={(value) => {
            this.setState({ categoryList: value });
            this.props.handleChange(value);
          }}
          className="CategorySelect__tertiarySelect"
        >
          {cats.map((item) => (
            <div
              key={item.id}
              value={item}
              className="CategorySelect__category"
            >
              <Button
                type={
                  this.state.categoryList.indexOf(item) === -1
                    ? 'merge'
                    : 'primary'
                }
              >
                {renderCategoryLabel(item)}
              </Button>
            </div>
          ))}
        </FlatSelect>
        {canCreate && (
          <div className="CategorySelect__category">
            <AddCategoryWidget
              ref={(n) => {
                this.tertiaryCreateWidget = n;
              }}
              parent={secondaryCategory}
              onSubmit={this.handleCreateCategory}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { onCancel } = this.props;

    return (
      <FeatModal className="CategorySelect">
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.title} />
            </FeatModal.Title>
            <FeatModal.SubHeader>{this.renderRootSelect()}</FeatModal.SubHeader>
          </FeatModal.Header>
          <FeatModal.Content className="CategorySelect__main">
            <div className="CategorySelect__secondaryPanel">
              {this.renderSecondarySelect()}
            </div>
            <div className="CategorySelect__tertiaryPanel">
              {this.props.isAdvertiser
                ? this.renderTertiaryMultiple()
                : this.renderTertiarySelect()}
            </div>
          </FeatModal.Content>
          <FeatModal.Footer>
            {onCancel && (
              <IconButton
                className="margin_r_24"
                svgIcon="no-btn"
                size="md"
                onClick={onCancel}
              />
            )}
            {this.props.isAdvertiser ? null : (
              <IconButton
                svgIcon="ok-btn"
                size="md"
                onClick={this.handleConfirm}
              />
            )}
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }
}

CategorySelectModal.propTypes = {
  category: PropTypes.object,
  tree: PropTypes.array.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
  renderCategoryLabel: PropTypes.func,
  canCreate: PropTypes.bool,
  isConfirming: PropTypes.bool,
  categorySelected: PropTypes.array,
  isAdvertiser: PropTypes.bool,
  handleChange: PropTypes.func,
};

CategorySelectModal.defaultProps = {
  renderCategoryLabel: (item) => (
    <TranslatableMessage
      message={{ id: `category.${item.slug}`, defaultMessage: item.name }}
    />
  ),
  canCreate: true,
};

export default CategorySelectModal;

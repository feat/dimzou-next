import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import message from '@feat/feat-ui/lib/message';
import Button from '@feat/feat-ui/lib/button';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import InlineCarouselSelect from '@/components/InlineCarouselSelect';
import ActionButton from '@/components/ActionButton';

import AddCategoryWidget from '@/modules/category/components/AddCategoryWidget';

import dzMessages from '../../messages';
import './style.scss';

class CategoryPanel extends React.Component {
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
      state.secondaryCategory =
        state.rootCategory.children[state.secondaryCategoryIndex];
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
    return this.props
      .createCategory(options)
      .then((category) => {
        this.setState(this.syncCategory(category));
        if (isSeconaryCreate) {
          this.secondaryCreateWidget && this.secondaryCreateWidget.reset();
        } else {
          this.tertiaryCreateWidget && this.tertiaryCreateWidget.reset();
        }
      })
      .catch(() => {
        // do nothing.
      });
  };

  handleSubmit = (e) => {
    e && e.preventDefault();
    const { secondaryCategory, category } = this.state;
    if (
      !category &&
      secondaryCategory.children &&
      secondaryCategory.children.length === 0
    ) {
      this.props.onSubmit(secondaryCategory);
    } else if (this.props.categoryRequired && !category) {
      message.error(
        this.props.intl.formatMessage(dzMessages.selectCategoryHint),
      );
    } else {
      this.props.onSubmit(category);
    }
  };

  renderRootSelect() {
    const { tree, renderCategoryLabel } = this.props;
    return (
      <div className="dz-CategoryPanel__rootSelect">
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
      <div className="dz-CategoryPanel__secondarySelect">
        {secondaryCats.map((item, index) => (
          <div key={item.id} className="dz-CategoryPanel__secondaryOption">
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
            newLabel={
              <TranslatableMessage message={dzMessages.newCategoryHint} />
            }
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
    if (!secondaryCategory) {
      return null;
    }
    const cats = secondaryCategory.children;
    return (
      <div className="dz-CategoryPanel__tertiarySelect">
        {cats.map((item, index) => (
          <div className="dz-CategoryPanel__category" key={item.id}>
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
          <div className="dz-CategoryPanel__category" key="create">
            <AddCategoryWidget
              ref={(n) => {
                this.tertiaryCreateWidget = n;
              }}
              newLabel={
                <TranslatableMessage message={dzMessages.newCategoryHint} />
              }
              parent={secondaryCategory}
              onSubmit={this.handleCreateCategory}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { onCancel, onTerminate } = this.props;

    return (
      <div className="dz-ReleasePanel dz-CategoryPanel">
        <div className="dz-ReleasePanel__header">
          <div className="dz-ReleasePanel__title">
            <TranslatableMessage message={dzMessages.categoryLabel} />
          </div>
          <div className="dz-ReleasePanel__subHeader">
            {this.renderRootSelect()}
          </div>
          {onTerminate && (
            <SquareButton
              className="dz-ReleasePanel__exitBtn"
              type="dashed"
              onClick={onTerminate}
            >
              &times;
            </SquareButton>
          )}
        </div>
        <div className="dz-ReleasePanel__content dz-CategoryPanel__content">
          <div className="dz-CategoryPanel__left">
            {this.renderSecondarySelect()}
          </div>
          <div className="dz-CategoryPanel__right">
            {this.renderTertiarySelect()}
          </div>
        </div>
        <div className="dz-ReleasePanel__footer">
          <div className="dz-ReleasePanel__actions">
            {onCancel && (
              <ActionButton
                className="margin_r_24"
                type="no"
                size="sm"
                onClick={onCancel}
              />
            )}
            <ActionButton type="ok" size="sm" onClick={this.handleSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

CategoryPanel.propTypes = {
  category: PropTypes.object, // initial selected.
  tree: PropTypes.array.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onTerminate: PropTypes.func,
  createCategory: PropTypes.func, // promise
  renderCategoryLabel: PropTypes.func,
  canCreate: PropTypes.bool,
  categoryRequired: PropTypes.bool,
  intl: PropTypes.object,
};

CategoryPanel.defaultProps = {
  renderCategoryLabel: (item) => (
    <TranslatableMessage
      message={{ id: `category.${item.slug}`, defaultMessage: item.name }}
    />
  ),
  canCreate: true,
  categoryRequired: true,
};

export default injectIntl(CategoryPanel);

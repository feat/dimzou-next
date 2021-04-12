import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import CategoryPanel from '../CategoryPanel';
import ApplyScenesPanel from '../ApplyScenesPanel';
import CardPreviewPanel from '../CardPreviewPanel';
import ReleaseSuccessPanel from './ReleaseSuccessPanel';
import ReleasingPanel from './ReleasingPanel';
import ReleaseErrorPanel from './ReleaseErrorPanel';
import './style.scss';

class ReleasePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: this.getSteps(props.target),
      current: 0,
      isReleasing: false,
      releaseSucceeded: false,
      releaseError: null,
      data: this.getInitailData(props.target),
    };
    this.element = document.createElement('div');
    this.element.classList.add('dz-ReleasePanelWrap');
  }

  componentDidMount() {
    document.body.appendChild(this.element);
    this.bodyOverflow = document.body.style.overflow;
    this.bodyHeight = document.body.style.height;
    document.body.style.overflow = 'hidden'; // ADD THIS LINE
    document.body.style.height = '100%'; // ADD THIS LINE
  }

  componentWillUnmount() {
    document.body.removeChild(this.element);
    document.body.style.overflow = this.bodyOverflow; // ADD THIS LINE
    document.body.style.height = this.bodyHeight; // ADD THIS LINE
  }

  getInitailData(target) {
    return {
      category: target.category,
      applyScenes: target.applyScenes,
      cards: {},
    };
  }

  getSteps(target) {
    const steps = [];
    if (!target.category) {
      steps.push('category');
    }
    if (!target.applyScenes || !target.applyScenes.length) {
      steps.push('applyScenes');
    }
    steps.push('cardPreview');
    return steps;
  }

  getCardBaseInfo() {
    const { target } = this.props;

    return {
      author: target.author,
      cover: target.cover,
      title: target.title,
      body: target.summary,
    };
  }

  prevStep = () => {
    const prev = this.state.steps[this.state.current - 1];
    if (!prev) {
      this.props.onCancel();
    } else {
      this.setState((prev) => ({
        current: prev.current - 1,
      }));
    }
  };

  nextStep = () => {
    const next = this.state.steps[this.state.current + 1];
    if (!next) {
      this.handleRelease();
    } else {
      this.setState((prev) => ({
        current: prev.current + 1,
      }));
    }
  };

  handleCategory = (category) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          category,
        },
      },
      this.nextStep,
    );
  };

  handleApplyScenes = (applyScenes) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          applyScenes,
        },
      },
      this.nextStep,
    );
  };

  handleApplyScenes = (applyScenes) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          applyScenes,
        },
      },
      this.nextStep,
    );
  };

  handleCardPreview = (cards) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          cards,
        },
      },
      this.nextStep,
    );
  };

  handleRelease = () => {
    this.setState({
      isReleasing: true,
    });
    this.props
      .onSubmit(this.state.data)
      .then(() => {
        this.setState({
          isReleasing: false,
          releaseSucceeded: true,
        });
      })
      .catch((err) => {
        this.setState({
          releaseError: err,
        });
      });
  };

  renderReleasingStatus() {
    return <ReleasingPanel />;
  }

  renderReleaseError() {
    const { releaseError } = this.state;
    const { renderReleaseError } = this.props;

    const content = renderReleaseError(releaseError);

    return (
      <ReleaseErrorPanel onTerminate={this.props.onCancel} content={content} />
    );
  }

  renderReleaseSucceeded() {
    return (
      <ReleaseSuccessPanel
        onClose={this.props.onCancel}
        autoCloseCountDown={5}
      />
    );
  }

  renderPanel() {
    const {
      steps,
      current,
      isReleasing,
      releaseSucceeded,
      releaseError,
    } = this.state;
    if (releaseError) {
      return this.renderReleaseError();
    }
    if (isReleasing) {
      return this.renderReleasingStatus();
    }
    if (releaseSucceeded) {
      return this.renderReleaseSucceeded();
    }
    const step = steps[current];
    switch (step) {
      case 'category':
        return (
          <CategoryPanel
            category={this.state.data.category}
            onCancel={this.prevStep}
            onSubmit={this.handleCategory}
            onTerminate={this.props.onCancel}
          />
        );
      case 'applyScenes':
        return (
          <ApplyScenesPanel
            applyScenes={this.state.data.applyScenes}
            onCancel={this.prevStep}
            onSubmit={this.handleApplyScenes}
            onTerminate={this.props.onCancel}
            required
          />
        );
      case 'cardPreview':
        return (
          <CardPreviewPanel
            baseInfo={this.getCardBaseInfo()}
            data={this.state.data.cards}
            onCancel={this.prevStep}
            onSubmit={this.handleCardPreview}
            onFileUpload={this.props.onFileUpload}
          />
        );
      default:
        return <div>Unknown Step: {current}</div>;
    }
  }

  render() {
    return createPortal(this.renderPanel(), this.element);
  }
}

ReleasePanel.propTypes = {
  target: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onFileUpload: PropTypes.func,
  renderReleaseError: PropTypes.func,
};

ReleasePanel.defaultProps = {
  renderReleaseError: (err) => <div>{err.message}</div>,
  onFileUpload: (file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        const url = reader.result;
        resolve({ url });
      };
      reader.readAsDataURL(file);
    });
  },
};

export default ReleasePanel;

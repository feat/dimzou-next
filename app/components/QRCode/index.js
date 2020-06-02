import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import QRCode from 'qrcode';

import './index.scss';

class QRCodeCompo extends Component {
  state = {};

  componentDidMount() {
    QRCode.toDataURL(
      this.props.text,
      {
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (err) {
          this.setState({ err });
        } else {
          this.setState({
            url,
          });
        }
      },
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames('QRCodeContainer', className)}>
        {this.state.url && <img alt={this.props.title} src={this.state.url} />}
        {this.state.err && <span>Error</span>}
      </div>
    );
  }
}

QRCodeCompo.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string,
};

export default QRCodeCompo;

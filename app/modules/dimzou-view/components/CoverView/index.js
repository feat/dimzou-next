import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import LazyImage from '@feat/feat-ui/lib/lazy-image';
import CoverTemplate from '@/modules/dimzou-edit/components/CoverTemplate';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { copyright as cpMessages } from '@/modules/dimzou-edit/messages';
import { getUsername } from '@/utils/user';
import { selectPublication } from '../../selectors';

import './style.scss';

class CoverView extends React.Component {
  componentDidMount() {
    if (!this.props.publication && this.props.loader) {
      this.props.loader();
    }
  }

  render() {
    const { publication, bundleId } = this.props;
    if (!publication) {
      if (!this.props.loader) {
        return <div>No Data To Render</div>;
      }
      if (this.props.loading) {
        return this.props.loading;
      }
      return <div>loading...</div>;
    }

    return (
      <CoverTemplate 
        className='typo-Article'
        data-link={`/dimzou/${bundleId}`}
        cover={
          <LazyImage src={publication.cover} ratio={20 / 9} />
        }
        title={
          <h1>{publication.title}</h1>
        }
        summary={
          <div
            className='typo-Article__summary'
            dangerouslySetInnerHTML={{ __html: publication.summary }}
          />
        }
        author={getUsername(publication.author)}
        copyright={
          <TranslatableMessage 
            message={cpMessages.year} 
            values={{
              year: new Date(publication.updated_at).getFullYear(),
            }}
          />
        }
      />
    )
  }
}

CoverView.propTypes = {
  // publicationId: PropTypes.string,
  publication: PropTypes.object,
  loader: PropTypes.func,
  loading: PropTypes.node,
  bundleId: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  publication: selectPublication,
});

export default connect(mapStateToProps)(CoverView);

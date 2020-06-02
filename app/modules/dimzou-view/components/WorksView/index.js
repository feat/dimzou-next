import React from 'react';
import PropTypes from 'prop-types';

// import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import BackButton from '@/components/BackButton';

import ViewWork from '../ViewWork';
import './style.scss'


function WorksView(props) {
  const { nodes, loaded } = props;
  const publicationId = loaded[nodes[0].id];
  
  return (
    <div className="p-WorksView">
      <ViewWork publicationId={publicationId} />
      <BackButton  />
    </div>
  );
}

WorksView.propTypes = {
  nodes: PropTypes.array,
  loaded: PropTypes.object,
};

export default WorksView;

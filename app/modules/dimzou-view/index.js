/**
 * Dimzou 阅读页面
 * 数据加载流程：
 *   1. 获取出版物数据
 */

import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import injectReducer from '@/utils/injectReducer';
import BundleMetaProvider from './providers/BundleMetaProvider';
import PublicationContentProvider from './providers/PublicationContentProvider';
import ScrollContextProvider from './providers/ScrollContextProvider';

import PublicationViewer from './components/PublicationViewer';
import PublicationMeta from './components/PublicationMeta';

import { REDUCER_KEY } from './config';
import reducer from './reducer';

function DimzouView(props) {
  return (
    <BundleMetaProvider bundleId={props.bundleId}>
      <PublicationContentProvider
        bundleId={props.bundleId}
        nodeId={props.nodeId}
      >
        <ScrollContextProvider>
          <PublicationMeta bundleId={props.bundleId} nodeId={props.nodeId} />
          <PublicationViewer bundleId={props.bundleId} nodeId={props.nodeId} />
        </ScrollContextProvider>
      </PublicationContentProvider>
    </BundleMetaProvider>
  );
}

DimzouView.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const withReducer = injectReducer({ key: REDUCER_KEY, reducer });

export default compose(withReducer)(DimzouView);

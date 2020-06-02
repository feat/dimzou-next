import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { compose } from 'redux';

import injectSaga from '@/utils/injectSaga';
import { DAEMON } from '@/utils/constants';
import BackButton from '@/components/BackButton';
import {
  selectWorkspaceState,
} from './selectors';
import { REDUCER_KEY } from './reducers';
import saga from './sagas';
import { WorkspaceContext } from './context'

import DimzouApp from './components/App';
import ScrollContextProvider from './providers/ScrollContextProvider';

const isTrue = (value) => value === true || value === 'true'

function DimzouEdit(props) {
  const { bundleId, nodeId, userId, isCreate, invitationCode, isPublicationView, hash } = props;
  const workspace = useSelector(selectWorkspaceState);
  const combined = useMemo(() => ({
    ...workspace,
    bundleId,
    nodeId,
    userId,
    hash,
    isCreate: isTrue(isCreate),
    invitationCode,
    isPublicationView: isTrue(isPublicationView),
  }), [workspace, bundleId, nodeId, userId, hash, isCreate, invitationCode, isPublicationView]);

  return (
    <WorkspaceContext.Provider value={combined}>
      <ScrollContextProvider>
        <DimzouApp />
        {!combined.userId && <BackButton />}
      </ScrollContextProvider>
    </WorkspaceContext.Provider>
  )
}

DimzouEdit.propTypes = {
  bundleId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isCreate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  isPublicationView: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  invitationCode: PropTypes.string,
  hash: PropTypes.string,
}


const withSaga = injectSaga({ key: REDUCER_KEY, saga, mode: DAEMON });

export default compose(
  withSaga,
)(DimzouEdit);
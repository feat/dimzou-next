import { compose } from 'redux';

import injectReducer from '@/utils/injectReducer';
import injectSaga from '@/utils/injectSaga';

import { DAEMON } from '@/utils/constants';
import reducer, { REDUCER_KEY } from './reducers';
import saga from './sagas';
import { AppContext } from './context';

import DimzouApp from './components/App';

function DimzouEdit(props) {
  // TO_ENHANCE: 封装路由更新方法

  return (
    <AppContext.Provider value={props}>
      <DimzouApp />
    </AppContext.Provider>
  );
}

DimzouEdit.propTypes = {
  // pageName: PropTypes.oneOf(['create', 'draft', 'user', 'dashboard', 'view']),
};

const withSaga = injectSaga({ key: REDUCER_KEY, saga, mode: DAEMON });
const withReducer = injectReducer({ key: REDUCER_KEY, reducer });

export default compose(
  withReducer,
  withSaga,
)(DimzouEdit);

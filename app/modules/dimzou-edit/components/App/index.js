import { useContext } from 'react';
import { AppContext } from '../../context';

import Draft from '../Draft';
import Publication from '../Publication';
import Creation from '../Creation';
import Dashboard from '../Dashboard';
import UserPage from '../UserPage';

import './style.scss';

function DimzouApp() {
  const appState = useContext(AppContext);
  const { pageName, ...rest } = appState;

  switch (pageName) {
    case 'create':
      return (
        <div className="dz-App">
          <Creation {...rest} />
        </div>
      );
    case 'view':
      return (
        <div className="dz-App">
          <Publication {...rest} />
        </div>
      );
    case 'draft':
      return (
        <div className="dz-App">
          <Draft {...rest} />
        </div>
      );
    case 'user':
      return (
        <div className="dz-App">
          <UserPage {...rest} />
        </div>
      );
    case 'dashboard':
      return (
        <div className="dz-App">
          <Dashboard {...rest} />
        </div>
      );
    default:
      return <div>Unknown Route: {appState.pageName}</div>;
  }
}

export default DimzouApp;

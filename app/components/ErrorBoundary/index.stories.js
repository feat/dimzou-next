import { useState } from 'react';
import ErrorBoundary from './index';
export default {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [],
};

const ErrorCompo = (props) => <div>{props.notDefined.name}</div>;

export const Preview = () => {
  const [open, setOpen] = useState(false);
  return (
    <ErrorBoundary>
      <button
        className="ft-Button"
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Click to throw an error
      </button>
      {open && <ErrorCompo />}
    </ErrorBoundary>
  );
};
Preview.args = {};

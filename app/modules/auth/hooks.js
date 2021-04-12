import { useSelector } from 'react-redux';
import { selectCurrentUser } from './selectors';

export function useCurrentUser() {
  return useSelector(selectCurrentUser);
}

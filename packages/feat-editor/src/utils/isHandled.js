import { HANDLED } from '../constants';

export default function isHandled(value) {
  return value === HANDLED || value === true;
}

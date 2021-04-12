import groupBy from 'lodash/groupBy';
import { BUNDLE_STATUS_PUBLISHED } from '../constants';

export function getVersionLabel(bundle) {
  if (!bundle) {
    return '';
  }
  if (bundle.draft_version > 1 || bundle.copy_version) {
    return `${bundle.draft_version}.${bundle.copy_version}`;
  }
  return '';
}

export function isOriginBundle(bundle) {
  return bundle.draft_version === 1 && !bundle.copy_version;
}

export const groupByStatus = (items) =>
  groupBy(
    items,
    (bundle) =>
      bundle.status === BUNDLE_STATUS_PUBLISHED ? 'published' : 'draft',
  );

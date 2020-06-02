import {
  PUB_TYPE_COLLECTION,
  PUB_TYPE_WORK,
} from '@/modules/publication/constants';

import { maxTextContent } from '@/utils/content';
import { getImage } from '@/utils/pics';

export function mapFeedData(items) {
  return items.map((item, index) => ({
    title: maxTextContent(item.title),
    body: maxTextContent(item.content),
    author: item.author,
    kind: item.entity_type,
    id: `${item.entity_type}_${item.entity_id}`,
    cover: getImage(item.cover_images, 'cover_sm', item.cover_image),
    isDraft: item.is_draft,
    type: item.type,
    isTranslation: item.type === 'translate',
    'data-track-anchor': `${item.entity_type}_${item.entity_id}_${item.title}`,
    'data-anchor-type': 'FeedItem',
    'data-ad-dropbox': 'DropBox',
    'data-ad-index': index,
    meta: {
      link: getPageLink(item),
    },
    // isDraft: !item.publishedRevision
  }));
}

export function getPageLink(item) {
  switch (item.entity_type) {
    case 'publication':
      if (
        item.pub_type === PUB_TYPE_COLLECTION ||
        item.pub_type === PUB_TYPE_WORK
      ) {
        return {
          href: {
            pathname: '/dimzou-view',
            query: { bundleId: item.bundle_id },
          },
          as: `/dimzou/${item.bundle_id}`,
        };
      }
      return {
        href: {
          pathname: '/dimzou-view',
          query: {
            bundleId: item.bundle_id,
            nodeId: item.node_id,
          },
        },
        as: `/dimzou/${item.bundle_id}/${item.node_id}`,
      };
    case 'node':
      // return `/draft/${item.bundle_id}/${item.node_sort}`;
      return {
        href: {
          pathname: '/dimzou-edit',
          query: { bundledId: item.bundle_id },
        },
        as: `/draft/${item.bundle_id}`,
      };
    case 'awesome':
      return {
        href: {
          pathname: '/user-profile',
          query: { userId: item.entity_id },
        },
        as: `/profile/${item.entity_id}`,
      };
    case 'demand':
      return {
        href: {
          pathname: '/opportunity-detail',
          query: { id: item.entity_id },
        },
        as: `/opportunity/${item.entity_id}`,
      };
    default:
      return {
        as: `/${item.entity_type}/${item.entity_id}`,
      };
  }
}

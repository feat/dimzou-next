import get from 'lodash/get';

import { maxTextContent } from '@/utils/content';
import getAppLink from '@/utils/getAppLink';
import { getImage } from '@/utils/pics';

export function mapPublication(records) {
  if (!records) {
    return undefined;
  }
  return records.map((item) => ({
    key: `publication_${item.id}`,
    customKey: `publication_${item.id}`,
    user: item.author,
    link: getAppLink(item, 'dimzou_publication'),
    cover: getImage(item.covers, 'cover_sm', item.cover),
    title: maxTextContent(item.title) || maxTextContent(item.summary, 20),
  }));
}

export function mapFeedData(item, index, template) {
  const title = get(
    item.cardsInfo,
    [template, 'title'],
    maxTextContent(item.title),
  );
  const body = get(
    item.cardsInfo,
    [template, 'body'],
    maxTextContent(item.content),
  );
  const cover = get(
    item.cardsInfo,
    [template, 'cover'],
    get(
      item.cardsInfo,
      ['_base', 'cover'],
      getImage(item.cover_images, 'cover_sm', item.cover_image),
    ),
  );

  return {
    id: `${item.entity_type}_${item.entity_id}`,
    type: item.type,
    kind: item.entity_type,
    title,
    body,
    cover,
    author: item.author,
    isDraft: item.is_draft,
    isTranslation: item.type === 'translate',
    dataSet: {
      'data-track-anchor': `${item.entity_type}_${item.entity_id}_${
        item.title
      }`,
      'data-anchor-type': 'FeedItem',
      'data-ad-dropbox': 'DropBox',
      'data-ad-index': index,
    },
  };
}

export function shouldShowLoading(blockState) {
  return !blockState.onceFetched || !blockState.data || blockState.loading;
}

// export function mapBundle(records) {
//   if (!records) {
//     return undefined;
//   }
//   return records.map((item) => ({
//     key: `dimzouBundle_${item.id}`,
//     customKey: `dimzouBundle_${item.id}`,
//     user: item.user,
//     link: item.is_published ? `/dimzou/${item.id}` : `/draft/${item.id}`,
//     cover: item.cover_image,
//     title: item.title,
//   }));
// }

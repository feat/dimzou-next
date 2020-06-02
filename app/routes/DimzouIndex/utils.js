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

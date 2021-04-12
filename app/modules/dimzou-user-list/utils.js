import { getImage } from '@/utils/pics';
import { CONTENT_TYPE_TRANSLATE } from '@/modules/dimzou-edit/constants';

export function mapFeedTemplateFields(item) {
  return {
    title: item.title,
    body: item.summary,
    author: item.user,
    kind: 'dimzou_bundle',
    id: item.id,
    cover: item.cover_images
      ? getImage(item.cover_images, 'cover_sm')
      : item.cover_image,
    isDraft: !item.publish_time,
    isTranslation: item.type === CONTENT_TYPE_TRANSLATE,
  };
}

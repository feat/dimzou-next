import articleDefaultCover from './images/articleCover.png';
import questionDefaultCover from './images/questionCover.png';
import postDefaultCover from './images/postCover.png';
import sentenceTruncate from '../../utils/sentenceTruncate';

export default function mapEntities(items) {
  return items.map((item) => {
    switch (item.kind) {
      case 'article':
        return {
          title: item.title,
          body: item.summary || sentenceTruncate(item.content, 2),
          author: item.author,
          kind: item.kind,
          id: item.id,
          cover: item.coverImage || articleDefaultCover,
          isDraft: !item.publishedRevision,
        };
      case 'question':
        return {
          title: item.title,
          body: sentenceTruncate(item.content, 2),
          author: item.author,
          kind: item.kind,
          id: item.id,
          cover: item.coverImage || questionDefaultCover,
        };
      case 'post':
        return {
          title: item.title,
          body: sentenceTruncate(item.content, 2),
          author: item.author,
          kind: item.kind,
          id: item.id,
          cover: item.coverImage || postDefaultCover,
        };
      case 'dimzou':
        return {
          title: item.textTitle,
          body: item.textSummary,
          author: item.user,
          kind: item.kind,
          id: item.id,
          cover: item.coverImage || postDefaultCover,
          isDraft: !item.publishedAt,
          isTranslation: item.type === 'translate',
        };
      case 'dimzou_bundle':
        return {
          title: item.title,
          body: item.summary,
          author: item.user,
          kind: item.kind,
          id: item.id,
          cover: item.cover_image,
          isDraft: !item.is_published,
          isTranslation: item.content_type === 2, // 2 => translate
        };
      default:
        return {
          title: `Unkown Kind ${item.kind}`,
          id: item.id,
        };
    }
  });
}

export default function mapEntities(items) {
  return items.map((item) => {
    switch (item.kind) {
      case 'dimzou':
        return {
          title: item.textTitle,
          body: item.textSummary,
          author: item.user,
          kind: item.kind,
          id: item.id,
          cover: item.coverImage,
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

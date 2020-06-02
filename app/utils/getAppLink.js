export default function getAppLink(item, kind) {
  const itemKind = kind || item.kind;
  switch (itemKind) {
    case 'dimzou_publication':
      if (item.pub_type === 101) {
        // CHAPTER PUBLICATION
        return {
          href: {
            pathname: '/dimzou-view',
            query: {
              bundleId: item.bundle_id,
              nodeId: item.node_id,
            },
          },
          as: `/dimzou/${item.bundle_id}/${item.node_id}`,
        }
      }
      return {
        href: {
          pathname: '/dimzou-view',
          query: {
            bundleId: item.bundle_id,
          },
        },
        as: `/dimzou/${item.bundle_id}`,
      }
    case 'user':
      return {
        href: {
          pathname: '/user-profile',
          query: {
            userId: item.uid,
          },
        },
        as: `/profile/${item.bundle_id}`,
      }
    case 'awesome':
      return {
        href: {
          pathname: '/user-profile',
          query: {
            userId: item.uid,
          },
        },
        as: `/profile/${item.bundle_id}`,
      }
    default:
      return {
        href: `/${itemKind}/${item.id}`,
        as: `/${itemKind}/${item.id}`,
      };
  }
}

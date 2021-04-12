export const fetchFeedItems = ({ id, params }) => ({
  url: `/api/feed/items/${id}/`,
  method: 'GET',
  params,
});

export const listSlug = ({ name }) => {
  if (!name) return null;
  return name
    .split(/\W+/)
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('-')
    .toLowerCase()
    .substring(0, 10);
};

export const listUrl = ({ listId, ...list }) => (
  `/lists/${listId}/${listSlug(list)}`
);

export const paginateItems = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export const calculateTotalPages = (items, pageSize) =>
  Math.max(1, Math.ceil(items.length / pageSize));

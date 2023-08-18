export function pageCount(total, perPage = 18) {
  return Math.ceil(total / perPage);
}

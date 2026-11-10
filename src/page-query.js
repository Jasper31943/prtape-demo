/**
 * Plan a catalog page query.
 *
 * Contract:
 * - `page` is a 1-based integer >= 1. Page 1 is the first page.
 * - `pageSize` is an integer >= 1 and is the maximum page length.
 * - `offset` is the zero-based index of the first record on that page:
 *   `(page - 1) * pageSize`.
 * - `totalPages` is 0 when `totalItems` is 0. Otherwise it is
 *   `Math.ceil(totalItems / pageSize)`.
 * - `page` and `pageSize` that are not integers >= 1 throw TypeError.
 * - `totalItems` must be an integer >= 0.
 */
export function planPageQuery(totalItems, query) {
  if (!Number.isInteger(totalItems) || totalItems < 0) {
    throw new TypeError("totalItems must be an integer >= 0");
  }

  const page = query?.page;
  const pageSize = query?.pageSize;
  assertPageArg(page, "page");
  assertPageArg(pageSize, "pageSize");

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    totalItems,
    totalPages,
  };
}

function assertPageArg(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${name} must be an integer >= 1`);
  }
}

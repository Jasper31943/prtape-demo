import { planPageQuery } from "./page-query.js";

/**
 * In-memory catalog. `page` returns records in stored order.
 * Callers receive copies of the stored records.
 */
export function createCatalog(records) {
  if (!Array.isArray(records)) {
    throw new TypeError("records must be an array");
  }

  const stored = records.map((record) => ({ ...record }));

  return {
    page(query) {
      const plan = planPageQuery(stored.length, query);
      const end = Math.min(plan.offset + plan.limit, stored.length - 1);
      return {
        items: stored.slice(plan.offset, end).map((record) => ({ ...record })),
        page: plan.page,
        pageSize: plan.pageSize,
        totalItems: plan.totalItems,
        totalPages: plan.totalPages,
      };
    },
  };
}

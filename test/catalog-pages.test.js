import assert from "node:assert/strict";
import test from "node:test";

import { createCatalog } from "../src/catalog.js";
import { planPageQuery } from "../src/page-query.js";

function parts(count) {
  return Array.from({ length: count }, (_, index) => ({
    sku: `SKU-${String(index + 1).padStart(3, "0")}`,
    name: `Part ${index + 1}`,
  }));
}

test("plans a 1-based window and an exact page count", () => {
  assert.deepEqual(planPageQuery(10, { page: 2, pageSize: 4 }), {
    page: 2,
    pageSize: 4,
    offset: 4,
    limit: 4,
    totalItems: 10,
    totalPages: 3,
  });
  assert.equal(planPageQuery(8, { page: 1, pageSize: 4 }).totalPages, 2);
  assert.equal(planPageQuery(0, { page: 1, pageSize: 4 }).totalPages, 0);
  assert.equal(planPageQuery(0, { page: 1, pageSize: 4 }).offset, 0);
});

test("rejects a page number that is not an integer >= 1", () => {
  const catalog = createCatalog(parts(3));
  for (const page of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => catalog.page({ page, pageSize: 2 }), TypeError);
  }
});

test("rejects a page size that is not an integer >= 1", () => {
  const catalog = createCatalog(parts(3));
  for (const pageSize of [0, -4, 2.5, Number.NaN]) {
    assert.throws(() => catalog.page({ page: 1, pageSize }), TypeError);
  }
});

test("returns a full first page", () => {
  const all = parts(10);
  const result = createCatalog(all).page({ page: 1, pageSize: 4 });
  assert.deepEqual(result.items, all.slice(0, 4));
  assert.equal(result.items.length, 4);
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 4);
  assert.equal(result.totalItems, 10);
  assert.equal(result.totalPages, 3);
});

test("returns a later full page intact", () => {
  const all = parts(10);
  const result = createCatalog(all).page({ page: 2, pageSize: 4 });
  assert.deepEqual(result.items, all.slice(4, 8));
  assert.equal(result.items.length, 4);
});

test("partial last page includes every remaining record", () => {
  const all = parts(10);
  const result = createCatalog(all).page({ page: 3, pageSize: 4 });
  assert.equal(result.totalPages, 3);
  assert.deepEqual(result.items, all.slice(8, 10));
  assert.equal(result.items.at(-1).sku, "SKU-010");
});

test("exact multiple: the last page is full and includes the final record", () => {
  const all = parts(8);
  const result = createCatalog(all).page({ page: 2, pageSize: 4 });
  assert.equal(result.totalPages, 2);
  assert.deepEqual(result.items, all.slice(4, 8));
  assert.equal(result.items.length, 4);
  assert.equal(result.items.at(-1).sku, "SKU-008");
});

test("exact multiple that fits on a single page returns every record", () => {
  const all = parts(4);
  const result = createCatalog(all).page({ page: 1, pageSize: 4 });
  assert.equal(result.totalPages, 1);
  assert.deepEqual(result.items, all);
});

test("a short catalog still returns every record on page 1", () => {
  const all = parts(3);
  const result = createCatalog(all).page({ page: 1, pageSize: 10 });
  assert.equal(result.totalPages, 1);
  assert.deepEqual(result.items, all);
});

test("empty catalog: page 1 is empty and totalPages is 0", () => {
  const result = createCatalog([]).page({ page: 1, pageSize: 5 });
  assert.deepEqual(result.items, []);
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 5);
  assert.equal(result.totalItems, 0);
  assert.equal(result.totalPages, 0);
});

test("a page past the end is empty and does not repeat earlier records", () => {
  const all = parts(5);
  const catalog = createCatalog(all);
  const result = catalog.page({ page: 4, pageSize: 2 });
  assert.equal(result.totalPages, 3);
  assert.deepEqual(result.items, []);
});

test("page size 1 visits each record once", () => {
  const all = parts(3);
  const catalog = createCatalog(all);
  const totalPages = catalog.page({ page: 1, pageSize: 1 }).totalPages;
  assert.equal(totalPages, 3);
  const collected = [];
  for (let page = 1; page <= totalPages; page += 1) {
    const result = catalog.page({ page, pageSize: 1 });
    assert.equal(result.items.length, 1);
    collected.push(result.items[0]);
  }
  assert.deepEqual(collected, all);
});

test("concatenating every page reproduces the catalog without gaps or duplicates", () => {
  const all = parts(10);
  const pageSize = 4;
  const catalog = createCatalog(all);
  const totalPages = catalog.page({ page: 1, pageSize }).totalPages;
  assert.equal(totalPages, 3);

  const collected = [];
  for (let page = 1; page <= totalPages; page += 1) {
    collected.push(...catalog.page({ page, pageSize }).items);
  }

  assert.equal(collected.length, all.length);
  assert.deepEqual(collected, all);
  assert.equal(new Set(collected.map((record) => record.sku)).size, all.length);
});

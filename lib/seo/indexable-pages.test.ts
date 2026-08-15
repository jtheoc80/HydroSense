import assert from "node:assert/strict";
import test from "node:test";
import {
  SITE_ORIGIN,
  getIndexNowUrls,
  getIndexablePages,
  getSitemapEntries,
  indexablePages,
  protectedNoindexPaths,
} from "./indexable-pages";

test("search discovery registry contains only unique canonical HTML pages", () => {
  const pages = getIndexablePages();
  assert.equal(pages.length, 37);
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.title.toLowerCase())).size, pages.length);

  for (const page of pages) {
    assert.match(page.path, /^\/(?!api(?:\/|$)|admin(?:\/|$)|e2e(?:\/|$))/);
    assert.equal(protectedNoindexPaths.includes(page.path as never), false);
  }
});

test("sitemap is an exact projection of the registry without fabricated dates", () => {
  const pages = getIndexablePages();
  const sitemap = getSitemapEntries();

  assert.deepEqual(
    sitemap.map((entry) => new URL(entry.url).pathname),
    pages.map((page) => page.path),
  );

  for (const entry of sitemap) {
    assert.equal(new URL(entry.url).origin, SITE_ORIGIN);
    if (entry.lastModified) {
      assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test("IndexNow is the eligible registry subset and excludes protected noindex URLs", () => {
  const expected = indexablePages
    .filter((page) => page.indexable && page.indexNowEligible)
    .map((page) => page.path);
  const actual = getIndexNowUrls();

  assert.deepEqual(
    actual.map((url) => new URL(url).pathname),
    expected,
  );
  assert.equal(actual.length, 35);
  assert.ok(actual.includes(`${SITE_ORIGIN}/pricing`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/agent-ready`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/devices/flologic`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides/smart-water-shutoff-installation-cost-houston`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides/what-size-smart-water-shutoff-do-i-need`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides/do-i-need-a-plumber-for-smart-water-shutoff`));
  assert.ok(actual.includes(`${SITE_ORIGIN}/guides/smart-water-shutoff-power-wifi-outage`));

  for (const url of actual) {
    assert.equal(new URL(url).origin, SITE_ORIGIN);
    assert.equal(protectedNoindexPaths.includes(new URL(url).pathname as never), false);
  }
});

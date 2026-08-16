import assert from "node:assert/strict";
import test from "node:test";
import { deviceList } from "../devices";
import { installationServices } from "../service-catalog/catalog";
import {
  commercialGuides,
  comparisonGuideRows,
  getCommercialGuide,
  installationGuideRows,
  outageGuideRows,
} from "./commercial-guides";

const expectedSlugs = [
  "smart-water-shutoff-installation-cost-houston",
  "what-size-smart-water-shutoff-do-i-need",
  "flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
  "do-i-need-a-plumber-for-smart-water-shutoff",
  "smart-water-shutoff-power-wifi-outage",
] as const;

function wordCount(value: string) {
  return value.trim().split(/\s+/).length;
}

test("commercial guides expose five unique answer intents with concise direct answers", () => {
  assert.equal(commercialGuides.length, 5);
  assert.deepEqual(commercialGuides.map((guide) => guide.slug), expectedSlugs);

  for (const field of ["slug", "href", "metaTitle", "h1", "directQuestion"] as const) {
    assert.equal(
      new Set(commercialGuides.map((guide) => guide[field].toLowerCase())).size,
      commercialGuides.length,
      `${field} must remain unique`,
    );
  }

  for (const guide of commercialGuides) {
    assert.equal(guide.href, `/guides/${guide.slug}`);
    assert.ok(wordCount(guide.directAnswer) >= 40, `${guide.slug} direct answer is too short`);
    assert.ok(wordCount(guide.directAnswer) <= 90, `${guide.slug} direct answer is too long`);
  }
});

test("cost and sizing evidence is generated from the active installation catalog", () => {
  assert.equal(installationGuideRows.length, installationServices.length);

  installationServices.forEach((service, index) => {
    assert.equal(service.price.type, "fixed");
    if (service.price.type !== "fixed") return;
    assert.equal(
      installationGuideRows[index].price,
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(service.price.amount),
    );
  });

  const largeLineRows = installationGuideRows.slice(-2);
  assert.deepEqual(largeLineRows.map((row) => row.price), ["$3,456", "$4,175"]);
  assert.ok(largeLineRows.every((row) => /FloLogic/.test(row.approach)));
  assert.equal(largeLineRows.at(-1)?.commercialGrade, true);
  assert.doesNotMatch(JSON.stringify(installationGuideRows), /2638|3425|2,638|3,425/);
});

test("device comparison is a governed fit comparison without a universal winner", () => {
  assert.deepEqual(
    comparisonGuideRows.map((row) => row.device),
    ["Flo by Moen", "Phyn Plus", "StreamLabs Control", "FloLogic"],
  );
  const guide = getCommercialGuide("flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic");
  assert.ok(guide);
  assert.match(guide.intro, /not an affiliate ranking/i);
  assert.match(JSON.stringify(guide.sections), /universal winner cannot be named/i);
  assert.doesNotMatch(JSON.stringify(guide), /best[ -]?overall/i);
  assert.match(JSON.stringify(comparisonGuideRows), /domestic-main size|domestic mains/i);
});

test("plumber and scope guidance preserves the licensed domestic-water boundary", () => {
  const guide = getCommercialGuide("do-i-need-a-plumber-for-smart-water-shutoff");
  assert.ok(guide);
  const content = JSON.stringify(guide);
  assert.match(content, /Responsible Master Plumber M-43057/);
  assert.match(content, /domestic/i);
  assert.match(content, /fire-sprinkler or fire-suppression piping/i);
  assert.match(content, /written proposal/i);
});

test("outage guidance keeps behavior device-specific across all governed families", () => {
  assert.deepEqual(
    outageGuideRows.map((row) => row.device),
    deviceList.map((device) => device.name),
  );
  assert.ok(new Set(outageGuideRows.map((row) => row.monitoring)).size > 1);
  assert.match(JSON.stringify(outageGuideRows), /without Wi-Fi/i);
  assert.match(JSON.stringify(outageGuideRows), /battery/i);
});

test("commercial guides link to the required decision destinations", () => {
  const destinations = new Set(
    commercialGuides.flatMap((guide) => guide.relatedLinks.map((link) => link.href)),
  );
  for (const href of ["/pricing", "/devices", "/devices/flologic", "/service-area"]) {
    assert.ok(destinations.has(href), `missing guide destination ${href}`);
  }
});

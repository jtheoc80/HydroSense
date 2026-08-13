import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PUBLIC_REQUEST_BYTES,
  PublicRequestError,
  readBoundedJson,
} from "./http";

test("public POST parsing rejects bodies larger than 16 KiB", async () => {
  const request = new Request("https://hydrosensetx.com/api/public/v1/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: "x".repeat(MAX_PUBLIC_REQUEST_BYTES) }),
  });

  await assert.rejects(
    () => readBoundedJson(request),
    (error: unknown) =>
      error instanceof PublicRequestError &&
      error.status === 413 &&
      error.code === "request_too_large",
  );
});

test("public POST parsing returns structured invalid-JSON errors", async () => {
  const request = new Request("https://hydrosensetx.com/api/public/v1/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json",
  });

  await assert.rejects(
    () => readBoundedJson(request),
    (error: unknown) =>
      error instanceof PublicRequestError &&
      error.status === 400 &&
      error.code === "invalid_json",
  );
});

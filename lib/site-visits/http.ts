import { NextResponse } from "next/server";
import { SiteVisitConflictError, SiteVisitValidationError } from "./service";

export function noStoreJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  return NextResponse.json(body, { ...init, headers });
}

export function siteVisitRouteError(error: unknown) {
  if (error instanceof SiteVisitValidationError) {
    return noStoreJson({ ok: false, error: error.message, details: error.details }, { status: 400 });
  }
  if (error instanceof SiteVisitConflictError) {
    return noStoreJson({ ok: false, error: error.message, details: error.details }, { status: 409 });
  }
  return noStoreJson({ ok: false, error: "Unable to complete the site-visit request" }, { status: 500 });
}

export function publicSiteVisitRouteError(error: unknown) {
  if (error instanceof SiteVisitValidationError) {
    const unavailable = error.message.includes("invalid or unavailable");
    return noStoreJson(
      { ok: false, error: unavailable ? "Appointment link is invalid or unavailable" : error.message, details: unavailable ? undefined : error.details },
      { status: unavailable ? 404 : 400 }
    );
  }
  if (error instanceof SiteVisitConflictError) {
    return noStoreJson({ ok: false, error: error.message, details: error.details }, { status: 409 });
  }
  return noStoreJson({ ok: false, error: "Unable to complete the appointment request" }, { status: 500 });
}

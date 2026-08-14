import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { noStoreJson } from "@/lib/site-visits/http";
import { allocateQuoteNumber } from "@/lib/quotes";
import {
  buildQuoteRevisionInsert,
  isRevisionDraftFor,
  type QuoteRevisionSource,
} from "@/lib/quote-revisions";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: source, error: sourceError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (sourceError || !source) {
      return noStoreJson({ ok: false, error: "Quote not found" }, { status: 404 });
    }

    if (source.status === "draft") {
      return noStoreJson(
        { ok: false, error: "This quote is already an editable draft" },
        { status: 409 }
      );
    }

    const { data: draftCandidates, error: candidateError } = await supabase
      .from("quotes")
      .select("id,quote_number,notes_internal,status")
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(100);

    if (candidateError) {
      throw candidateError;
    }

    const existingRevision = draftCandidates?.find((candidate) =>
      isRevisionDraftFor(candidate.notes_internal, source.quote_number)
    );

    if (existingRevision) {
      return noStoreJson({ ok: true, quote: existingRevision, reused: true });
    }

    const quoteNumber = await allocateQuoteNumber();
    const publicToken = crypto.randomBytes(16).toString("hex");
    const revision = buildQuoteRevisionInsert(
      source as QuoteRevisionSource,
      quoteNumber,
      publicToken
    );

    const { data: created, error: createError } = await supabase
      .from("quotes")
      .insert(revision)
      .select()
      .single();

    if (createError || !created) {
      console.error("Quote revision insert error:", createError);
      return noStoreJson(
        { ok: false, error: "Unable to create the quote revision" },
        { status: 500 }
      );
    }

    return noStoreJson({ ok: true, quote: created, reused: false }, { status: 201 });
  } catch (error) {
    console.error("Quote revision error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create the quote revision" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}

/**
 * Discover Jotform field IDs for a given form.
 *
 * Usage:
 *   npm run jotform:discover
 *
 * Requires JOTFORM_API_KEY and JOTFORM_AGREEMENT_FORM_ID in .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local since dotenv isn't installed
const envPath = resolve(process.cwd(), ".env.local");
try {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch {}

async function main() {
  const apiKey = process.env.JOTFORM_API_KEY;
  const formId = process.env.JOTFORM_AGREEMENT_FORM_ID;

  if (!apiKey || !formId) {
    console.error("Set JOTFORM_API_KEY and JOTFORM_AGREEMENT_FORM_ID in .env.local");
    process.exit(1);
  }

  const res = await fetch(
    `https://api.jotform.com/form/${formId}/questions?apiKey=${apiKey}`
  );

  if (!res.ok) {
    console.error(`API error ${res.status}:`, await res.text());
    process.exit(1);
  }

  const json = await res.json();
  const questions = json.content as Record<
    string,
    { qid: string; name: string; text: string; type: string }
  >;

  console.log("\n┌─────────────────────────────────────────────────────────┐");
  console.log("│  Jotform Field Discovery                                │");
  console.log("│  Form ID:", formId.padEnd(47), "│");
  console.log("├──────┬────────────────────┬─────────────────────────────┤");
  console.log("│  QID │ Name               │ Label                       │");
  console.log("├──────┼────────────────────┼─────────────────────────────┤");

  for (const q of Object.values(questions)) {
    const qid = q.qid.padEnd(4);
    const name = (q.name || "—").slice(0, 18).padEnd(18);
    const text = (q.text || "—").slice(0, 27).padEnd(27);
    console.log(`│  ${qid} │ ${name} │ ${text} │`);
  }

  console.log("└──────┴────────────────────┴─────────────────────────────┘");
  console.log("\nCopy the QID values into lib/jotform-field-map.ts\n");
}

main();

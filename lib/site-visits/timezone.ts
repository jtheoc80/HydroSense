const CHICAGO = "America/Chicago";
const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

export class LocalTimeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalTimeValidationError";
  }
}

function localParts(value: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

/** Converts an unzoned datetime-local value to UTC using America/Chicago rules. */
export function parseChicagoLocalDateTime(
  input: string,
  options: { now?: Date; maxFutureDays?: number; allowPast?: boolean } = {}
): string {
  const match = LOCAL_DATE_TIME.exec(input.trim());
  if (!match) throw new LocalTimeValidationError("Use a valid America/Chicago date and time");
  const [, yearText, monthText, dayText, hourText, minuteText, secondText = "00"] = match;
  const values = [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  const [year, month, day, hour, minute, second] = values;
  const wallClockUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const normalizedInput = `${yearText}-${monthText}-${dayText}T${hourText}:${minuteText}:${secondText}`;

  // Enumerating plausible global UTC offsets makes DST gaps and folds explicit,
  // without relying on the server or browser's own local timezone.
  const candidates: Date[] = [];
  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const candidate = new Date(wallClockUtc - offsetMinutes * 60_000);
    if (localParts(candidate, CHICAGO) === normalizedInput) candidates.push(candidate);
  }
  if (candidates.length === 0) {
    throw new LocalTimeValidationError("That America/Chicago time does not exist because of daylight saving time");
  }
  if (candidates.length > 1) {
    throw new LocalTimeValidationError("That America/Chicago time occurs twice because of daylight saving time; choose another time");
  }

  const selected = candidates[0];
  const now = options.now ?? new Date();
  if (!options.allowPast && selected.getTime() <= now.getTime()) {
    throw new LocalTimeValidationError("Appointment time must be in the future");
  }
  const maxFutureDays = options.maxFutureDays ?? 365;
  if (selected.getTime() > now.getTime() + maxFutureDays * 86_400_000) {
    throw new LocalTimeValidationError(`Appointment time must be within ${maxFutureDays} days`);
  }
  return selected.toISOString();
}

export function parseDistinctChicagoOptions(
  inputs: string[],
  options: { now?: Date; maxFutureDays?: number } = {}
): string[] {
  const parsed = inputs.map((input) => parseChicagoLocalDateTime(input, options));
  if (new Set(parsed).size !== parsed.length) {
    throw new LocalTimeValidationError("Choose different date and time options");
  }
  return parsed;
}

export function chicagoDateKey(value: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHICAGO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

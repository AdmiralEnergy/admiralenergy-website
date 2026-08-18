import type { CommerceDateRange } from "./repository";

export const BUSINESS_TIMEZONE = process.env.COMMERCE_TIMEZONE || "America/New_York";

function dateParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

function parseDateInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalized = new Date(Date.UTC(year, month - 1, day));
  if (normalized.getUTCFullYear() !== year || normalized.getUTCMonth() !== month - 1 || normalized.getUTCDate() !== day) return null;
  return { year, month, day };
}

function timeZoneOffset(value: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  const representedAsUtc = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
  return representedAsUtc - Math.floor(value.getTime() / 1000) * 1000;
}

export function businessDateInputValue(value = new Date()) {
  const { year, month, day } = dateParts(value);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function startOfBusinessDate(value: string) {
  const parsed = parseDateInput(value);
  if (!parsed) return null;
  const utcMidnight = Date.UTC(parsed.year, parsed.month - 1, parsed.day);
  let result = new Date(utcMidnight);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    result = new Date(utcMidnight - timeZoneOffset(result));
  }
  return result;
}

function addBusinessDays(value: string, days: number) {
  const parsed = parseDateInput(value);
  if (!parsed) return null;
  const result = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  return `${result.getUTCFullYear()}-${String(result.getUTCMonth() + 1).padStart(2, "0")}-${String(result.getUTCDate()).padStart(2, "0")}`;
}

export function formatBusinessDate(value: Date | string | number, withTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(new Date(value));
}
export function resolveDashboardPeriod(input: {
  period?: string;
  from?: string;
  to?: string;
}): { range: CommerceDateRange; label: string; period: string; from?: string; to?: string } {
  const now = new Date();
  const period = ["today", "7", "30", "ytd", "all", "custom"].includes(input.period ?? "")
    ? input.period as string
    : "30";
  if (period === "all") return { range: {}, label: "All time", period };
  if (period === "custom" && input.from && input.to) {
    const nextDay = addBusinessDays(input.to, 1);
    const from = startOfBusinessDate(input.from);
    const to = nextDay ? startOfBusinessDate(nextDay) : null;
    if (from && to && from < to) {
      return { range: { from, to }, label: `${input.from} through ${input.to}`, period, from: input.from, to: input.to };
    }
  }
  if (period === "today") {
    const day = businessDateInputValue(now);
    return {
      range: { from: startOfBusinessDate(day) ?? undefined },
      label: "Today",
      period,
    };
  }
  if (period === "ytd") {
    const businessYear = dateParts(now).year;
    return { range: { from: startOfBusinessDate(`${businessYear}-01-01`) ?? undefined }, label: "Year to date", period };
  }
  const days = period === "7" ? 7 : 30;
  return {
    range: { from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) },
    label: `Last ${days} days`,
    period: String(days),
  };
}

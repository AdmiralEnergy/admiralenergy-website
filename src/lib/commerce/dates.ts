import type { CommerceDateRange } from "./repository";

export const BUSINESS_TIMEZONE = process.env.COMMERCE_TIMEZONE || "America/New_York";

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
    const from = new Date(`${input.from}T00:00:00-04:00`);
    const to = new Date(`${input.to}T00:00:00-04:00`);
    to.setDate(to.getDate() + 1);
    if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from < to) {
      return { range: { from, to }, label: `${input.from} through ${input.to}`, period, from: input.from, to: input.to };
    }
  }
  if (period === "today") {
    const day = new Intl.DateTimeFormat("en-CA", {
      timeZone: BUSINESS_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    return {
      range: { from: new Date(`${day}T00:00:00-04:00`) },
      label: "Today",
      period,
    };
  }
  if (period === "ytd") {
    return { range: { from: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)) }, label: "Year to date", period };
  }
  const days = period === "7" ? 7 : 30;
  return {
    range: { from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) },
    label: `Last ${days} days`,
    period: String(days),
  };
}

import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6b19]">{eyebrow}</p>}
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0c2f4a] sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

export function StatusBadge({ value }: { value: string }) {
  const normalized = value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
  const positive = ["paid", "fulfilled", "complete", "connected", "active", "completed"].includes(value);
  const negative = ["failed", "canceled", "error", "missing_cost"].includes(value);
  const classes = positive
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : negative
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-amber-200 bg-amber-50 text-amber-800";
  return <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-bold ${classes}`}>{normalized}</span>;
}

export function Alert({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "warning" | "success" }) {
  const classes = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-950",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border p-4 text-sm leading-6 ${classes}`}>{children}</div>;
}

export function DatabaseUnavailable() {
  return (
    <Alert tone="error">
      <strong>Commerce data is unavailable.</strong> The admin database could not be reached. No changes were made. Check the Netlify Database connection and migration status, then retry.
    </Alert>
  );
}

export const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-[#0c2f4a] focus:outline-none focus:ring-2 focus:ring-[#c9a648]/40";
export const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0c2f4a] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#1a4a6e] disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButtonClass = "inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50";

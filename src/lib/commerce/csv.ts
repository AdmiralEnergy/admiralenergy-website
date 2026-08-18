function safeCell(value: unknown) {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
export function createCsv(columns: Array<{ header: string; value: (row: Record<string, unknown>) => unknown }>, rows: Record<string, unknown>[]) {
  return [
    columns.map((column) => safeCell(column.header)).join(","),
    ...rows.map((row) => columns.map((column) => safeCell(column.value(row))).join(",")),
  ].join("\r\n");
}

export function csvResponse(filename: string, body: string) {
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function decimalDollars(value: unknown) {
  return (Number(value ?? 0) / 100).toFixed(2);
}

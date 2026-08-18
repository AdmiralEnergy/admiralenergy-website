import assert from "node:assert/strict";
import test from "node:test";
import { businessDateInputValue, resolveDashboardPeriod, startOfBusinessDate } from "../src/lib/commerce/dates";

test("business date inputs use the configured timezone instead of UTC", () => {
  assert.equal(businessDateInputValue(new Date("2026-01-01T02:00:00Z")), "2025-12-31");
});

test("business day boundaries account for daylight saving time", () => {
  assert.equal(startOfBusinessDate("2026-01-15")?.toISOString(), "2026-01-15T05:00:00.000Z");
  assert.equal(startOfBusinessDate("2026-07-15")?.toISOString(), "2026-07-15T04:00:00.000Z");
});

test("custom dashboard periods include the complete final local day", () => {
  const period = resolveDashboardPeriod({ period: "custom", from: "2026-03-08", to: "2026-03-08" });
  assert.equal(period.range.from?.toISOString(), "2026-03-08T05:00:00.000Z");
  assert.equal(period.range.to?.toISOString(), "2026-03-09T04:00:00.000Z");
});

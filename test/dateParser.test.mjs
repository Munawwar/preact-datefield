import assert from "node:assert/strict";
import test from "node:test";
import { buildDateSuggestions, validateDateInput, isoToDisplayLabel } from "../lib/dateParser.js";

const NOW = new Date("2026-03-24T12:00:00+04:00");
const BASE = {
  timezone: "Asia/Dubai",
  now: NOW,
  dateOrder: "MDY",
  locale: "en-US",
};

function labels(input, options = {}) {
  return buildDateSuggestions(input, { ...BASE, ...options }).map((x) => x.label);
}

function first(input, options = {}) {
  return buildDateSuggestions(input, { ...BASE, ...options })[0] || null;
}

test("Case 1: month + day (date mode)", () => {
  assert.deepEqual(labels("Mar 6", { mode: "date" }), ["Mar 6, 2026"]);
});

test("Case 1: month + day (datetime favor start)", () => {
  const out = first("Mar 6", { mode: "datetime", favor: "start" });
  assert.ok(out);
  assert.equal(out.label, "Mar 6, 2026 - start of day (Asia/Dubai)");
  assert.equal(out.value, "2026-03-05T20:00:00.000Z");
  assert.equal(out.inferredBoundary, "startOfDay");
});

test("Case 1: month + day (datetime favor end)", () => {
  const out = first("Mar 6", { mode: "datetime", favor: "end" });
  assert.ok(out);
  assert.equal(out.label, "Mar 6, 2026 - end of day (Asia/Dubai)");
  assert.equal(out.value, "2026-03-06T19:59:59.999Z");
  assert.equal(out.inferredBoundary, "endOfDay");
});

test("Case 1.1: any order and partial month token", () => {
  assert.equal(first("6 mar", { mode: "date" })?.label, "Mar 6, 2026");
  assert.equal(first("mar 6", { mode: "date" })?.label, "Mar 6, 2026");

  const out = labels("6 ma", { mode: "date" });
  assert.deepEqual(out, ["Mar 6, 2026", "May 6, 2026"]);
});

test("Case 1.1: ambiguous partial month tokens ma / ju", () => {
  assert.deepEqual(labels("ma 6", { mode: "date" }), ["Mar 6, 2026", "May 6, 2026"]);
  assert.deepEqual(labels("ju 6", { mode: "date" }), ["Jun 6, 2026", "Jul 6, 2026"]);
});

test("Case 2: time-only 6 pm in datetime mode", () => {
  assert.deepEqual(labels("6 pm", { mode: "datetime" }), ["Mar 24, 2026 - 6:00 PM (Asia/Dubai)"]);
});

test("Case 2: 6:00 returns both AM and PM", () => {
  assert.deepEqual(labels("6:00", { mode: "datetime" }), [
    "Mar 24, 2026 - 6:00 AM (Asia/Dubai)",
    "Mar 24, 2026 - 6:00 PM (Asia/Dubai)",
  ]);
});

test("Case 2: supported forms 6p / 6pm / 18:00", () => {
  assert.equal(first("6p", { mode: "datetime" })?.label, "Mar 24, 2026 - 6:00 PM (Asia/Dubai)");
  assert.equal(first("6pm", { mode: "datetime" })?.label, "Mar 24, 2026 - 6:00 PM (Asia/Dubai)");
  assert.equal(first("18:00", { mode: "datetime" })?.label, "Mar 24, 2026 - 6:00 PM (Asia/Dubai)");
});

test("seconds/milliseconds are disabled by default", () => {
  assert.deepEqual(labels("6:00:30", { mode: "datetime" }), []);
  assert.deepEqual(labels("6:00:30.250", { mode: "datetime" }), []);
});

test("seconds and milliseconds can be enabled", () => {
  assert.deepEqual(labels("6:00:30", { mode: "datetime", allowSeconds: true }), [
    "Mar 24, 2026 - 6:00:30 AM (Asia/Dubai)",
    "Mar 24, 2026 - 6:00:30 PM (Asia/Dubai)",
  ]);
  assert.deepEqual(
    labels("6:00:30.25", { mode: "datetime", allowSeconds: true, allowMilliseconds: true }),
    [
      "Mar 24, 2026 - 6:00:30.250 AM (Asia/Dubai)",
      "Mar 24, 2026 - 6:00:30.250 PM (Asia/Dubai)",
    ],
  );
});

test("numeric date ambiguity is controlled by dateOrder and locale", () => {
  const mdy = labels("3/6", { mode: "date", dateOrder: "MDY" });
  assert.deepEqual(mdy, ["Mar 6, 2026", "Jun 3, 2026"]);

  const dmy = labels("3/6", { mode: "date", dateOrder: "DMY" });
  assert.deepEqual(dmy, ["Jun 3, 2026", "Mar 6, 2026"]);

  const autoUS = labels("3/6", { mode: "date", dateOrder: "auto", locale: "en-US" });
  assert.deepEqual(autoUS, ["Mar 6, 2026", "Jun 3, 2026"]);

  const autoGB = labels("3/6", { mode: "date", dateOrder: "auto", locale: "en-GB" });
  assert.deepEqual(autoGB, ["Jun 3, 2026", "Mar 6, 2026"]);
});

test("year handling defaults and year-only behavior", () => {
  assert.equal(first("March 6", { mode: "date" })?.label, "Mar 6, 2026");

  const start = first("2026", { mode: "datetime", favor: "start" });
  assert.ok(start);
  assert.equal(start.label, "Jan 1, 2026 - start of year (Asia/Dubai)");
  assert.equal(start.value, "2025-12-31T20:00:00.000Z");
  assert.equal(start.inferredBoundary, "startOfYear");

  const end = first("2026", { mode: "datetime", favor: "end" });
  assert.ok(end);
  assert.equal(end.label, "Dec 31, 2026 - end of year (Asia/Dubai)");
  assert.equal(end.value, "2026-12-31T19:59:59.999Z");
  assert.equal(end.inferredBoundary, "endOfYear");
});

test("invalid dates return no options", () => {
  assert.deepEqual(labels("Feb 30", { mode: "date" }), []);
  assert.deepEqual(labels("Apr 31", { mode: "date" }), []);
  assert.deepEqual(labels("Feb 29 2025", { mode: "date" }), []);
  assert.deepEqual(labels("Feb 29 2024", { mode: "date" }), ["Feb 29, 2024"]);
});

test("disambiguation: bare 18 is day-of-month and extra tokens are ignored", () => {
  assert.equal(first("18", { mode: "datetime" })?.label, "Mar 18, 2026 - start of day (Asia/Dubai)");
  assert.equal(first("18 18", { mode: "datetime" })?.label, "Mar 18, 2026 - start of day (Asia/Dubai)");
});

test("ranking: explicit time should not produce inferred start/end-of-day options", () => {
  const out = labels("Mar 6 6pm", { mode: "datetime" });
  assert.equal(out[0], "Mar 6, 2026 - 6:00 PM (Asia/Dubai)");
  assert.ok(!out.some((label) => label.includes("start of day") || label.includes("end of day")));
});

test("validateDateInput is independent and UI-agnostic", () => {
  const valid = validateDateInput("Mar 6", { ...BASE, mode: "date", required: true });
  assert.equal(valid.isValid, true);
  assert.equal(valid.reason, null);
  assert.equal(valid.suggestions[0]?.label, "Mar 6, 2026");

  const invalid = validateDateInput("Feb 30", { ...BASE, mode: "date", required: true });
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.reason, "invalid");

  const emptyRequired = validateDateInput("", { ...BASE, mode: "date", required: true });
  assert.equal(emptyRequired.isValid, false);
  assert.equal(emptyRequired.reason, "empty");

  const emptyOptional = validateDateInput("", { ...BASE, mode: "date", required: false });
  assert.equal(emptyOptional.isValid, true);
  assert.equal(emptyOptional.reason, null);
});

test("isoToDisplayLabel: date mode", () => {
  assert.equal(isoToDisplayLabel("2026-03-25", { mode: "date" }), "Mar 25, 2026");
  assert.equal(isoToDisplayLabel("2024-02-29", { mode: "date" }), "Feb 29, 2024");
  assert.equal(isoToDisplayLabel("", { mode: "date" }), "");
  assert.equal(isoToDisplayLabel("invalid", { mode: "date" }), "");
});

test("isoToDisplayLabel: datetime mode", () => {
  const label = isoToDisplayLabel("2026-03-25T06:00:00.000Z", {
    mode: "datetime",
    timezone: "Asia/Dubai",
  });
  assert.equal(label, "Mar 25, 2026 - 10:00 AM (Asia/Dubai)");
});

test("isoToDisplayLabel: custom labelFormatter", () => {
  const label = isoToDisplayLabel("2026-03-25", {
    mode: "date",
    labelFormatter: (parts) => `${parts.day}/${parts.month}/${parts.year}`,
  });
  assert.equal(label, "25/3/2026");
});

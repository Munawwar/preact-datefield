const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const MONTH_SHORT_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const timeZoneFormatterCache = new Map();

/**
 * @typedef {"date" | "datetime"} DateParserMode
 * @typedef {"start" | "end"} DateBoundaryPreference
 * @typedef {"auto" | "MDY" | "DMY" | "YMD"} DateOrder
 *
 * @typedef {Object} DateParserOptions
 * @property {DateParserMode} [mode="date"]
 * @property {DateBoundaryPreference} [favor="start"]
 * @property {string} [timezone]
 * @property {Date} [now]
 * @property {string} [locale]
 * @property {DateOrder} [dateOrder="auto"]
 * @property {boolean} [allowSeconds=false]
 * @property {boolean} [allowMilliseconds=false]
 * @property {number} [maxOptions=10]
 *
 * @typedef {"none" | "startOfDay" | "endOfDay" | "startOfYear" | "endOfYear"} InferredBoundary
 *
 * @typedef {Object} DateSuggestion
 * @property {string} label
 * @property {string} value
 * @property {number} score
 * @property {string} timezone
 * @property {DateParserMode} mode
 * @property {InferredBoundary} inferredBoundary
 * @property {boolean} inferredYear
 * @property {boolean} inferredMonth
 * @property {boolean} inferredDay
 * @property {boolean} inferredTime
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 * @property {number} second
 * @property {number} millisecond
 */

/**
 * @typedef {Object} ValidateDateInputOptions
 * @property {boolean} [required=false]
 * @property {DateParserMode} [mode="date"]
 * @property {DateBoundaryPreference} [favor="start"]
 * @property {string} [timezone]
 * @property {Date} [now]
 * @property {string} [locale]
 * @property {DateOrder} [dateOrder="auto"]
 * @property {boolean} [allowSeconds=false]
 * @property {boolean} [allowMilliseconds=false]
 * @property {number} [maxOptions=10]
 *
 * @typedef {Object} ValidateDateInputResult
 * @property {boolean} isValid
 * @property {boolean} isEmpty
 * @property {"empty" | "invalid" | null} reason
 * @property {DateSuggestion[]} suggestions
 */

/**
 * @typedef {Object} ParsedTime
 * @property {number} hour
 * @property {number} minute
 * @property {number} second
 * @property {number} millisecond
 * @property {Set<number>} usedIndices
 * @property {boolean} assumedMeridiem
 * @property {boolean} hadSeconds
 * @property {boolean} hadMilliseconds
 */

/**
 * @typedef {Object} ParsedDate
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {Set<number>} usedIndices
 * @property {boolean} explicitYear
 * @property {boolean} explicitMonth
 * @property {boolean} explicitDay
 * @property {boolean} ambiguousOrder
 * @property {number} orderPenalty
 * @property {boolean} partialMonth
 * @property {InferredBoundary} boundary
 */

/**
 * @param {string} input
 */
function normalizeInput(input) {
  return input.toLowerCase().replace(/[,]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param {string} token
 */
function normalizeToken(token) {
  return token.toLowerCase().replace(/,/g, "").replace(/^[.]+|[.]+$/g, "");
}

/**
 * @param {string} token
 * @returns {number | null}
 */
function toInt(token) {
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  return Number.isNaN(value) ? null : value;
}

/**
 * @param {number} value
 * @param {number} [size=2]
 */
function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function isValidDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * @param {string} token
 * @returns {Array<{ month: number, partial: boolean }>}
 */
function monthMatches(token) {
  if (!token || !/^[a-z]+$/.test(token)) return [];
  const out = [];
  for (let i = 0; i < MONTH_KEYS.length; i += 1) {
    const full = MONTH_KEYS[i] || "";
    const short = MONTH_SHORT_KEYS[i] || "";
    if (full.startsWith(token) || short.startsWith(token)) {
      out.push({ month: i + 1, partial: token !== full && token !== short });
    }
  }
  return out;
}

/**
 * @param {string} token
 * @returns {"am" | "pm" | null}
 */
function parseMeridiem(token) {
  const normalized = normalizeToken(token);
  if (normalized === "a" || normalized === "am") return "am";
  if (normalized === "p" || normalized === "pm") return "pm";
  return null;
}

/**
 * @param {DateOrder} dateOrder
 * @param {string} locale
 * @returns {DateOrder}
 */
function resolveDateOrder(dateOrder, locale) {
  if (dateOrder && dateOrder !== "auto") return dateOrder;
  const parts = new Intl.DateTimeFormat(locale || "en-US")
    .formatToParts(new Date(Date.UTC(2006, 0, 2)))
    .filter((part) => part.type === "year" || part.type === "month" || part.type === "day")
    .map((part) => part.type);
  const joined = parts.join("-");
  if (joined === "day-month-year") return "DMY";
  if (joined === "year-month-day") return "YMD";
  return "MDY";
}

/**
 * @param {number} first
 * @param {number} second
 * @param {DateOrder} resolvedOrder
 * @returns {Array<{ month: number, day: number, ambiguousOrder: boolean, orderPenalty: number }>}
 */
function getPairMonthDay(first, second, resolvedOrder) {
  if (first < 1 || second < 1 || first > 31 || second > 31) return [];
  if (first > 12 && second > 12) return [];
  if (first > 12) return [{ month: second, day: first, ambiguousOrder: false, orderPenalty: 0 }];
  if (second > 12) return [{ month: first, day: second, ambiguousOrder: false, orderPenalty: 0 }];
  const order = resolvedOrder === "DMY" ? "DMY" : "MDY";
  if (order === "DMY") {
    return [
      { month: second, day: first, ambiguousOrder: true, orderPenalty: 0 },
      { month: first, day: second, ambiguousOrder: true, orderPenalty: 1 },
    ];
  }
  return [
    { month: first, day: second, ambiguousOrder: true, orderPenalty: 0 },
    { month: second, day: first, ambiguousOrder: true, orderPenalty: 1 },
  ];
}

/**
 * @param {string} hourRaw
 * @param {string | undefined} minuteRaw
 * @param {string | undefined} secondRaw
 * @param {string | undefined} millisecondRaw
 * @param {"am" | "pm" | null} meridiem
 * @param {boolean} allowSeconds
 * @param {boolean} allowMilliseconds
 * @returns {Array<{
 *   hour: number,
 *   minute: number,
 *   second: number,
 *   millisecond: number,
 *   assumedMeridiem: boolean,
 *   hadSeconds: boolean,
 *   hadMilliseconds: boolean
 * }>}
 */
function parseTimeFields(hourRaw, minuteRaw, secondRaw, millisecondRaw, meridiem, allowSeconds, allowMilliseconds) {
  const hourBase = Number(hourRaw);
  const minute = minuteRaw ? Number(minuteRaw) : 0;
  const second = secondRaw ? Number(secondRaw) : 0;
  const millisecond = millisecondRaw ? Number(millisecondRaw.padEnd(3, "0").slice(0, 3)) : 0;
  if ([hourBase, minute, second, millisecond].some((value) => Number.isNaN(value))) return [];
  if (minute < 0 || minute > 59) return [];
  if (second < 0 || second > 59) return [];
  if (millisecond < 0 || millisecond > 999) return [];
  if (!allowSeconds && secondRaw) return [];
  if (!allowMilliseconds && millisecondRaw) return [];
  if (millisecondRaw && !secondRaw && !allowSeconds) return [];

  const hadSeconds = Boolean(secondRaw);
  const hadMilliseconds = Boolean(millisecondRaw);
  if (meridiem) {
    if (hourBase < 1 || hourBase > 12) return [];
    const hour = meridiem === "pm" ? (hourBase % 12) + 12 : hourBase % 12;
    return [{ hour, minute, second, millisecond, assumedMeridiem: false, hadSeconds, hadMilliseconds }];
  }
  if (hourBase < 0 || hourBase > 23) return [];
  if (hourBase >= 13 || hourBase === 0) {
    return [{ hour: hourBase, minute, second, millisecond, assumedMeridiem: false, hadSeconds, hadMilliseconds }];
  }
  return [
    { hour: hourBase % 12, minute, second, millisecond, assumedMeridiem: true, hadSeconds, hadMilliseconds },
    { hour: (hourBase % 12) + 12, minute, second, millisecond, assumedMeridiem: true, hadSeconds, hadMilliseconds },
  ];
}

/**
 * @param {string[]} tokens
 * @param {boolean} allowSeconds
 * @param {boolean} allowMilliseconds
 * @returns {ParsedTime[]}
 */
function parseTimeCandidates(tokens, allowSeconds, allowMilliseconds) {
  /** @type {ParsedTime[]} */
  const out = [];
  const consumed = new Set();

  for (let i = 0; i < tokens.length; i += 1) {
    if (consumed.has(i)) continue;
    const token = normalizeToken(tokens[i] || "");
    if (!token) continue;

    let match = token.match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?(a|am|p|pm)$/);
    if (match) {
      const meridiem = match[5] === "a" || match[5] === "am" ? "am" : "pm";
      const parsed = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        meridiem,
        allowSeconds,
        allowMilliseconds,
      );
      if (parsed.length) {
        consumed.add(i);
        for (const item of parsed) out.push({ ...item, usedIndices: new Set([i]) });
      }
      continue;
    }

    const nextMeridiem = i + 1 < tokens.length ? parseMeridiem(tokens[i + 1] || "") : null;
    match = token.match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?$/);
    if (match && nextMeridiem) {
      const parsed = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        nextMeridiem,
        allowSeconds,
        allowMilliseconds,
      );
      if (parsed.length) {
        consumed.add(i);
        consumed.add(i + 1);
        for (const item of parsed) out.push({ ...item, usedIndices: new Set([i, i + 1]) });
      }
      continue;
    }

    match = token.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?$/);
    if (!match) continue;
    const parsed = parseTimeFields(
      match[1] || "",
      match[2],
      match[3],
      match[4],
      null,
      allowSeconds,
      allowMilliseconds,
    );
    if (!parsed.length) continue;
    consumed.add(i);
    for (const item of parsed) out.push({ ...item, usedIndices: new Set([i]) });
  }

  return out;
}

/**
 * @param {number} year
 * @param {DateBoundaryPreference} favor
 * @returns {{ month: number, day: number, boundary: InferredBoundary }}
 */
function buildYearOnlyDate(year, favor) {
  if (favor === "end") return { month: 12, day: 31, boundary: "endOfYear" };
  return { month: 1, day: 1, boundary: "startOfYear" };
}

/**
 * @param {ParsedDate[]} list
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {Set<number>} usedIndices
 * @param {boolean} explicitYear
 * @param {boolean} explicitMonth
 * @param {boolean} explicitDay
 * @param {boolean} ambiguousOrder
 * @param {number} orderPenalty
 * @param {boolean} partialMonth
 * @param {InferredBoundary} boundary
 */
function addDateCandidate(list, year, month, day, usedIndices, explicitYear, explicitMonth, explicitDay, ambiguousOrder, orderPenalty, partialMonth, boundary) {
  if (!isValidDate(year, month, day)) return;
  list.push({
    year,
    month,
    day,
    usedIndices,
    explicitYear,
    explicitMonth,
    explicitDay,
    ambiguousOrder,
    orderPenalty,
    partialMonth,
    boundary,
  });
}

/**
 * @param {string[]} tokens
 * @param {Set<number>} consumedTimeIndices
 * @param {Date} now
 * @param {DateOrder} resolvedOrder
 * @param {DateBoundaryPreference} favor
 * @returns {ParsedDate[]}
 */
function parseDateCandidates(tokens, consumedTimeIndices, now, resolvedOrder, favor) {
  /** @type {ParsedDate[]} */
  const out = [];
  /** @type {Array<{ index: number, a: number, b: number, c: number | null }>} */
  const separated = [];
  /** @type {Array<{ index: number, months: Array<{ month: number, partial: boolean }> }>} */
  const monthWordTokens = [];
  /** @type {Array<{ index: number, value: number }>} */
  const numericTokens = [];

  for (let i = 0; i < tokens.length; i += 1) {
    if (consumedTimeIndices.has(i)) continue;
    const token = normalizeToken(tokens[i] || "");
    if (!token) continue;
    const separatedMatch = token.match(/^(\d{1,4})[\/.-](\d{1,2})(?:[\/.-](\d{1,4}))?$/);
    if (separatedMatch) {
      separated.push({
        index: i,
        a: Number(separatedMatch[1]),
        b: Number(separatedMatch[2]),
        c: separatedMatch[3] ? Number(separatedMatch[3]) : null,
      });
      continue;
    }
    const months = monthMatches(token);
    if (months.length) {
      monthWordTokens.push({ index: i, months });
      continue;
    }
    const numeric = toInt(token);
    if (numeric !== null) numericTokens.push({ index: i, value: numeric });
  }

  for (const item of separated) {
    const { a, b, c, index } = item;
    if (c !== null) {
      if (a >= 1000 && a <= 9999) {
        addDateCandidate(
          out,
          a,
          b,
          c,
          new Set([index]),
          true,
          true,
          true,
          false,
          0,
          false,
          "none",
        );
        continue;
      }
      if (c >= 1000 && c <= 9999) {
        const pairs = getPairMonthDay(a, b, resolvedOrder);
        for (const pair of pairs) {
          addDateCandidate(
            out,
            c,
            pair.month,
            pair.day,
            new Set([index]),
            true,
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none",
          );
        }
      }
      continue;
    }
    const pairs = getPairMonthDay(a, b, resolvedOrder);
    for (const pair of pairs) {
      addDateCandidate(
        out,
        now.getFullYear(),
        pair.month,
        pair.day,
        new Set([index]),
        false,
        true,
        true,
        pair.ambiguousOrder,
        pair.orderPenalty,
        false,
        "none",
      );
    }
  }

  const dayNumbers = numericTokens.filter((token) => token.value >= 1 && token.value <= 31);
  const yearNumbers = numericTokens.filter((token) => token.value >= 1000 && token.value <= 9999);
  if (monthWordTokens.length && dayNumbers.length) {
    for (const monthToken of monthWordTokens) {
      for (const monthItem of monthToken.months) {
        for (const dayToken of dayNumbers) {
          if (yearNumbers.length) {
            for (const yearToken of yearNumbers) {
              addDateCandidate(
                out,
                yearToken.value,
                monthItem.month,
                dayToken.value,
                new Set([monthToken.index, dayToken.index, yearToken.index]),
                true,
                true,
                true,
                false,
                0,
                monthItem.partial,
                "none",
              );
            }
            continue;
          }
          addDateCandidate(
            out,
            now.getFullYear(),
            monthItem.month,
            dayToken.value,
            new Set([monthToken.index, dayToken.index]),
            false,
            true,
            true,
            false,
            0,
            monthItem.partial,
            "none",
          );
        }
      }
    }
  }

  if (!monthWordTokens.length && !separated.length) {
    const yearOnly = yearNumbers.length === 1 ? yearNumbers[0] : null;
    if (yearOnly && dayNumbers.length === 0 && numericTokens.length === 1) {
      const boundaryDate = buildYearOnlyDate(yearOnly.value, favor);
      addDateCandidate(
        out,
        yearOnly.value,
        boundaryDate.month,
        boundaryDate.day,
        new Set([yearOnly.index]),
        true,
        false,
        false,
        false,
        0,
        false,
        boundaryDate.boundary,
      );
    }

    const nonYear = numericTokens.filter((token) => token.value < 1000);
    if (nonYear.length >= 2) {
      const first = nonYear[0];
      const second = nonYear[1];
      const firstYear = yearNumbers[0] || null;
      if (first && second) {
        const inferredYear = firstYear ? firstYear.value : now.getFullYear();
        const pairs = getPairMonthDay(first.value, second.value, resolvedOrder);
        for (const pair of pairs) {
          addDateCandidate(
            out,
            inferredYear,
            pair.month,
            pair.day,
            new Set([first.index, second.index, ...(firstYear ? [firstYear.index] : [])]),
            Boolean(firstYear),
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none",
          );
        }
      }
    }

    if (dayNumbers.length) {
      const firstDay = dayNumbers[0];
      const firstYear = yearNumbers[0] || null;
      if (firstDay) {
        addDateCandidate(
          out,
          firstYear ? firstYear.value : now.getFullYear(),
          now.getMonth() + 1,
          firstDay.value,
          new Set([firstDay.index, ...(firstYear ? [firstYear.index] : [])]),
          Boolean(firstYear),
          false,
          true,
          false,
          0,
          false,
          "none",
        );
      }
    }
  }

  return out;
}

/**
 * @param {ParsedDate} candidate
 * @param {boolean} explicitTime
 * @param {boolean} assumedMeridiem
 * @param {number} ignoredTokenCount
 * @param {DateParserMode} mode
 */
function scoreCandidate(candidate, explicitTime, assumedMeridiem, ignoredTokenCount, mode) {
  let score = 100;
  score += candidate.explicitYear ? 9 : -9;
  score += candidate.explicitMonth ? 8 : -8;
  score += candidate.explicitDay ? 8 : -8;
  if (explicitTime) score += 12;
  if (mode === "datetime" && !explicitTime) score -= 4;
  if (candidate.ambiguousOrder) score -= 3;
  score -= candidate.orderPenalty * 2;
  if (candidate.partialMonth) score -= 2;
  if (assumedMeridiem) score -= 2;
  if (candidate.boundary !== "none") score -= 2;
  score -= ignoredTokenCount * 2;
  return score;
}

/**
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @param {number} millisecond
 * @param {boolean} includeSeconds
 * @param {boolean} includeMilliseconds
 */
function toTimeLabel(hour, minute, second, millisecond, includeSeconds, includeMilliseconds) {
  const meridiem = hour >= 12 ? "PM" : "AM";
  const clockHour = hour % 12 || 12;
  let text = `${clockHour}:${pad(minute)} ${meridiem}`;
  if (includeSeconds) text = `${clockHour}:${pad(minute)}:${pad(second)} ${meridiem}`;
  if (includeMilliseconds) text = `${clockHour}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)} ${meridiem}`;
  return text;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function toDateLabel(year, month, day) {
  const monthName = MONTHS[month - 1] || MONTHS[0];
  return `${monthName} ${day}, ${year}`;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function toDateValue(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/**
 * @param {string} timezone
 */
function getTimeZoneFormatter(timezone) {
  const cached = timeZoneFormatterCache.get(timezone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    calendar: "iso8601",
    numberingSystem: "latn",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  timeZoneFormatterCache.set(timezone, formatter);
  return formatter;
}

/**
 * @param {number} epochMs
 * @param {string} timezone
 */
function getZonedParts(epochMs, timezone) {
  const formatter = getTimeZoneFormatter(timezone);
  /** @type {{ year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }} */
  const parts = {};
  for (const part of formatter.formatToParts(new Date(epochMs))) {
    if (part.type === "year") parts.year = Number(part.value);
    else if (part.type === "month") parts.month = Number(part.value);
    else if (part.type === "day") parts.day = Number(part.value);
    else if (part.type === "hour") parts.hour = Number(part.value);
    else if (part.type === "minute") parts.minute = Number(part.value);
    else if (part.type === "second") parts.second = Number(part.value);
  }
  return {
    year: parts.year || 0,
    month: parts.month || 0,
    day: parts.day || 0,
    hour: parts.hour || 0,
    minute: parts.minute || 0,
    second: parts.second || 0,
  };
}

/**
 * @param {number} epochMs
 * @param {string} timezone
 */
function getOffsetMs(epochMs, timezone) {
  const baseMs = Math.trunc(epochMs / 1000) * 1000;
  const parts = getZonedParts(baseMs, timezone);
  const asUTC = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUTC - baseMs;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @param {number} millisecond
 * @param {string} timezone
 */
function zonedDateTimeToUTCISOString(year, month, day, hour, minute, second, millisecond, timezone) {
  const desiredLocalAsUTC = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  let guess = desiredLocalAsUTC;
  for (let i = 0; i < 3; i += 1) {
    const next = desiredLocalAsUTC - getOffsetMs(guess, timezone);
    if (next === guess) break;
    guess = next;
  }
  const finalEpoch = guess + millisecond;
  const resolved = getZonedParts(finalEpoch, timezone);
  const isExact =
    resolved.year === year &&
    resolved.month === month &&
    resolved.day === day &&
    resolved.hour === hour &&
    resolved.minute === minute &&
    resolved.second === second;
  if (!isExact) return null;
  return new Date(finalEpoch).toISOString();
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @param {number} millisecond
 * @param {string} timezone
 */
function toDateTimeValue(year, month, day, hour, minute, second, millisecond, timezone) {
  try {
    const iso = zonedDateTimeToUTCISOString(year, month, day, hour, minute, second, millisecond, timezone);
    if (iso) return iso;
  } catch (_error) {}
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond)).toISOString();
}

/**
 * Parse user text into ranked date/datetime suggestions.
 *
 * @param {string} input
 * @param {DateParserOptions} [options]
 * @returns {DateSuggestion[]}
 */
export function buildDateSuggestions(input, options = {}) {
  const normalizedInput = normalizeInput(input || "");
  if (!normalizedInput) return [];
  const mode = options.mode || "date";
  const favor = options.favor || "start";
  const now = options.now || new Date();
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedOrder = resolveDateOrder(options.dateOrder || "auto", options.locale || "en-US");
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);
  const maxOptions = Math.max(1, options.maxOptions || 10);
  const tokens = normalizedInput.split(" ").filter(Boolean);

  const timeCandidates = parseTimeCandidates(tokens, allowSeconds, allowMilliseconds);
  const consumedTimeIndices = new Set();
  for (const time of timeCandidates) for (const index of time.usedIndices) consumedTimeIndices.add(index);
  let dateCandidates = parseDateCandidates(tokens, consumedTimeIndices, now, resolvedOrder, favor);

  if (!dateCandidates.length && mode === "datetime" && timeCandidates.length) {
    dateCandidates = [
      {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        usedIndices: new Set(),
        explicitYear: false,
        explicitMonth: false,
        explicitDay: false,
        ambiguousOrder: false,
        orderPenalty: 0,
        partialMonth: false,
        boundary: "none",
      },
    ];
  }
  if (!dateCandidates.length) return [];

  /** @type {DateSuggestion[]} */
  const suggestions = [];
  const seen = new Set();

  for (const dateCandidate of dateCandidates) {
    if (mode === "date") {
      const usedIndices = new Set(dateCandidate.usedIndices);
      const ignoredTokenCount = Math.max(0, tokens.length - usedIndices.size);
      const score = scoreCandidate(dateCandidate, false, false, ignoredTokenCount, mode);
      const value = toDateValue(dateCandidate.year, dateCandidate.month, dateCandidate.day);
      if (seen.has(value)) continue;
      seen.add(value);
      suggestions.push({
        label: toDateLabel(dateCandidate.year, dateCandidate.month, dateCandidate.day),
        value,
        score,
        timezone,
        mode,
        inferredBoundary: "none",
        inferredYear: !dateCandidate.explicitYear,
        inferredMonth: !dateCandidate.explicitMonth,
        inferredDay: !dateCandidate.explicitDay,
        inferredTime: true,
        year: dateCandidate.year,
        month: dateCandidate.month,
        day: dateCandidate.day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      continue;
    }

    if (timeCandidates.length) {
      for (const timeCandidate of timeCandidates) {
        const usedIndices = new Set([...dateCandidate.usedIndices, ...timeCandidate.usedIndices]);
        const ignoredTokenCount = Math.max(0, tokens.length - usedIndices.size);
        const score = scoreCandidate(
          dateCandidate,
          true,
          timeCandidate.assumedMeridiem,
          ignoredTokenCount,
          mode,
        );
        const value = toDateTimeValue(
          dateCandidate.year,
          dateCandidate.month,
          dateCandidate.day,
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timezone,
        );
        if (seen.has(value)) continue;
        seen.add(value);
        const label = `${toDateLabel(dateCandidate.year, dateCandidate.month, dateCandidate.day)}, ${toTimeLabel(
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timeCandidate.hadSeconds,
          timeCandidate.hadMilliseconds,
        )} (${timezone})`;
        suggestions.push({
          label,
          value,
          score,
          timezone,
          mode,
          inferredBoundary: "none",
          inferredYear: !dateCandidate.explicitYear,
          inferredMonth: !dateCandidate.explicitMonth,
          inferredDay: !dateCandidate.explicitDay,
          inferredTime: false,
          year: dateCandidate.year,
          month: dateCandidate.month,
          day: dateCandidate.day,
          hour: timeCandidate.hour,
          minute: timeCandidate.minute,
          second: timeCandidate.second,
          millisecond: timeCandidate.millisecond,
        });
      }
      continue;
    }

    const isEnd = dateCandidate.boundary === "endOfDay" || dateCandidate.boundary === "endOfYear" || favor === "end";
    const isYearBoundary = dateCandidate.boundary === "startOfYear" || dateCandidate.boundary === "endOfYear";
    const hour = isEnd ? 23 : 0;
    const minute = isEnd ? 59 : 0;
    const second = isEnd ? 59 : 0;
    const millisecond = isEnd ? 999 : 0;
    const inferredBoundary =
      dateCandidate.boundary === "none"
        ? isEnd
          ? "endOfDay"
          : "startOfDay"
        : dateCandidate.boundary;
    const usedIndices = new Set(dateCandidate.usedIndices);
    const ignoredTokenCount = Math.max(0, tokens.length - usedIndices.size);
    const score = scoreCandidate(dateCandidate, false, false, ignoredTokenCount, mode);
    const value = toDateTimeValue(
      dateCandidate.year,
      dateCandidate.month,
      dateCandidate.day,
      hour,
      minute,
      second,
      millisecond,
      timezone,
    );
    if (seen.has(value)) continue;
    seen.add(value);
    const boundaryLabel =
      inferredBoundary === "startOfDay"
        ? "start of day"
        : inferredBoundary === "endOfDay"
          ? "end of day"
          : inferredBoundary === "startOfYear"
            ? "start of year"
            : "end of year";
    const label = `${toDateLabel(dateCandidate.year, dateCandidate.month, dateCandidate.day)}, ${boundaryLabel} (${timezone})`;
    suggestions.push({
      label,
      value,
      score: isYearBoundary ? score + 1 : score,
      timezone,
      mode,
      inferredBoundary,
      inferredYear: !dateCandidate.explicitYear,
      inferredMonth: !dateCandidate.explicitMonth,
      inferredDay: !dateCandidate.explicitDay,
      inferredTime: true,
      year: dateCandidate.year,
      month: dateCandidate.month,
      day: dateCandidate.day,
      hour,
      minute,
      second,
      millisecond,
    });
  }

  suggestions.sort(
    (a, b) =>
      b.score - a.score ||
      a.year - b.year ||
      a.month - b.month ||
      a.day - b.day ||
      a.hour - b.hour ||
      a.minute - b.minute ||
      a.second - b.second ||
      a.millisecond - b.millisecond ||
      a.label.localeCompare(b.label),
  );
  return suggestions.slice(0, maxOptions);
}

/**
 * Validate date text independently from UI concerns.
 *
 * @param {string} input
 * @param {ValidateDateInputOptions} [options]
 * @returns {ValidateDateInputResult}
 */
export function validateDateInput(input, options = {}) {
  const normalizedInput = normalizeInput(input || "");
  const isEmpty = normalizedInput.length === 0;
  const suggestions = isEmpty
    ? []
    : buildDateSuggestions(input, {
        mode: options.mode,
        favor: options.favor,
        timezone: options.timezone,
        now: options.now,
        locale: options.locale,
        dateOrder: options.dateOrder,
        allowSeconds: options.allowSeconds,
        allowMilliseconds: options.allowMilliseconds,
        maxOptions: options.maxOptions,
      });
  if (isEmpty) {
    return {
      isValid: !options.required,
      isEmpty: true,
      reason: options.required ? "empty" : null,
      suggestions,
    };
  }
  return {
    isValid: suggestions.length > 0,
    isEmpty: false,
    reason: suggestions.length ? null : "invalid",
    suggestions,
  };
}

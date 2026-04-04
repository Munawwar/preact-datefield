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

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_SHORT_KEYS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const WEEKDAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const WEEKDAY_ALIASES = [
  ["sun"],
  ["mon"],
  ["tue", "tues"],
  ["wed", "weds"],
  ["thu", "thur", "thurs"],
  ["fri"],
  ["sat"],
];
const timeZoneFormatterCache = new Map();

/**
 * @typedef {"date" | "datetime"} DateParserMode
 * @typedef {"start" | "end"} DateBoundaryPreference
 * @typedef {"past" | "future"} DateDayPreference
 * @typedef {"auto" | "MDY" | "DMY" | "YMD"} DateOrder
 *
 * @typedef {Object} DateParserOptions
 * @property {DateParserMode} [mode="date"]
 * @property {DateBoundaryPreference} [timeFavor="start"]
 * @property {DateDayPreference} [dayFavor="past"]
 * @property {string} [timezone]
 * @property {Date} [now]
 * @property {string} [locale]
 * @property {DateOrder} [dateOrder="DMY"]
 * @property {boolean} [allowSeconds=false]
 * @property {boolean} [allowMilliseconds=false]
 * @property {boolean} [includeDefaultOption=true]
 * @property {Date} [defaultDate]
 * @property {number} [maxOptions=10]
 *
 * @typedef {"none" | "startOfDay" | "endOfDay" | "startOfMonth" | "endOfMonth" | "startOfYear" | "endOfYear"} InferredBoundary
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
 * @property {DateBoundaryPreference} [timeFavor="start"]
 * @property {DateDayPreference} [dayFavor="past"]
 * @property {string} [timezone]
 * @property {Date} [now]
 * @property {string} [locale]
 * @property {DateOrder} [dateOrder="DMY"]
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
 * @property {number | null} weekday
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
  return token
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/^[.]+|[.]+$/g, "");
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
 * @param {string} token
 * @returns {number | null}
 */
function toDayNumber(token) {
  const asInt = toInt(token);
  if (asInt !== null) return asInt >= 1 && asInt <= 31 ? asInt : null;
  const ordinalMatch = token.toLowerCase().match(/^(\d{1,2})([a-z]{1,4})$/);
  if (!ordinalMatch) return null;
  const suffix = ordinalMatch[2] || "";
  if (suffix === "a" || suffix === "am" || suffix === "p" || suffix === "pm") return null;
  const day = Number(ordinalMatch[1]);
  if (Number.isNaN(day) || day < 1 || day > 31) return null;
  return day;
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
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/**
 * @param {number} year
 * @param {number} month
 */
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
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
 * @returns {Array<{ weekday: number, partial: boolean }>}
 */
function weekdayMatches(token) {
  if (!token || !/^[a-z]+$/.test(token)) return [];
  const out = [];
  for (let i = 0; i < WEEKDAY_KEYS.length; i += 1) {
    const full = WEEKDAY_KEYS[i] || "";
    const aliases = WEEKDAY_ALIASES[i] || [];
    let matches = full.startsWith(token);
    for (const alias of aliases) {
      if (alias.startsWith(token)) {
        matches = true;
        break;
      }
    }
    if (!matches) continue;
    const isExact = full === token || aliases.includes(token);
    out.push({ weekday: i, partial: !isExact });
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
 * @param {string | undefined} locale
 * @returns {DateOrder}
 */
function resolveDateOrder(dateOrder, locale) {
  if (dateOrder && dateOrder !== "auto") return dateOrder;
  if (!locale) return "DMY";
  const parts = new Intl.DateTimeFormat(locale)
    .formatToParts(new Date(Date.UTC(2006, 0, 2)))
    .filter((part) => part.type === "year" || part.type === "month" || part.type === "day")
    .map((part) => part.type);
  const joined = parts.join("-");
  if (joined === "month-day-year") return "MDY";
  if (joined === "day-month-year") return "DMY";
  if (joined === "year-month-day") return "YMD";
  return "DMY";
}

/**
 * @param {number} year
 * @returns {number | null}
 */
function normalizeYear(year) {
  if (year >= 1000 && year <= 9999) return year;
  if (year >= 0 && year <= 99) return 2000 + year;
  return null;
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
function parseTimeFields(
  hourRaw,
  minuteRaw,
  secondRaw,
  millisecondRaw,
  meridiem,
  allowSeconds,
  allowMilliseconds,
) {
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
  const hadSeconds = Boolean(secondRaw);
  const hadMilliseconds = Boolean(millisecondRaw);
  if (meridiem) {
    if (hourBase < 1 || hourBase > 12) return [];
    const hour = meridiem === "pm" ? (hourBase % 12) + 12 : hourBase % 12;
    return [
      { hour, minute, second, millisecond, assumedMeridiem: false, hadSeconds, hadMilliseconds },
    ];
  }
  if (hourBase < 0 || hourBase > 23) return [];
  if (hourBase >= 13 || hourBase === 0) {
    return [
      {
        hour: hourBase,
        minute,
        second,
        millisecond,
        assumedMeridiem: false,
        hadSeconds,
        hadMilliseconds,
      },
    ];
  }
  return [
    {
      hour: hourBase % 12,
      minute,
      second,
      millisecond,
      assumedMeridiem: true,
      hadSeconds,
      hadMilliseconds,
    },
    {
      hour: (hourBase % 12) + 12,
      minute,
      second,
      millisecond,
      assumedMeridiem: true,
      hadSeconds,
      hadMilliseconds,
    },
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

    let match = token.match(
      /^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?(a|am|p|pm)$/,
    );
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
 * @param {DateBoundaryPreference} timeFavor
 * @returns {{ month: number, day: number, boundary: InferredBoundary }}
 */
function buildYearOnlyDate(timeFavor) {
  if (timeFavor === "end") return { month: 12, day: 31, boundary: "endOfYear" };
  return { month: 1, day: 1, boundary: "startOfYear" };
}

/**
 * @param {Date} now
 * @param {number} targetWeekday
 * @param {DateDayPreference} dayFavor
 */
function getWeekdayDate(now, targetWeekday, dayFavor) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentWeekday = date.getDay();
  if (dayFavor === "past") {
    const delta = (currentWeekday - targetWeekday + 7) % 7;
    date.setDate(date.getDate() - delta);
  } else {
    let delta = (targetWeekday - currentWeekday + 7) % 7;
    if (delta === 0) delta = 7;
    date.setDate(date.getDate() + delta);
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * @param {{ year: number, month: number, day: number }} date
 * @param {number} deltaDays
 */
function shiftDate(date, deltaDays) {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day));
  shifted.setUTCDate(shifted.getUTCDate() + deltaDays);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
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
 * @param {number | null} [weekday]
 */
function addDateCandidate(
  list,
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
  weekday = null,
) {
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
    weekday,
  });
}

/**
 * @param {string[]} tokens
 * @param {Set<number>} consumedTimeIndices
 * @param {Date} now
 * @param {DateOrder} resolvedOrder
 * @param {DateBoundaryPreference} timeFavor
 * @param {DateDayPreference} dayFavor
 * @returns {ParsedDate[]}
 */
function parseDateCandidates(tokens, consumedTimeIndices, now, resolvedOrder, timeFavor, dayFavor) {
  /** @type {ParsedDate[]} */
  const out = [];
  /** @type {Array<{ index: number, a: number, b: number, c: number | null }>} */
  const separated = [];
  /** @type {Array<{ index: number, months: Array<{ month: number, partial: boolean }> }>} */
  const monthWordTokens = [];
  /** @type {Array<{ index: number, value: number }>} */
  const numericTokens = [];
  /** @type {Array<{ index: number, value: number }>} */
  const dayTokens = [];
  /** @type {Array<{ index: number, weekdays: Array<{ weekday: number, partial: boolean }> }>} */
  const weekdayTokens = [];

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
    const weekdays = weekdayMatches(token);
    if (weekdays.length) {
      weekdayTokens.push({ index: i, weekdays });
      continue;
    }
    const day = toDayNumber(token);
    if (day !== null) dayTokens.push({ index: i, value: day });
    const numeric = toInt(token);
    if (numeric !== null) numericTokens.push({ index: i, value: numeric });
  }

  for (const item of separated) {
    const { a, b, c, index } = item;
    if (c !== null) {
      if (a >= 1000 && a <= 9999) {
        addDateCandidate(out, a, b, c, new Set([index]), true, true, true, false, 0, false, "none");
        continue;
      }
      const normalizedYear = normalizeYear(c);
      if (normalizedYear !== null) {
        const pairs = getPairMonthDay(a, b, resolvedOrder);
        for (const pair of pairs) {
          addDateCandidate(
            out,
            normalizedYear,
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
    if (a >= 1000 && a <= 9999 && b >= 1 && b <= 12) {
      const day = timeFavor === "end" ? daysInMonth(a, b) : 1;
      addDateCandidate(
        out,
        a,
        b,
        day,
        new Set([index]),
        true,
        true,
        false,
        false,
        0,
        false,
        timeFavor === "end" ? "endOfMonth" : "startOfMonth",
      );
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

  const dayNumbers = dayTokens;
  const yearNumbers = numericTokens.filter((token) => token.value >= 1000 && token.value <= 9999);
  const shortYearNumbers = numericTokens
    .filter((token) => token.value >= 0 && token.value <= 99)
    .map((token) => ({ index: token.index, value: 2000 + token.value }));
  const candidateYearNumbers = [...yearNumbers, ...shortYearNumbers];
  if (monthWordTokens.length && dayNumbers.length) {
    for (const monthToken of monthWordTokens) {
      for (const monthItem of monthToken.months) {
        for (const dayToken of dayNumbers) {
          const years = candidateYearNumbers.filter((token) => token.index !== dayToken.index);
          if (years.length) {
            for (const yearToken of years) {
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
      const boundaryDate = buildYearOnlyDate(timeFavor);
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
      const firstYear =
        yearNumbers[0] ||
        (nonYear.length >= 3
          ? shortYearNumbers.find(
              (token) => token.index !== first?.index && token.index !== second?.index,
            ) || null
          : null);
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

    if (!numericTokens.length && weekdayTokens.length) {
      const today = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
      const currentWeekday = now.getDay();
      for (const weekdayToken of weekdayTokens) {
        for (const weekdayItem of weekdayToken.weekdays) {
          const pastDate = getWeekdayDate(now, weekdayItem.weekday, "past");
          const upcomingDate = getWeekdayDate(now, weekdayItem.weekday, "future");
          const candidates =
            weekdayItem.weekday === currentWeekday
              ? dayFavor === "future"
                ? [upcomingDate, today, shiftDate(today, -7)]
                : [shiftDate(today, -7), today, upcomingDate]
              : dayFavor === "future"
                ? [upcomingDate, pastDate]
                : [pastDate, upcomingDate];
          for (let orderPenalty = 0; orderPenalty < candidates.length; orderPenalty += 1) {
            const candidate = candidates[orderPenalty];
            if (!candidate) continue;
            addDateCandidate(
              out,
              candidate.year,
              candidate.month,
              candidate.day,
              new Set([weekdayToken.index]),
              false,
              false,
              false,
              false,
              orderPenalty,
              weekdayItem.partial,
              "none",
              weekdayItem.weekday,
            );
          }
        }
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
  if (includeMilliseconds)
    text = `${clockHour}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)} ${meridiem}`;
  return text;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function toDateLabel(year, month, day) {
  const monthName = MONTH_SHORT[month - 1] || MONTH_SHORT[0];
  return `${monthName} ${day}, ${year}`;
}

/**
 * @param {ParsedDate} parsedDate
 * @param {Date} now
 */
function toParsedDateLabel(parsedDate, now) {
  const base = toDateLabel(parsedDate.year, parsedDate.month, parsedDate.day);
  if (parsedDate.weekday == null) return base;
  const weekday = WEEKDAY_LABELS[parsedDate.weekday];
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const candidateUTC = Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  const prefix = candidateUTC < todayUTC ? "Past" : candidateUTC > todayUTC ? "Upcoming" : "Today";
  return `${prefix} ${weekday}, ${base}`;
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
  // Keep locale fixed and parse numeric parts by type only, so we avoid
  // locale-driven day/month order differences while computing zoned parts.
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
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
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
function zonedDateTimeToUTCISOString(
  year,
  month,
  day,
  hour,
  minute,
  second,
  millisecond,
  timezone,
) {
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
    const iso = zonedDateTimeToUTCISOString(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      timezone,
    );
    if (iso) return iso;
  } catch (_error) {}
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond)).toISOString();
}

/**
 * @param {DateParserMode} mode
 * @param {DateBoundaryPreference} timeFavor
 * @param {string} timezone
 * @param {Date} defaultDate
 * @returns {DateSuggestion}
 */
function buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate) {
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth() + 1;
  const day = defaultDate.getDate();
  if (mode === "date") {
    return {
      label: toDateLabel(year, month, day),
      value: toDateValue(year, month, day),
      score: -1000,
      timezone,
      mode,
      inferredBoundary: "none",
      inferredYear: true,
      inferredMonth: true,
      inferredDay: true,
      inferredTime: true,
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    };
  }
  const isEnd = timeFavor === "end";
  const hour = isEnd ? 23 : 0;
  const minute = isEnd ? 59 : 0;
  const second = isEnd ? 59 : 0;
  const millisecond = isEnd ? 999 : 0;
  const inferredBoundary = isEnd ? "endOfDay" : "startOfDay";
  return {
    label: `${toDateLabel(year, month, day)} - ${isEnd ? "end of day" : "start of day"} (${timezone})`,
    value: toDateTimeValue(year, month, day, hour, minute, second, millisecond, timezone),
    score: -1000,
    timezone,
    mode,
    inferredBoundary,
    inferredYear: true,
    inferredMonth: true,
    inferredDay: true,
    inferredTime: true,
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  };
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
  const mode = options.mode || "date";
  const timeFavor = options.timeFavor === "end" ? "end" : "start";
  const dayFavor = options.dayFavor === "future" ? "future" : "past";
  const now = options.now || new Date();
  const defaultDate = options.defaultDate || now;
  const includeDefaultOption = options.includeDefaultOption !== false;
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedOrder = resolveDateOrder(options.dateOrder || "DMY", options.locale);
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);
  const maxOptions = Math.max(1, options.maxOptions || 10);
  if (!normalizedInput) {
    if (!includeDefaultOption) return [];
    return [buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate)];
  }
  const tokens = normalizedInput.split(" ").filter(Boolean);

  const timeCandidates = parseTimeCandidates(tokens, allowSeconds, allowMilliseconds);
  const consumedTimeIndices = new Set();
  for (const time of timeCandidates)
    for (const index of time.usedIndices) consumedTimeIndices.add(index);
  let dateCandidates = parseDateCandidates(
    tokens,
    consumedTimeIndices,
    now,
    resolvedOrder,
    timeFavor,
    dayFavor,
  );

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
        weekday: null,
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
        label: toParsedDateLabel(dateCandidate, now),
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
        const label = `${toParsedDateLabel(dateCandidate, now)} - ${toTimeLabel(
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

    const isEnd =
      dateCandidate.boundary === "endOfDay" ||
      dateCandidate.boundary === "endOfYear" ||
      timeFavor === "end";
    const isYearBoundary =
      dateCandidate.boundary === "startOfYear" || dateCandidate.boundary === "endOfYear";
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
          : inferredBoundary === "startOfMonth"
            ? "start of month"
            : inferredBoundary === "endOfMonth"
              ? "end of month"
              : inferredBoundary === "startOfYear"
                ? "start of year"
                : "end of year";
    const label = `${toParsedDateLabel(dateCandidate, now)} - ${boundaryLabel} (${timezone})`;
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
 * Convert an ISO value back to a display label without running the NLP parser.
 *
 * @param {string} value - ISO string: "2026-03-25" (date) or "2026-03-25T06:00:00.000Z" (datetime)
 * @param {Object} [options]
 * @param {DateParserMode} [options.mode="date"]
 * @param {string} [options.timezone]
 * @param {boolean} [options.allowSeconds=false]
 * @param {boolean} [options.allowMilliseconds=false]
 * @param {(suggestion: { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, timezone: string, mode: DateParserMode }) => string} [options.labelFormatter]
 * @returns {string} The display label, or "" if the value cannot be parsed
 */
export function isoToDisplayLabel(value, options = {}) {
  if (!value) return "";
  const mode = options.mode || "date";
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);

  try {
    if (mode === "date") {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return "";
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      if (!isValidDate(year, month, day)) return "";
      const parts = {
        year,
        month,
        day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        timezone,
        mode,
      };
      if (options.labelFormatter) return options.labelFormatter(parts);
      return toDateLabel(year, month, day);
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const zonedParts = getZonedParts(date.getTime(), timezone);
    const ms = date.getTime() % 1000;
    const parts = {
      year: zonedParts.year,
      month: zonedParts.month,
      day: zonedParts.day,
      hour: zonedParts.hour,
      minute: zonedParts.minute,
      second: zonedParts.second,
      millisecond: ms,
      timezone,
      mode,
    };
    if (options.labelFormatter) return options.labelFormatter(parts);
    const dateStr = toDateLabel(zonedParts.year, zonedParts.month, zonedParts.day);
    const includeSeconds = allowSeconds && (zonedParts.second !== 0 || ms !== 0);
    const includeMs = allowMilliseconds && ms !== 0;
    const timeStr = toTimeLabel(
      zonedParts.hour,
      zonedParts.minute,
      zonedParts.second,
      ms,
      includeSeconds,
      includeMs,
    );
    return `${dateStr} - ${timeStr} (${timezone})`;
  } catch (_error) {
    return "";
  }
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
        timeFavor: options.timeFavor,
        dayFavor: options.dayFavor,
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

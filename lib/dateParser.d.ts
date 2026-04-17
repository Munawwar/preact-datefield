/**
 * Parse user text into ranked date/datetime suggestions.
 *
 * @param {string} input
 * @param {DateParserOptions} [options]
 * @returns {DateSuggestion[]}
 */
export function buildDateSuggestions(input: string, options?: DateParserOptions): DateSuggestion[];
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
export function isoToDisplayLabel(value: string, options?: {
    mode?: DateParserMode | undefined;
    timezone?: string | undefined;
    allowSeconds?: boolean | undefined;
    allowMilliseconds?: boolean | undefined;
    labelFormatter?: ((suggestion: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        timezone: string;
        mode: DateParserMode;
    }) => string) | undefined;
}): string;
/**
 * Validate date text independently from UI concerns.
 *
 * @param {string} input
 * @param {ValidateDateInputOptions} [options]
 * @returns {ValidateDateInputResult}
 */
export function validateDateInput(input: string, options?: ValidateDateInputOptions): ValidateDateInputResult;
export type DateParserMode = "date" | "datetime";
export type DateBoundaryPreference = "start" | "end";
export type DateDayPreference = "past" | "future";
export type DateBounds = "inclusive" | "exclusive";
export type DateOrder = "auto" | "MDY" | "DMY" | "YMD";
export type DateParserOptions = {
    mode?: DateParserMode | undefined;
    timeFavor?: DateBoundaryPreference | undefined;
    dayFavor?: DateDayPreference | undefined;
    timezone?: string | undefined;
    now?: Date | undefined;
    locale?: string | undefined;
    dateOrder?: DateOrder | undefined;
    allowSeconds?: boolean | undefined;
    allowMilliseconds?: boolean | undefined;
    includeDefaultOption?: boolean | undefined;
    defaultDate?: Date | undefined;
    minValue?: string | undefined;
    maxValue?: string | undefined;
    bounds?: DateBounds | undefined;
    maxOptions?: number | undefined;
};
export type InferredBoundary = "none" | "startOfDay" | "endOfDay" | "startOfMonth" | "endOfMonth" | "startOfYear" | "endOfYear";
export type DateSuggestion = {
    label: string;
    value: string;
    score: number;
    timezone: string;
    mode: DateParserMode;
    inferredBoundary: InferredBoundary;
    inferredYear: boolean;
    inferredMonth: boolean;
    inferredDay: boolean;
    inferredTime: boolean;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
};
export type ValidateDateInputOptions = {
    required?: boolean | undefined;
    mode?: DateParserMode | undefined;
    timeFavor?: DateBoundaryPreference | undefined;
    dayFavor?: DateDayPreference | undefined;
    timezone?: string | undefined;
    now?: Date | undefined;
    locale?: string | undefined;
    dateOrder?: DateOrder | undefined;
    allowSeconds?: boolean | undefined;
    allowMilliseconds?: boolean | undefined;
    minValue?: string | undefined;
    maxValue?: string | undefined;
    bounds?: DateBounds | undefined;
    maxOptions?: number | undefined;
};
export type ValidateDateInputResult = {
    isValid: boolean;
    isEmpty: boolean;
    reason: "empty" | "invalid" | null;
    suggestions: DateSuggestion[];
};
export type ParsedTime = {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    usedIndices: Set<number>;
    assumedMeridiem: boolean;
    hadSeconds: boolean;
    hadMilliseconds: boolean;
};
export type ParsedDate = {
    year: number;
    month: number;
    day: number;
    usedIndices: Set<number>;
    explicitYear: boolean;
    explicitMonth: boolean;
    explicitDay: boolean;
    ambiguousOrder: boolean;
    orderPenalty: number;
    partialMonth: boolean;
    boundary: InferredBoundary;
    weekday: number | null;
};

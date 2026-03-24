/**
 * Parse user text into ranked date/datetime suggestions.
 *
 * @param {string} input
 * @param {DateParserOptions} [options]
 * @returns {DateSuggestion[]}
 */
export function buildDateSuggestions(input: string, options?: DateParserOptions): DateSuggestion[];
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
export type DateOrder = "auto" | "MDY" | "DMY" | "YMD";
export type DateParserOptions = {
    mode?: DateParserMode | undefined;
    favor?: DateBoundaryPreference | undefined;
    timezone?: string | undefined;
    now?: Date | undefined;
    locale?: string | undefined;
    dateOrder?: DateOrder | undefined;
    allowSeconds?: boolean | undefined;
    allowMilliseconds?: boolean | undefined;
    maxOptions?: number | undefined;
};
export type InferredBoundary = "none" | "startOfDay" | "endOfDay" | "startOfYear" | "endOfYear";
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
    favor?: DateBoundaryPreference | undefined;
    timezone?: string | undefined;
    now?: Date | undefined;
    locale?: string | undefined;
    dateOrder?: DateOrder | undefined;
    allowSeconds?: boolean | undefined;
    allowMilliseconds?: boolean | undefined;
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
};

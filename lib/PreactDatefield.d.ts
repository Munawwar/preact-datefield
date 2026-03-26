export default PreactDatefield;
export type DateSuggestion = import("./dateParser.js").DateSuggestion;
export type DateParserMode = import("./dateParser.js").DateParserMode;
export type DateBoundaryPreference = import("./dateParser.js").DateBoundaryPreference;
export type DateDayPreference = import("./dateParser.js").DateDayPreference;
export type DateOrder = import("./dateParser.js").DateOrder;
export type PreactDatefieldProps = {
    /**
     * The id of the component
     */
    id: string;
    /**
     * name for hidden input element
     */
    name?: string | undefined;
    /**
     * Additional class names
     */
    className?: string | undefined;
    /**
     * ISO string: "2026-03-25" or "2026-03-25T06:00:00.000Z", or ""
     */
    value: string;
    /**
     * Called with ISO string or "" when cleared
     */
    onChange: (value: string) => void;
    /**
     * Optional blur callback
     */
    onBlur?: ((event: FocusEvent) => void) | undefined;
    /**
     * Date-only or datetime mode
     */
    mode?: import("./dateParser.js").DateParserMode | undefined;
    /**
     * Boundary preference for inferred times
     */
    timeFavor?: import("./dateParser.js").DateBoundaryPreference | undefined;
    /**
     * Deprecated alias for timeFavor
     */
    favor?: import("./dateParser.js").DateBoundaryPreference | undefined;
    /**
     * Direction preference for weekday-only input
     */
    dayFavor?: import("./dateParser.js").DateDayPreference | undefined;
    /**
     * IANA timezone string. Default: auto-detect
     */
    timezone?: string | undefined;
    /**
     * Numeric date order preference
     */
    dateOrder?: import("./dateParser.js").DateOrder | undefined;
    /**
     * BCP 47 locale for dateOrder resolution
     */
    locale?: string | undefined;
    /**
     * Allow seconds in time input
     */
    allowSeconds?: boolean | undefined;
    /**
     * Allow milliseconds in time input
     */
    allowMilliseconds?: boolean | undefined;
    /**
     * Custom display label formatter
     */
    labelFormatter?: ((parts: {
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
    /**
     * Input placeholder text
     */
    placeholder?: string | undefined;
    /**
     * Required for form validation
     */
    required?: boolean | undefined;
    /**
     * Disable the component
     */
    disabled?: boolean | undefined;
    /**
     * Render a hidden input for form submission
     */
    formSubmitCompatible?: boolean | undefined;
    /**
     * Theme
     */
    theme?: "light" | "dark" | "system" | undefined;
    /**
     * Enable mobile tray mode
     */
    tray?: boolean | "auto" | undefined;
    /**
     * CSS breakpoint for auto tray mode
     */
    trayBreakpoint?: string | undefined;
    /**
     * Label text for tray header
     */
    trayLabel?: string | undefined;
    /**
     * Show clear button
     */
    showClearButton?: boolean | undefined;
    /**
     * Portal target element
     */
    portal?: HTMLElement | undefined;
    /**
     * Root element props
     */
    rootElementProps?: Record<string, any> | undefined;
    /**
     * Input element props
     */
    inputProps?: Record<string, any> | undefined;
    /**
     * Maximum number of suggestions
     */
    maxSuggestions?: number | undefined;
};
export type OptionsListboxRef = import("./OptionsListbox.jsx").OptionsListboxRef;
export type Translations = {
    searchPlaceholder: string;
    noOptionsFound: string;
    clearValue: string;
};
/**
 * PreactDatefield component - a date input with autocomplete suggestions
 * @param {PreactDatefieldProps} props
 */
declare function PreactDatefield({ id: idProp, name, className, value, onChange, onBlur: onBlurProp, mode, timeFavor, favor, dayFavor, timezone: timezoneProp, dateOrder, locale, allowSeconds, allowMilliseconds, labelFormatter, placeholder, required, disabled, formSubmitCompatible, theme, tray, trayBreakpoint, trayLabel: trayLabelProp, showClearButton, portal, rootElementProps, inputProps, maxSuggestions, }: PreactDatefieldProps): import("preact").JSX.Element;
export { buildDateSuggestions, isoToDisplayLabel } from "./dateParser.js";

import { createPopper } from "@popperjs/core";
import { createPortal } from "preact/compat";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import OptionsListbox from "./OptionsListbox.jsx";
import TraySearchList from "./TraySearchList.jsx";
import { buildDateSuggestions, isoToDisplayLabel } from "./dateParser.js";
import { subscribeToVirtualKeyboard, useLive } from "./hooks.js";
import { toHTMLId } from "./utils.jsx";
import "./PreactDatefield.css";

// --- types ---
/** @typedef {import("./dateParser.js").DateSuggestion} DateSuggestion */
/** @typedef {import("./dateParser.js").DateParserMode} DateParserMode */
/** @typedef {import("./dateParser.js").DateBoundaryPreference} DateBoundaryPreference */
/** @typedef {import("./dateParser.js").DateDayPreference} DateDayPreference */
/** @typedef {import("./dateParser.js").DateBounds} DateBounds */
/** @typedef {import("./dateParser.js").DateOrder} DateOrder */

/**
 * @typedef {Object} PreactDatefieldProps
 * @property {string} id The id of the component
 * @property {string} [name] name for hidden input element
 * @property {string} [className] Additional class names
 * @property {string} value ISO string: "2026-03-25" or "2026-03-25T06:00:00.000Z", or ""
 * @property {(value: string) => void} onChange Called with ISO string or "" when cleared
 * @property {(event: FocusEvent) => void} [onBlur] Optional blur callback
 * @property {DateParserMode} [mode="date"] Date-only or datetime mode
 * @property {DateBoundaryPreference} [timeFavor="start"] Boundary preference for inferred times
 * @property {DateBoundaryPreference} [favor] Deprecated alias for timeFavor
 * @property {DateDayPreference} [dayFavor="past"] Direction preference for weekday-only input
 * @property {string} [timezone] IANA timezone string. Default: auto-detect
 * @property {DateOrder} [dateOrder="auto"] Numeric date order preference
 * @property {string} [locale="en-US"] BCP 47 locale for dateOrder resolution
 * @property {boolean} [allowSeconds=false] Allow seconds in time input
 * @property {boolean} [allowMilliseconds=false] Allow milliseconds in time input
 * @property {string} [minValue] Minimum allowed ISO value
 * @property {string} [maxValue] Maximum allowed ISO value
 * @property {DateBounds} [bounds="inclusive"] Range bounds behavior for min/max
 * @property {(parts: { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, timezone: string, mode: DateParserMode }) => string} [labelFormatter] Custom display label formatter
 * @property {string} [placeholder] Input placeholder text
 * @property {boolean} [required=false] Required for form validation
 * @property {boolean} [disabled=false] Disable the component
 * @property {boolean} [formSubmitCompatible=false] Render a hidden input for form submission
 * @property {'light' | 'dark' | 'system'} [theme='system'] Theme
 * @property {boolean | 'auto'} [tray='auto'] Enable mobile tray mode
 * @property {string} [trayBreakpoint='768px'] CSS breakpoint for auto tray mode
 * @property {string} [trayLabel] Label text for tray header
 * @property {boolean} [showClearButton=true] Show clear button
 * @property {HTMLElement} [portal] Portal target element
 * @property {Record<string, any>} [rootElementProps] Root element props
 * @property {Record<string, any>} [inputProps] Input element props
 * @property {number} [maxSuggestions=10] Maximum number of suggestions
 */

// --- end of types ---

/** @typedef {import("./OptionsListbox.jsx").OptionsListboxRef} OptionsListboxRef */

/**
 * @typedef {Object} Translations
 * @property {string} searchPlaceholder
 * @property {string} noOptionsFound
 * @property {string} clearValue
 */

/** @type {Translations} */
const defaultTranslations = {
  searchPlaceholder: "Type a date...",
  noOptionsFound: "No dates found",
  clearValue: "Clear date",
};

/**
 * @param {Object} props
 * @param {HTMLElement} [props.parent]
 * @param {import("preact").VNode} props.children
 * @param {import("preact").RefObject<HTMLElement>} [props.rootElementRef]
 */
const Portal = ({ parent = document.body, children, rootElementRef }) => {
  const [dir, setDir] = useState(/** @type {string|null} */ (null));

  useEffect(() => {
    if (rootElementRef?.current) {
      const rootDir = window.getComputedStyle(rootElementRef.current).direction;
      const parentDir = window.getComputedStyle(parent).direction;
      if (rootDir !== parentDir) {
        setDir(rootDir);
      } else {
        setDir(null);
      }
    }
  }, [rootElementRef, parent]);

  const wrappedChildren = dir ? (
    <div dir={/** @type {"auto" | "rtl" | "ltr"} */ (dir)} style={{ direction: dir }}>
      {children}
    </div>
  ) : (
    children
  );

  return createPortal(wrappedChildren, parent);
};

const dropdownPopperModifiers = [
  {
    name: "flip",
    enabled: true,
  },
  {
    name: "referenceElementWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    // @ts-ignore
    fn: ({ state }) => {
      state.styles.popper.minWidth = `${state.rects.reference.width}px`;
    },
    // @ts-ignore
    effect: ({ state }) => {
      state.elements.popper.style.minWidth = `${state.elements.reference.offsetWidth}px`;
    },
  },
  {
    name: "eventListeners",
    enabled: true,
    options: {
      scroll: true,
      resize: true,
    },
  },
];

const defaultChevronIcon = (
  <svg
    className="PreactDatefield-chevron"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

/**
 * Convert DateSuggestion[] to the OptionMatch[] shape that OptionsListbox expects.
 * @param {DateSuggestion[]} suggestions
 * @returns {import("./OptionsListbox.jsx").OptionsListboxProps['filteredOptions']}
 */
function suggestionsToOptions(suggestions) {
  return suggestions.map((s) => ({
    label: s.label,
    value: s.value,
    score: s.score,
    matched: /** @type {const} */ ("label"),
    matchSlices: [],
  }));
}

/**
 * PreactDatefield component - a date input with autocomplete suggestions
 * @param {PreactDatefieldProps} props
 */
const PreactDatefield = ({
  id: idProp,
  name,
  className = "",
  value,
  onChange,
  onBlur: onBlurProp,
  mode = "date",
  timeFavor,
  favor,
  dayFavor = "past",
  timezone: timezoneProp,
  dateOrder = "auto",
  locale = "en-US",
  allowSeconds = false,
  allowMilliseconds = false,
  minValue,
  maxValue,
  bounds = "inclusive",
  labelFormatter,
  placeholder = "",
  required = false,
  disabled = false,
  formSubmitCompatible = false,
  theme = "system",
  tray = "auto",
  trayBreakpoint = "768px",
  trayLabel: trayLabelProp,
  showClearButton = true,
  portal = document.body,
  rootElementProps,
  inputProps = {},
  maxSuggestions = 10,
}) => {
  const timezone = timezoneProp || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedTimeFavor = /** @type {DateBoundaryPreference} */ (
    timeFavor === "end" || (timeFavor == null && favor === "end") ? "end" : "start"
  );

  const autoId = useId();
  const id = idProp || autoId;

  // Input text state
  const [inputValue, setInputValue] = useState("");
  const [getIsDropdownOpen, setIsDropdownOpen] = useLive(false);
  const [getIsFocused, setIsFocused] = useLive(false);
  const [announcement, setAnnouncement] = useState("");

  const optionsListboxRef = useRef(/** @type {OptionsListboxRef | null} */ (null));
  const [activeDescendantValue, setActiveDescendantValue] = useState("");
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const blurTimeoutRef = useRef(/** @type {number | undefined} */ (undefined));
  const rootElementRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const dropdownPopperRef = useRef(/** @type {HTMLUListElement | null} */ (null));
  const dropdownClosedExplicitlyRef = useRef(false);
  const [getTrayLabel, setTrayLabel] = useLive(trayLabelProp);

  // Track previous valid value for blur revert
  const previousValidValueRef = useRef(value || "");
  useEffect(() => {
    if (value) previousValidValueRef.current = value;
  }, [value]);

  // Tray state
  const [getIsTrayOpen, setIsTrayOpen] = useLive(false);
  const trayClosedExplicitlyRef = useRef(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [trayActiveInputValue, setTrayActiveInputValue] = useState("");

  useEffect(() => {
    if (tray === "auto") {
      const mediaQuery = window.matchMedia(`(max-width: ${trayBreakpoint})`);
      setIsMobileScreen(mediaQuery.matches);
      const handleChange = (/** @type {MediaQueryListEvent} */ e) => setIsMobileScreen(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [tray, trayBreakpoint]);

  const shouldUseTray = tray === true || (tray === "auto" && isMobileScreen);
  const activeInputValue = getIsTrayOpen() ? trayActiveInputValue : inputValue;

  // Compute display label from current value
  const displayLabel = useMemo(
    () =>
      isoToDisplayLabel(value, { mode, timezone, allowSeconds, allowMilliseconds, labelFormatter }),
    [value, mode, timezone, allowSeconds, allowMilliseconds, labelFormatter],
  );

  // Parser options
  const parserOptions = useMemo(
    () => ({
      mode,
      timeFavor: resolvedTimeFavor,
      dayFavor,
      timezone,
      dateOrder,
      locale,
      allowSeconds,
      allowMilliseconds,
      minValue,
      maxValue,
      bounds,
      maxOptions: maxSuggestions,
    }),
    [
      mode,
      resolvedTimeFavor,
      dayFavor,
      timezone,
      dateOrder,
      locale,
      allowSeconds,
      allowMilliseconds,
      minValue,
      maxValue,
      bounds,
      maxSuggestions,
    ],
  );

  // Compute suggestions from input text
  const suggestions = useMemo(
    () => buildDateSuggestions(activeInputValue, parserOptions),
    [activeInputValue, parserOptions],
  );
  const filteredOptions = useMemo(() => suggestionsToOptions(suggestions), [suggestions]);

  // Tray label computation
  const computeEffectiveTrayLabel = useCallback(() => {
    if (trayLabelProp) return trayLabelProp;
    if (typeof self === "undefined" || !inputRef.current) return "";
    const inputElement = inputRef.current;
    const ariaLabelledBy = inputElement.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent?.trim() || "";
    }
    const ariaLabel = inputElement.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();
    if (inputElement.id) {
      const labelElement = document.querySelector(`label[for="${inputElement.id}"]`);
      if (labelElement) return labelElement.textContent?.trim() || "";
    }
    const wrappingLabel = inputElement.closest("label");
    if (wrappingLabel) return wrappingLabel.textContent?.trim() || "";
    const title = inputElement.getAttribute("title");
    if (title) return title.trim();
    return "";
  }, [trayLabelProp]);

  useLayoutEffect(() => {
    setTrayLabel(computeEffectiveTrayLabel());
  }, [setTrayLabel, computeEffectiveTrayLabel]);

  const isListOpen = shouldUseTray ? getIsTrayOpen() : getIsDropdownOpen();

  const handleActiveDescendantChange = useCallback(
    /** @param {string} val */ (val) => setActiveDescendantValue(val),
    [],
  );

  const closeDropdown = useCallback(
    (closedExplicitly = false) => {
      setIsDropdownOpen(false);
      if (dropdownPopperRef.current) {
        // @ts-ignore
        dropdownPopperRef.current.style.display = "none";
      }
      if (closedExplicitly) {
        dropdownClosedExplicitlyRef.current = true;
      }
      optionsListboxRef.current?.clearActiveDescendant();
    },
    [setIsDropdownOpen],
  );

  // Setup popper
  useEffect(() => {
    if (
      getIsDropdownOpen() &&
      !shouldUseTray &&
      rootElementRef.current &&
      dropdownPopperRef.current
    ) {
      const computedDir = window.getComputedStyle(rootElementRef.current).direction;
      const placement = computedDir === "rtl" ? "bottom-end" : "bottom-start";
      const popperInstance = createPopper(rootElementRef.current, dropdownPopperRef.current, {
        placement,
        // @ts-ignore
        modifiers: dropdownPopperModifiers,
      });
      dropdownPopperRef.current.style.display = "block";
      return () => popperInstance.destroy();
    }
    if (shouldUseTray && dropdownPopperRef.current) {
      dropdownPopperRef.current.style.display = "none";
    }
  }, [getIsDropdownOpen, shouldUseTray]);

  /** Handle selecting a suggestion */
  const handleOptionSelect = useCallback(
    /** @param {string} selectedValue */
    (selectedValue) => {
      onChange(selectedValue);
      // Resolve display label from the suggestion
      const match = suggestions.find((s) => s.value === selectedValue);
      if (match) {
        const label = labelFormatter ? labelFormatter(match) : match.label;
        setInputValue(label);
        setAnnouncement(`Selected ${label}`);
      }
      closeDropdown();
      // Blur will normalize, but also set it now for immediate feedback
    },
    [onChange, suggestions, labelFormatter, closeDropdown],
  );

  /**
   * @type {import('preact').RefObject<boolean|null>}
   */
  const virtualKeyboardExplicitlyClosedRef = useRef(null);
  const virtualKeyboardDismissSubscription = useRef(/** @type {function | null} */ (null));

  const focusInputWithVirtualKeyboardGuard = useCallback(
    /**
     * @param {Object} params
     * @param {HTMLInputElement | null} params.input
     * @param {boolean} [params.shouldPreventKeyboardReopen]
     * @param {boolean} [params.forceOpenKeyboard]
     */
    (params) => {
      const { input, shouldPreventKeyboardReopen = false, forceOpenKeyboard = false } = params;
      if (!input) return;
      const shouldTemporarilyDisableInput = shouldPreventKeyboardReopen && !forceOpenKeyboard;
      if (shouldTemporarilyDisableInput) {
        input.setAttribute("readonly", "readonly");
      }
      input.focus();
      if (shouldTemporarilyDisableInput) {
        setTimeout(() => input.removeAttribute("readonly"), 10);
      }
    },
    [],
  );

  const focusInput = useCallback(
    (forceOpenKeyboard = false) => {
      focusInputWithVirtualKeyboardGuard({
        input: inputRef.current,
        shouldPreventKeyboardReopen:
          getIsFocused() && virtualKeyboardExplicitlyClosedRef.current === true,
        forceOpenKeyboard,
      });
    },
    [getIsFocused, focusInputWithVirtualKeyboardGuard],
  );

  const openTray = useCallback(() => {
    if (!shouldUseTray) return;
    setIsTrayOpen(true);
    setIsDropdownOpen(false);
    trayClosedExplicitlyRef.current = false;
  }, [shouldUseTray, setIsDropdownOpen, setIsTrayOpen]);

  const closeTray = useCallback(() => {
    setIsTrayOpen(false);
    setTrayActiveInputValue("");
    trayClosedExplicitlyRef.current = true;
    focusInput(true);
  }, [setIsTrayOpen, focusInput]);

  const handleInputChange = useCallback(
    /** @param {import('preact/compat').ChangeEvent<HTMLInputElement>} e */
    (e) => {
      if (shouldUseTray) {
        e.preventDefault();
        openTray();
        return;
      }
      setInputValue(e.currentTarget.value);
      if (!dropdownClosedExplicitlyRef.current) {
        setIsDropdownOpen(true);
      }
    },
    [setIsDropdownOpen, shouldUseTray, openTray],
  );

  const handleTrayInputChange = useCallback(
    /** @param {string} val */
    (val) => setTrayActiveInputValue(val),
    [],
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = undefined;

    if (shouldUseTray) {
      if (!trayClosedExplicitlyRef.current) openTray();
      trayClosedExplicitlyRef.current = false;
    } else {
      // Select all text on focus if there's a value, for easy replacement
      if (value && inputRef.current) {
        inputRef.current.select();
      }
      // Only open dropdown if user has typed something
      if (inputValue) {
        setIsDropdownOpen(true);
      }
      dropdownClosedExplicitlyRef.current = false;
      if (!virtualKeyboardDismissSubscription.current) {
        virtualKeyboardDismissSubscription.current = subscribeToVirtualKeyboard({
          visibleCallback(isVisible) {
            virtualKeyboardExplicitlyClosedRef.current = !isVisible;
          },
        });
      }
    }
  }, [setIsFocused, setIsDropdownOpen, openTray, shouldUseTray, value, inputValue]);

  // Blur normalization
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = undefined;
    closeDropdown();
    dropdownClosedExplicitlyRef.current = false;

    const text = inputRef.current?.value?.trim() || "";
    const input = inputRef.current;

    if (!text) {
      // Field cleared
      if (value !== "") onChange("");
      if (input) {
        input.setCustomValidity(required ? "Please select a date" : "");
      }
      setInputValue("");
    } else if (text === displayLabel) {
      // No change
      if (input) input.setCustomValidity("");
    } else {
      // Try to parse and auto-commit best match
      const results = buildDateSuggestions(text, parserOptions);
      const best = results[0];
      if (best) {
        onChange(best.value);
        const bestLabel = labelFormatter ? labelFormatter(best) : best.label;
        setInputValue(bestLabel);
        if (input) input.setCustomValidity("");
        setAnnouncement(`Selected ${bestLabel}`);
      } else {
        // Invalid - revert or clear
        if (previousValidValueRef.current) {
          const prevLabel = isoToDisplayLabel(previousValidValueRef.current, {
            mode,
            timezone,
            allowSeconds,
            allowMilliseconds,
            labelFormatter,
          });
          setInputValue(prevLabel);
          if (input) input.setCustomValidity("");
        } else {
          setInputValue("");
          onChange("");
          if (input) {
            input.setCustomValidity(required ? "Please enter a valid date" : "");
          }
        }
      }
    }

    setAnnouncement("");
    if (!shouldUseTray) {
      virtualKeyboardDismissSubscription.current?.();
      virtualKeyboardDismissSubscription.current = null;
      virtualKeyboardExplicitlyClosedRef.current = null;
    }

    if (onBlurProp && inputRef.current) {
      onBlurProp(new FocusEvent("blur"));
    }
  }, [
    setIsFocused,
    closeDropdown,
    shouldUseTray,
    value,
    onChange,
    required,
    displayLabel,
    parserOptions,
    labelFormatter,
    mode,
    timezone,
    allowSeconds,
    allowMilliseconds,
    onBlurProp,
  ]);

  const handleKeyDown = useCallback(
    /** @param {import('preact/compat').KeyboardEvent<HTMLInputElement>} e */
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        optionsListboxRef.current?.selectActive();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigateDown();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigateUp();
      } else if (e.key === "Escape") {
        // Revert to display label
        setInputValue(displayLabel);
        closeDropdown(true);
      } else if (e.key === "Home" && (e.ctrlKey || !inputValue) && getIsDropdownOpen()) {
        e.preventDefault();
        optionsListboxRef.current?.navigateToFirst();
      } else if (e.key === "End" && (e.ctrlKey || !inputValue) && getIsDropdownOpen()) {
        e.preventDefault();
        optionsListboxRef.current?.navigateToLast();
      } else if (e.key === "PageDown") {
        e.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigatePageDown();
      } else if (e.key === "PageUp") {
        e.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigatePageUp();
      }
    },
    [inputValue, displayLabel, getIsDropdownOpen, setIsDropdownOpen, closeDropdown],
  );

  const handleClearValue = useCallback(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e) => {
      // Prevent the click on the clear button to focus on the input on
      // mobile which opens up the keyboard and mobile tray.
      e.stopPropagation();
      setInputValue("");
      onChange("");
      setAnnouncement("Date cleared");
      if (inputRef.current) {
        inputRef.current.setCustomValidity(required ? "Please select a date" : "");
      }
    },
    [onChange, required],
  );

  const handleClearMouseDown = useCallback(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e) => {
      e.preventDefault();
    },
    [],
  );

  const handleRootElementClick = useCallback(() => {
    if (disabled) return;
    if (shouldUseTray) {
      openTray();
    } else {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        focusInput(true);
      }
      setIsDropdownOpen(true);
      dropdownClosedExplicitlyRef.current = false;
    }
  }, [disabled, shouldUseTray, openTray, focusInput, setIsDropdownOpen]);

  // When value changes externally, update the input display
  useEffect(() => {
    if (!getIsFocused()) {
      setInputValue(displayLabel);
    }
  }, [displayLabel, getIsFocused]);

  const setDropdownRef = useCallback(
    /** @param {HTMLUListElement | null} el */
    (el) => {
      dropdownPopperRef.current = el;
    },
    [],
  );

  const optionsListbox = (
    <OptionsListbox
      ref={optionsListboxRef}
      id={id}
      searchText={activeInputValue}
      filteredOptions={filteredOptions}
      isLoading={false}
      arrayValues={value ? [value] : []}
      invalidValues={[]}
      multiple={false}
      allowFreeText={false}
      onOptionSelect={handleOptionSelect}
      onActiveDescendantChange={handleActiveDescendantChange}
      onClose={shouldUseTray ? closeTray : closeDropdown}
      showValue={false}
      language="en"
      translations={defaultTranslations}
      theme={theme}
      maxPresentedOptions={maxSuggestions}
      isOpen={isListOpen}
      shouldUseTray={shouldUseTray}
      setDropdownRef={setDropdownRef}
    />
  );

  return (
    <div
      className={[
        className,
        "PreactDatefield",
        disabled ? "PreactDatefield--disabled" : "",
        `PreactDatefield--${theme}`,
        tray === "auto" ? "PreactDatefield--trayAuto" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-disabled={disabled}
      onClick={handleRootElementClick}
      id={`${id}-root`}
      ref={rootElementRef}
      {...rootElementProps}
    >
      {/* Screen reader announcements */}
      <div className="PreactDatefield-srOnly" aria-live="polite" aria-atomic="true">
        {getIsFocused() ? announcement : ""}
      </div>

      <div className={`PreactDatefield-field ${disabled ? "PreactDatefield-field--disabled" : ""}`}>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={
            !shouldUseTray && getIsDropdownOpen()
              ? defaultTranslations.searchPlaceholder
              : displayLabel || placeholder
          }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={() => {
            // @ts-ignore
            blurTimeoutRef.current = setTimeout(handleInputBlur, 200);
          }}
          className={`PreactDatefield-input ${disabled ? "PreactDatefield-input--disabled" : ""}`}
          role="combobox"
          aria-expanded={getIsDropdownOpen()}
          aria-haspopup="listbox"
          aria-controls={`${id}-options-listbox`}
          aria-activedescendant={
            activeDescendantValue ? `${id}-option-${toHTMLId(activeDescendantValue)}` : undefined
          }
          autocomplete="off"
          disabled={disabled}
          required={required && !value}
          {...inputProps}
        />
        {!disabled && showClearButton && value ? (
          <button
            type="button"
            className="PreactDatefield-clearButton"
            aria-label={defaultTranslations.clearValue}
            onMouseDown={handleClearMouseDown}
            onClick={handleClearValue}
          >
            <span aria-hidden="true">&#x2715;</span>
          </button>
        ) : null}
        {defaultChevronIcon}

        {formSubmitCompatible ? <input type="hidden" name={name} value={value || ""} /> : null}
      </div>

      <Portal parent={portal} rootElementRef={rootElementRef}>
        {shouldUseTray ? (
          <TraySearchList
            id={id}
            isOpen={getIsTrayOpen()}
            onClose={closeTray}
            trayLabel={getTrayLabel() || ""}
            theme={theme}
            translations={defaultTranslations}
            onInputChange={handleTrayInputChange}
          >
            {optionsListbox}
          </TraySearchList>
        ) : (
          optionsListbox
        )}
      </Portal>
    </div>
  );
};

export { buildDateSuggestions, isoToDisplayLabel } from "./dateParser.js";
export default PreactDatefield;

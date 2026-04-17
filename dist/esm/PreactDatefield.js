// lib/PreactDatefield.jsx
import { createPopper } from "@popperjs/core";
import { createPortal } from "preact/compat";
import {
  useCallback as useCallback4,
  useEffect as useEffect4,
  useId,
  useLayoutEffect,
  useMemo as useMemo2,
  useRef as useRef4,
  useState as useState4
} from "preact/hooks";

// lib/OptionsListbox.jsx
import { forwardRef } from "preact/compat";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "preact/hooks";

// lib/utils.jsx
import { jsx } from "preact/jsx-runtime";
function toHTMLId(text) {
  return text.replace(/[^a-zA-Z0-9\-_:.]/g, "");
}

// lib/OptionsListbox.jsx
import { Fragment, jsx as jsx2, jsxs } from "preact/jsx-runtime";
var OptionsListbox = forwardRef(
  ({
    id,
    searchText,
    filteredOptions,
    isLoading,
    arrayValues,
    invalidValues,
    multiple,
    allowFreeText,
    onOptionSelect,
    onActiveDescendantChange,
    onClose,
    optionRenderer,
    warningIcon,
    tickIcon,
    optionIconRenderer,
    showValue,
    language,
    loadingRenderer,
    translations,
    theme,
    maxPresentedOptions,
    isOpen,
    shouldUseTray,
    setDropdownRef
  }, ref) => {
    const [activeDescendant, setActiveDescendant] = useState("");
    const listRef = useRef(
      /** @type {HTMLUListElement | null} */
      null
    );
    const searchTextTrimmed = searchText.trim();
    const addNewOptionVisible = !isLoading && allowFreeText && searchTextTrimmed && !arrayValues.includes(searchTextTrimmed) && !filteredOptions.find((o) => o.value === searchTextTrimmed);
    const scrollOptionIntoView = useCallback(
      /** @param {string} optionValue */
      (optionValue) => {
        if (!listRef.current || !optionValue) return;
        const elementId = `${id}-option-${toHTMLId(optionValue)}`;
        const element = listRef.current.querySelector(`#${CSS.escape(elementId)}`);
        if (element) {
          const listRect = listRef.current.getBoundingClientRect();
          const itemRect = element.getBoundingClientRect();
          if (itemRect.bottom > listRect.bottom) {
            listRef.current.scrollTop += itemRect.bottom - listRect.bottom;
          } else if (itemRect.top < listRect.top) {
            listRef.current.scrollTop += itemRect.top - listRect.top;
          }
        }
      },
      [id]
    );
    const getNavigableOptions = useCallback(() => {
      const options = filteredOptions.filter((o) => !o.disabled).map((o) => o.value);
      if (addNewOptionVisible) {
        return [searchTextTrimmed, ...options];
      }
      return options;
    }, [filteredOptions, addNewOptionVisible, searchTextTrimmed]);
    useImperativeHandle(
      ref,
      () => ({
        navigateDown: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : -1;
          const nextIndex = currentIndex === options.length - 1 ? 0 : currentIndex + 1;
          const nextValue = options[nextIndex];
          if (nextValue !== void 0) {
            setActiveDescendant(nextValue);
            scrollOptionIntoView(nextValue);
          }
        },
        navigateUp: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : 0;
          const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
          const prevValue = options[prevIndex];
          if (prevValue !== void 0) {
            setActiveDescendant(prevValue);
            scrollOptionIntoView(prevValue);
          }
        },
        navigateToFirst: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstValue = options[0];
          if (firstValue !== void 0) {
            setActiveDescendant(firstValue);
            scrollOptionIntoView(firstValue);
          }
        },
        navigateToLast: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const lastValue = options[options.length - 1];
          if (lastValue !== void 0) {
            setActiveDescendant(lastValue);
            scrollOptionIntoView(lastValue);
          }
        },
        navigatePageDown: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize = listRef.current && firstOptionEl ? Math.max(
            1,
            Math.floor(
              listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height
            )
          ) : 10;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : -1;
          const targetIndex = Math.min(currentIndex + pageSize, options.length - 1);
          const targetValue = options[targetIndex];
          if (targetValue !== void 0) {
            setActiveDescendant(targetValue);
            scrollOptionIntoView(targetValue);
          }
        },
        navigatePageUp: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize = listRef.current && firstOptionEl ? Math.max(
            1,
            Math.floor(
              listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height
            )
          ) : 10;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : options.length;
          const targetIndex = Math.max(currentIndex - pageSize, 0);
          const targetValue = options[targetIndex];
          if (targetValue !== void 0) {
            setActiveDescendant(targetValue);
            scrollOptionIntoView(targetValue);
          }
        },
        selectActive: () => {
          if (!activeDescendant) return false;
          if (addNewOptionVisible && activeDescendant === searchTextTrimmed) {
            onOptionSelect(searchTextTrimmed);
            if (!multiple && onClose) {
              onClose();
            }
            return true;
          }
          const option = filteredOptions.find(
            (o) => o.value === activeDescendant
          );
          if (option && !option.disabled) {
            onOptionSelect(option.value, { toggleSelected: true });
            if (!multiple && onClose) {
              onClose();
            }
            return true;
          }
          return false;
        },
        getActiveDescendant: () => activeDescendant,
        setActiveDescendant: (value) => {
          setActiveDescendant(value);
          scrollOptionIntoView(value);
        },
        clearActiveDescendant: () => setActiveDescendant("")
      }),
      [
        activeDescendant,
        getNavigableOptions,
        scrollOptionIntoView,
        addNewOptionVisible,
        searchTextTrimmed,
        filteredOptions,
        onOptionSelect,
        multiple,
        onClose
      ]
    );
    useEffect(() => {
      if (!isOpen) {
        setActiveDescendant("");
      }
    }, [isOpen]);
    useEffect(() => {
      onActiveDescendantChange?.(activeDescendant);
    }, [activeDescendant, onActiveDescendantChange]);
    const handleListRef = useCallback(
      /** @param {HTMLUListElement | null} el */
      (el) => {
        listRef.current = el;
        if (setDropdownRef && !shouldUseTray) {
          setDropdownRef(el);
        }
      },
      [setDropdownRef, shouldUseTray]
    );
    if (!isOpen) {
      return null;
    }
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      /* @__PURE__ */ jsx2(
        "ul",
        {
          className: [
            "PreactDatefield-options",
            `PreactDatefield--${theme}`,
            shouldUseTray ? "PreactDatefield-options--tray" : ""
          ].filter(Boolean).join(" "),
          role: "listbox",
          id: `${id}-options-listbox`,
          "aria-multiselectable": multiple ? "true" : void 0,
          hidden: !isOpen,
          ref: handleListRef,
          children: isLoading && loadingRenderer ? /* @__PURE__ */ jsx2("li", { className: "PreactDatefield-option", "aria-disabled": true, children: loadingRenderer(translations.loadingOptions || "Loading...") }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            addNewOptionVisible && /* @__PURE__ */ jsx2(
              "li",
              {
                id: `${id}-option-${toHTMLId(searchTextTrimmed)}`,
                className: `PreactDatefield-option ${activeDescendant === searchTextTrimmed ? "PreactDatefield-option--active" : ""}`,
                role: "option",
                tabIndex: -1,
                "aria-selected": false,
                onMouseEnter: () => setActiveDescendant(searchTextTrimmed),
                onMouseDown: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOptionSelect(searchTextTrimmed);
                  if (!multiple && onClose) {
                    onClose();
                  }
                },
                children: (translations.addOption || 'Add "{value}"').replace("{value}", searchTextTrimmed)
              },
              searchTextTrimmed
            ),
            filteredOptions.map((option) => {
              const isActive = activeDescendant === option.value;
              const isSelected = arrayValues.includes(option.value);
              const isInvalid = invalidValues.includes(option.value);
              const isDisabled = option.disabled;
              const hasDivider = option.divider && !searchTextTrimmed;
              const optionClasses = [
                "PreactDatefield-option",
                isActive ? "PreactDatefield-option--active" : "",
                isSelected ? "PreactDatefield-option--selected" : "",
                isInvalid ? "PreactDatefield-option--invalid" : "",
                isDisabled ? "PreactDatefield-option--disabled" : "",
                hasDivider ? "PreactDatefield-option--divider" : ""
              ].filter(Boolean).join(" ");
              return /* @__PURE__ */ jsxs(
                "li",
                {
                  id: `${id}-option-${toHTMLId(option.value)}`,
                  className: optionClasses,
                  role: "option",
                  tabIndex: -1,
                  "aria-selected": isSelected,
                  "aria-disabled": isDisabled,
                  onMouseEnter: () => !isDisabled && setActiveDescendant(option.value),
                  onMouseDown: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isDisabled) return;
                    onOptionSelect(option.value, { toggleSelected: true });
                    if (!multiple && onClose) {
                      onClose();
                    }
                  },
                  children: [
                    optionRenderer ? optionRenderer({
                      option,
                      language: language || "en",
                      isActive,
                      isSelected,
                      isInvalid,
                      showValue: showValue || false,
                      warningIcon,
                      tickIcon,
                      optionIconRenderer
                    }) : option.label,
                    isSelected && translations.selectedOption ? /* @__PURE__ */ jsx2(
                      "span",
                      {
                        className: "PreactDatefield-srOnly",
                        "aria-atomic": "true",
                        "data-reader": "selected",
                        "aria-hidden": !isActive,
                        children: translations.selectedOption
                      }
                    ) : null,
                    isInvalid && translations.invalidOption ? /* @__PURE__ */ jsx2(
                      "span",
                      {
                        className: "PreactDatefield-srOnly",
                        "aria-atomic": "true",
                        "data-reader": "invalid",
                        "aria-hidden": !isActive,
                        children: translations.invalidOption
                      }
                    ) : null
                  ]
                },
                option.value
              );
            }),
            filteredOptions.length === 0 && !isLoading && (!allowFreeText || !searchText || arrayValues.includes(searchText)) && /* @__PURE__ */ jsx2("li", { className: "PreactDatefield-option", children: translations.noOptionsFound }),
            filteredOptions.length === maxPresentedOptions && translations.typeToLoadMore && /* @__PURE__ */ jsx2("li", { className: "PreactDatefield-option", children: translations.typeToLoadMore })
          ] })
        }
      )
    );
  }
);
var OptionsListbox_default = OptionsListbox;

// lib/TraySearchList.jsx
import { useCallback as useCallback3, useEffect as useEffect3, useRef as useRef3, useState as useState3 } from "preact/hooks";

// lib/hooks.js
import { useCallback as useCallback2, useEffect as useEffect2, useMemo, useRef as useRef2, useState as useState2 } from "preact/hooks";
function useLive(initialValue) {
  const [refreshValue, forceRefresh] = useState2(0);
  const ref = useRef2(initialValue);
  let hasValueChanged = false;
  const getValue = useMemo(() => {
    hasValueChanged = true;
    return () => ref.current;
  }, [refreshValue]);
  const setValue = useCallback2(
    /** @param {T} value */
    (value) => {
      if (value !== ref.current) {
        ref.current = value;
        forceRefresh((x) => x + 1);
      }
    },
    []
  );
  return [getValue, setValue, hasValueChanged];
}
var isTouchDevice = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches;
var visualViewportInitialHeight = window.visualViewport?.height ?? 0;
function subscribeToVirtualKeyboard({ visibleCallback, heightCallback }) {
  if (!isTouchDevice || typeof window === "undefined" || !window.visualViewport) return null;
  let isVisible = false;
  const handleViewportResize = () => {
    if (!window.visualViewport) return;
    const heightDiff = visualViewportInitialHeight - window.visualViewport.height;
    const isVisibleNow = heightDiff > 150;
    if (isVisible !== isVisibleNow) {
      isVisible = isVisibleNow;
      visibleCallback?.(isVisible);
    }
    heightCallback?.(heightDiff, isVisible);
  };
  window.visualViewport.addEventListener("resize", handleViewportResize, { passive: true });
  return () => {
    window.visualViewport?.removeEventListener("resize", handleViewportResize);
  };
}
var isPlaywright = typeof navigator !== "undefined" && navigator.webdriver === true;

// lib/TraySearchList.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "preact/jsx-runtime";
var TraySearchList = ({
  id,
  isOpen,
  onClose,
  trayLabel,
  theme,
  translations,
  onInputChange,
  children
}) => {
  const [trayInputValue, setTrayInputValue] = useState3("");
  const [virtualKeyboardHeight, setVirtualKeyboardHeight] = useState3(0);
  const trayInputRef = useRef3(
    /** @type {HTMLInputElement | null} */
    null
  );
  const trayModalRef = useRef3(
    /** @type {HTMLDivElement | null} */
    null
  );
  const originalOverflowRef = useRef3("");
  const virtualKeyboardHeightAdjustSubscription = useRef3(
    /** @type {function | null} */
    null
  );
  const virtualKeyboardExplicitlyClosedRef = useRef3(false);
  const readonlyResetTimeoutRef = useRef3(
    /** @type {ReturnType<typeof setTimeout> | null} */
    null
  );
  const handleTrayInputChange = useCallback3(
    /**
     * @param {import('preact/compat').ChangeEvent<HTMLInputElement>} e
     */
    (e) => {
      const value = e.currentTarget.value;
      setTrayInputValue(value);
      onInputChange(value);
    },
    [onInputChange]
  );
  const preventKeyboardReopenOnOptionTap = useCallback3(() => {
    const input = trayInputRef.current;
    if (!input) return;
    const shouldTemporarilyDisableInput = virtualKeyboardExplicitlyClosedRef.current === true && document.activeElement === input;
    if (!shouldTemporarilyDisableInput) return;
    input.setAttribute("readonly", "readonly");
    if (readonlyResetTimeoutRef.current) {
      clearTimeout(readonlyResetTimeoutRef.current);
    }
    readonlyResetTimeoutRef.current = setTimeout(() => {
      input.removeAttribute("readonly");
      readonlyResetTimeoutRef.current = null;
    }, 10);
  }, []);
  const handleClose = useCallback3(() => {
    setTrayInputValue("");
    setVirtualKeyboardHeight(0);
    virtualKeyboardExplicitlyClosedRef.current = false;
    virtualKeyboardHeightAdjustSubscription.current?.();
    virtualKeyboardHeightAdjustSubscription.current = null;
    if (readonlyResetTimeoutRef.current) {
      clearTimeout(readonlyResetTimeoutRef.current);
      readonlyResetTimeoutRef.current = null;
    }
    trayInputRef.current?.removeAttribute("readonly");
    const scrollingElement = (
      /** @type {HTMLElement} */
      document.scrollingElement || document.documentElement
    );
    scrollingElement.style.overflow = originalOverflowRef.current;
    onClose();
  }, [onClose]);
  useEffect3(() => {
    if (isOpen) {
      const scrollingElement = (
        /** @type {HTMLElement} */
        document.scrollingElement || document.documentElement
      );
      originalOverflowRef.current = scrollingElement.style.overflow;
      scrollingElement.style.overflow = "hidden";
      if (!virtualKeyboardHeightAdjustSubscription.current) {
        virtualKeyboardHeightAdjustSubscription.current = subscribeToVirtualKeyboard({
          heightCallback(keyboardHeight, isVisible) {
            setVirtualKeyboardHeight(isVisible ? keyboardHeight : 0);
            virtualKeyboardExplicitlyClosedRef.current = !isVisible;
          }
        });
      }
      trayInputRef.current?.focus();
    }
  }, [isOpen]);
  useEffect3(() => {
    return () => {
      if (virtualKeyboardHeightAdjustSubscription.current) {
        virtualKeyboardHeightAdjustSubscription.current();
        virtualKeyboardHeightAdjustSubscription.current = null;
      }
      if (readonlyResetTimeoutRef.current) {
        clearTimeout(readonlyResetTimeoutRef.current);
        readonlyResetTimeoutRef.current = null;
      }
      trayInputRef.current?.removeAttribute("readonly");
      virtualKeyboardExplicitlyClosedRef.current = false;
    };
  }, []);
  if (!isOpen) {
    return null;
  }
  return (
    // I couldn't use native <dialog> element because trying to focus input right
    // after dialog.close() doesn't seem to work on Chrome (Android).
    /* @__PURE__ */ jsx3(
      "div",
      {
        ref: trayModalRef,
        className: `PreactDatefield-modal ${`PreactDatefield--${theme}`}`,
        style: { display: isOpen ? null : "none" },
        onClick: (e) => {
          if (e.target === trayModalRef.current) {
            handleClose();
          }
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        },
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": trayLabel ? `${id}-tray-label` : void 0,
        tabIndex: -1,
        children: /* @__PURE__ */ jsxs2("div", { className: `PreactDatefield-tray ${`PreactDatefield--${theme}`}`, children: [
          /* @__PURE__ */ jsxs2("div", { className: "PreactDatefield-trayHeader", children: [
            trayLabel && /* @__PURE__ */ jsx3(
              "label",
              {
                id: `${id}-tray-label`,
                className: "PreactDatefield-trayLabel",
                htmlFor: `${id}-tray-input`,
                children: trayLabel
              }
            ),
            /* @__PURE__ */ jsx3(
              "input",
              {
                id: `${id}-tray-input`,
                ref: trayInputRef,
                type: "text",
                value: trayInputValue,
                placeholder: translations.searchPlaceholder,
                onChange: handleTrayInputChange,
                onKeyDown: (e) => {
                  if (e.key === "Escape") {
                    handleClose();
                  }
                },
                className: `PreactDatefield-trayInput ${!trayLabel ? "PreactDatefield-trayInput--noLabel" : ""}`,
                role: "combobox",
                "aria-expanded": "true",
                "aria-haspopup": "listbox",
                "aria-controls": `${id}-options-listbox`,
                "aria-label": trayLabel || translations.searchPlaceholder,
                autoComplete: "off"
              }
            )
          ] }),
          /* @__PURE__ */ jsx3(
            "div",
            {
              onMouseDownCapture: preventKeyboardReopenOnOptionTap,
              onTouchStartCapture: preventKeyboardReopenOnOptionTap,
              children
            }
          ),
          virtualKeyboardHeight > 0 && /* @__PURE__ */ jsx3(
            "div",
            {
              className: "PreactDatefield-virtualKeyboardSpacer",
              style: { height: `${virtualKeyboardHeight}px` },
              "aria-hidden": "true"
            }
          )
        ] })
      }
    )
  );
};
var TraySearchList_default = TraySearchList;

// lib/dateParser.js
var MONTH_KEYS = [
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
  "december"
];
var MONTH_SHORT = [
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
  "Dec"
];
var MONTH_SHORT_KEYS = [
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
  "dec"
];
var WEEKDAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var WEEKDAY_ALIASES = [
  ["sun"],
  ["mon"],
  ["tue", "tues"],
  ["wed", "weds"],
  ["thu", "thur", "thurs"],
  ["fri"],
  ["sat"]
];
var timeZoneFormatterCache = /* @__PURE__ */ new Map();
function normalizeInput(input) {
  return input.toLowerCase().replace(/[,]+/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeToken(token) {
  return token.toLowerCase().replace(/,/g, "").replace(/^[.]+|[.]+$/g, "");
}
function toInt(token) {
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  return Number.isNaN(value) ? null : value;
}
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
function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}
function isValidDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
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
function parseMeridiem(token) {
  const normalized = normalizeToken(token);
  if (normalized === "a" || normalized === "am") return "am";
  if (normalized === "p" || normalized === "pm") return "pm";
  return null;
}
function resolveDateOrder(dateOrder, locale) {
  if (dateOrder && dateOrder !== "auto") return dateOrder;
  if (!locale) return "DMY";
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(Date.UTC(2006, 0, 2))).filter((part) => part.type === "year" || part.type === "month" || part.type === "day").map((part) => part.type);
  const joined = parts.join("-");
  if (joined === "month-day-year") return "MDY";
  if (joined === "day-month-year") return "DMY";
  if (joined === "year-month-day") return "YMD";
  return "DMY";
}
function normalizeYear(year) {
  if (year >= 1e3 && year <= 9999) return year;
  if (year >= 0 && year <= 99) return 2e3 + year;
  return null;
}
function getPairMonthDay(first, second, resolvedOrder) {
  if (first < 1 || second < 1 || first > 31 || second > 31) return [];
  if (first > 12 && second > 12) return [];
  if (first > 12) return [{ month: second, day: first, ambiguousOrder: false, orderPenalty: 0 }];
  if (second > 12) return [{ month: first, day: second, ambiguousOrder: false, orderPenalty: 0 }];
  const order = resolvedOrder === "DMY" ? "DMY" : "MDY";
  if (order === "DMY") {
    return [
      { month: second, day: first, ambiguousOrder: true, orderPenalty: 0 },
      { month: first, day: second, ambiguousOrder: true, orderPenalty: 1 }
    ];
  }
  return [
    { month: first, day: second, ambiguousOrder: true, orderPenalty: 0 },
    { month: second, day: first, ambiguousOrder: true, orderPenalty: 1 }
  ];
}
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
  const hadSeconds = Boolean(secondRaw);
  const hadMilliseconds = Boolean(millisecondRaw);
  if (meridiem) {
    if (hourBase < 1 || hourBase > 12) return [];
    const hour = meridiem === "pm" ? hourBase % 12 + 12 : hourBase % 12;
    return [
      { hour, minute, second, millisecond, assumedMeridiem: false, hadSeconds, hadMilliseconds }
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
        hadMilliseconds
      }
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
      hadMilliseconds
    },
    {
      hour: hourBase % 12 + 12,
      minute,
      second,
      millisecond,
      assumedMeridiem: true,
      hadSeconds,
      hadMilliseconds
    }
  ];
}
function parseTimeCandidates(tokens, allowSeconds, allowMilliseconds) {
  const out = [];
  const consumed = /* @__PURE__ */ new Set();
  for (let i = 0; i < tokens.length; i += 1) {
    if (consumed.has(i)) continue;
    const token = normalizeToken(tokens[i] || "");
    if (!token) continue;
    let match = token.match(
      /^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?(a|am|p|pm)$/
    );
    if (match) {
      const meridiem = match[5] === "a" || match[5] === "am" ? "am" : "pm";
      const parsed2 = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        meridiem,
        allowSeconds,
        allowMilliseconds
      );
      if (parsed2.length) {
        consumed.add(i);
        for (const item of parsed2) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i]) });
      }
      continue;
    }
    const nextMeridiem = i + 1 < tokens.length ? parseMeridiem(tokens[i + 1] || "") : null;
    match = token.match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?$/);
    if (match && nextMeridiem) {
      const parsed2 = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        nextMeridiem,
        allowSeconds,
        allowMilliseconds
      );
      if (parsed2.length) {
        consumed.add(i);
        consumed.add(i + 1);
        for (const item of parsed2) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i, i + 1]) });
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
      allowMilliseconds
    );
    if (!parsed.length) continue;
    consumed.add(i);
    for (const item of parsed) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i]) });
  }
  return out;
}
function buildYearOnlyDate(timeFavor) {
  if (timeFavor === "end") return { month: 12, day: 31, boundary: "endOfYear" };
  return { month: 1, day: 1, boundary: "startOfYear" };
}
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
    day: date.getDate()
  };
}
function shiftDate(date, deltaDays) {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day));
  shifted.setUTCDate(shifted.getUTCDate() + deltaDays);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate()
  };
}
function addDateCandidate(list, year, month, day, usedIndices, explicitYear, explicitMonth, explicitDay, ambiguousOrder, orderPenalty, partialMonth, boundary, weekday = null) {
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
    weekday
  });
}
function parseDateCandidates(tokens, consumedTimeIndices, now, resolvedOrder, timeFavor, dayFavor) {
  const out = [];
  const separated = [];
  const monthWordTokens = [];
  const numericTokens = [];
  const dayTokens = [];
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
        c: separatedMatch[3] ? Number(separatedMatch[3]) : null
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
      if (a >= 1e3 && a <= 9999) {
        addDateCandidate(out, a, b, c, /* @__PURE__ */ new Set([index]), true, true, true, false, 0, false, "none");
        continue;
      }
      const normalizedYear = normalizeYear(c);
      if (normalizedYear !== null) {
        const pairs2 = getPairMonthDay(a, b, resolvedOrder);
        for (const pair of pairs2) {
          addDateCandidate(
            out,
            normalizedYear,
            pair.month,
            pair.day,
            /* @__PURE__ */ new Set([index]),
            true,
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none"
          );
        }
      }
      continue;
    }
    if (a >= 1e3 && a <= 9999 && b >= 1 && b <= 12) {
      const day = timeFavor === "end" ? daysInMonth(a, b) : 1;
      addDateCandidate(
        out,
        a,
        b,
        day,
        /* @__PURE__ */ new Set([index]),
        true,
        true,
        false,
        false,
        0,
        false,
        timeFavor === "end" ? "endOfMonth" : "startOfMonth"
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
        /* @__PURE__ */ new Set([index]),
        false,
        true,
        true,
        pair.ambiguousOrder,
        pair.orderPenalty,
        false,
        "none"
      );
    }
  }
  const dayNumbers = dayTokens;
  const yearNumbers = numericTokens.filter((token) => token.value >= 1e3 && token.value <= 9999);
  const shortYearNumbers = numericTokens.filter((token) => token.value >= 0 && token.value <= 99).map((token) => ({ index: token.index, value: 2e3 + token.value }));
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
                /* @__PURE__ */ new Set([monthToken.index, dayToken.index, yearToken.index]),
                true,
                true,
                true,
                false,
                0,
                monthItem.partial,
                "none"
              );
            }
            continue;
          }
          addDateCandidate(
            out,
            now.getFullYear(),
            monthItem.month,
            dayToken.value,
            /* @__PURE__ */ new Set([monthToken.index, dayToken.index]),
            false,
            true,
            true,
            false,
            0,
            monthItem.partial,
            "none"
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
        /* @__PURE__ */ new Set([yearOnly.index]),
        true,
        false,
        false,
        false,
        0,
        false,
        boundaryDate.boundary
      );
    }
    const nonYear = numericTokens.filter((token) => token.value < 1e3);
    if (nonYear.length >= 2) {
      const first = nonYear[0];
      const second = nonYear[1];
      const firstYear = yearNumbers[0] || (nonYear.length >= 3 ? shortYearNumbers.find(
        (token) => token.index !== first?.index && token.index !== second?.index
      ) || null : null);
      if (first && second) {
        const inferredYear = firstYear ? firstYear.value : now.getFullYear();
        const pairs = getPairMonthDay(first.value, second.value, resolvedOrder);
        for (const pair of pairs) {
          addDateCandidate(
            out,
            inferredYear,
            pair.month,
            pair.day,
            /* @__PURE__ */ new Set([first.index, second.index, ...firstYear ? [firstYear.index] : []]),
            Boolean(firstYear),
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none"
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
          /* @__PURE__ */ new Set([firstDay.index, ...firstYear ? [firstYear.index] : []]),
          Boolean(firstYear),
          false,
          true,
          false,
          0,
          false,
          "none"
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
          const candidates = weekdayItem.weekday === currentWeekday ? dayFavor === "future" ? [upcomingDate, today, shiftDate(today, -7)] : [shiftDate(today, -7), today, upcomingDate] : dayFavor === "future" ? [upcomingDate, pastDate] : [pastDate, upcomingDate];
          for (let orderPenalty = 0; orderPenalty < candidates.length; orderPenalty += 1) {
            const candidate = candidates[orderPenalty];
            if (!candidate) continue;
            addDateCandidate(
              out,
              candidate.year,
              candidate.month,
              candidate.day,
              /* @__PURE__ */ new Set([weekdayToken.index]),
              false,
              false,
              false,
              false,
              orderPenalty,
              weekdayItem.partial,
              "none",
              weekdayItem.weekday
            );
          }
        }
      }
    }
  }
  return out;
}
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
function toTimeLabel(hour, minute, second, millisecond, includeSeconds, includeMilliseconds) {
  const meridiem = hour >= 12 ? "PM" : "AM";
  const clockHour = hour % 12 || 12;
  let text = `${clockHour}:${pad(minute)} ${meridiem}`;
  if (includeSeconds) text = `${clockHour}:${pad(minute)}:${pad(second)} ${meridiem}`;
  if (includeMilliseconds)
    text = `${clockHour}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)} ${meridiem}`;
  return text;
}
function toDateLabel(year, month, day) {
  const monthName = MONTH_SHORT[month - 1] || MONTH_SHORT[0];
  return `${monthName} ${day}, ${year}`;
}
function toParsedDateLabel(parsedDate, now) {
  const base = toDateLabel(parsedDate.year, parsedDate.month, parsedDate.day);
  if (parsedDate.weekday == null) return base;
  const weekday = WEEKDAY_LABELS[parsedDate.weekday];
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const candidateUTC = Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  const prefix = candidateUTC < todayUTC ? "Past" : candidateUTC > todayUTC ? "Upcoming" : "Today";
  return `${prefix} ${weekday}, ${base}`;
}
function toDateValue(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}
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
    second: "2-digit"
  });
  timeZoneFormatterCache.set(timezone, formatter);
  return formatter;
}
function getZonedParts(epochMs, timezone) {
  const formatter = getTimeZoneFormatter(timezone);
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
    second: parts.second || 0
  };
}
function getOffsetMs(epochMs, timezone) {
  const baseMs = Math.trunc(epochMs / 1e3) * 1e3;
  const parts = getZonedParts(baseMs, timezone);
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return asUTC - baseMs;
}
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
  const isExact = resolved.year === year && resolved.month === month && resolved.day === day && resolved.hour === hour && resolved.minute === minute && resolved.second === second;
  if (!isExact) return null;
  return new Date(finalEpoch).toISOString();
}
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
      timezone
    );
    if (iso) return iso;
  } catch (_error) {
  }
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond)).toISOString();
}
function toComparableValue(value, mode) {
  if (!value) return null;
  if (mode === "date") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!isValidDate(year, month, day)) return null;
    return Date.UTC(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}
function suggestionComparableValue(suggestion) {
  return suggestion.mode === "date" ? Date.UTC(suggestion.year, suggestion.month - 1, suggestion.day) : new Date(suggestion.value).getTime();
}
function isWithinBounds(suggestion, minComparable, maxComparable, bounds) {
  const value = suggestionComparableValue(suggestion);
  if (Number.isNaN(value)) return false;
  if (minComparable !== null) {
    if (bounds === "exclusive" ? value <= minComparable : value < minComparable) return false;
  }
  if (maxComparable !== null) {
    if (bounds === "exclusive" ? value >= maxComparable : value > maxComparable) return false;
  }
  return true;
}
function buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate) {
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth() + 1;
  const day = defaultDate.getDate();
  if (mode === "date") {
    return {
      label: toDateLabel(year, month, day),
      value: toDateValue(year, month, day),
      score: -1e3,
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
      millisecond: 0
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
    score: -1e3,
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
    millisecond
  };
}
function buildDateSuggestions(input, options = {}) {
  const normalizedInput = normalizeInput(input || "");
  const mode = options.mode || "date";
  const timeFavor = options.timeFavor === "end" ? "end" : "start";
  const dayFavor = options.dayFavor === "future" ? "future" : "past";
  const now = options.now || /* @__PURE__ */ new Date();
  const defaultDate = options.defaultDate || now;
  const includeDefaultOption = options.includeDefaultOption !== false;
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedOrder = resolveDateOrder(options.dateOrder || "DMY", options.locale);
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);
  const bounds = options.bounds === "exclusive" ? "exclusive" : "inclusive";
  const minComparable = toComparableValue(options.minValue, mode);
  const maxComparable = toComparableValue(options.maxValue, mode);
  const maxOptions = Math.max(1, options.maxOptions || 10);
  if (minComparable !== null && maxComparable !== null && (bounds === "exclusive" ? minComparable >= maxComparable : minComparable > maxComparable)) {
    return [];
  }
  if (!normalizedInput) {
    if (!includeDefaultOption) return [];
    const defaultSuggestion = buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate);
    return isWithinBounds(defaultSuggestion, minComparable, maxComparable, bounds) ? [defaultSuggestion] : [];
  }
  const tokens = normalizedInput.split(" ").filter(Boolean);
  const timeCandidates = parseTimeCandidates(tokens, allowSeconds, allowMilliseconds);
  const consumedTimeIndices = /* @__PURE__ */ new Set();
  for (const time of timeCandidates)
    for (const index of time.usedIndices) consumedTimeIndices.add(index);
  let dateCandidates = parseDateCandidates(
    tokens,
    consumedTimeIndices,
    now,
    resolvedOrder,
    timeFavor,
    dayFavor
  );
  if (!dateCandidates.length && mode === "datetime" && timeCandidates.length) {
    dateCandidates = [
      {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        usedIndices: /* @__PURE__ */ new Set(),
        explicitYear: false,
        explicitMonth: false,
        explicitDay: false,
        ambiguousOrder: false,
        orderPenalty: 0,
        partialMonth: false,
        boundary: "none",
        weekday: null
      }
    ];
  }
  if (!dateCandidates.length) return [];
  const suggestions = [];
  const seen = /* @__PURE__ */ new Set();
  for (const dateCandidate of dateCandidates) {
    if (mode === "date") {
      const usedIndices2 = new Set(dateCandidate.usedIndices);
      const ignoredTokenCount2 = Math.max(0, tokens.length - usedIndices2.size);
      const score2 = scoreCandidate(dateCandidate, false, false, ignoredTokenCount2, mode);
      const value2 = toDateValue(dateCandidate.year, dateCandidate.month, dateCandidate.day);
      if (seen.has(value2)) continue;
      seen.add(value2);
      suggestions.push({
        label: toParsedDateLabel(dateCandidate, now),
        value: value2,
        score: score2,
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
        millisecond: 0
      });
      continue;
    }
    if (timeCandidates.length) {
      for (const timeCandidate of timeCandidates) {
        const usedIndices2 = /* @__PURE__ */ new Set([...dateCandidate.usedIndices, ...timeCandidate.usedIndices]);
        const ignoredTokenCount2 = Math.max(0, tokens.length - usedIndices2.size);
        const score2 = scoreCandidate(
          dateCandidate,
          true,
          timeCandidate.assumedMeridiem,
          ignoredTokenCount2,
          mode
        );
        const value2 = toDateTimeValue(
          dateCandidate.year,
          dateCandidate.month,
          dateCandidate.day,
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timezone
        );
        if (seen.has(value2)) continue;
        seen.add(value2);
        const label2 = `${toParsedDateLabel(dateCandidate, now)} - ${toTimeLabel(
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timeCandidate.hadSeconds,
          timeCandidate.hadMilliseconds
        )} (${timezone})`;
        suggestions.push({
          label: label2,
          value: value2,
          score: score2,
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
          millisecond: timeCandidate.millisecond
        });
      }
      continue;
    }
    const isEnd = dateCandidate.boundary === "endOfDay" || dateCandidate.boundary === "endOfYear" || timeFavor === "end";
    const isYearBoundary = dateCandidate.boundary === "startOfYear" || dateCandidate.boundary === "endOfYear";
    const hour = isEnd ? 23 : 0;
    const minute = isEnd ? 59 : 0;
    const second = isEnd ? 59 : 0;
    const millisecond = isEnd ? 999 : 0;
    const inferredBoundary = dateCandidate.boundary === "none" ? isEnd ? "endOfDay" : "startOfDay" : dateCandidate.boundary;
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
      timezone
    );
    if (seen.has(value)) continue;
    seen.add(value);
    const boundaryLabel = inferredBoundary === "startOfDay" ? "start of day" : inferredBoundary === "endOfDay" ? "end of day" : inferredBoundary === "startOfMonth" ? "start of month" : inferredBoundary === "endOfMonth" ? "end of month" : inferredBoundary === "startOfYear" ? "start of year" : "end of year";
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
      millisecond
    });
  }
  const boundedSuggestions = suggestions.filter(
    (suggestion) => isWithinBounds(suggestion, minComparable, maxComparable, bounds)
  );
  boundedSuggestions.sort(
    (a, b) => b.score - a.score || a.year - b.year || a.month - b.month || a.day - b.day || a.hour - b.hour || a.minute - b.minute || a.second - b.second || a.millisecond - b.millisecond || a.label.localeCompare(b.label)
  );
  return boundedSuggestions.slice(0, maxOptions);
}
function isoToDisplayLabel(value, options = {}) {
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
      const parts2 = {
        year,
        month,
        day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        timezone,
        mode
      };
      if (options.labelFormatter) return options.labelFormatter(parts2);
      return toDateLabel(year, month, day);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const zonedParts = getZonedParts(date.getTime(), timezone);
    const ms = date.getTime() % 1e3;
    const parts = {
      year: zonedParts.year,
      month: zonedParts.month,
      day: zonedParts.day,
      hour: zonedParts.hour,
      minute: zonedParts.minute,
      second: zonedParts.second,
      millisecond: ms,
      timezone,
      mode
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
      includeMs
    );
    return `${dateStr} - ${timeStr} (${timezone})`;
  } catch (_error) {
    return "";
  }
}

// lib/PreactDatefield.jsx
import { jsx as jsx4, jsxs as jsxs3 } from "preact/jsx-runtime";
var defaultTranslations = {
  searchPlaceholder: "Type a date...",
  noOptionsFound: "No dates found",
  clearValue: "Clear date"
};
var Portal = ({ parent = document.body, children, rootElementRef }) => {
  const [dir, setDir] = useState4(
    /** @type {string|null} */
    null
  );
  useEffect4(() => {
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
  const wrappedChildren = dir ? /* @__PURE__ */ jsx4("div", { dir: (
    /** @type {"auto" | "rtl" | "ltr"} */
    dir
  ), style: { direction: dir }, children }) : children;
  return createPortal(wrappedChildren, parent);
};
var dropdownPopperModifiers = [
  {
    name: "flip",
    enabled: true
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
    }
  },
  {
    name: "eventListeners",
    enabled: true,
    options: {
      scroll: true,
      resize: true
    }
  }
];
var defaultChevronIcon = /* @__PURE__ */ jsx4(
  "svg",
  {
    className: "PreactDatefield-chevron",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx4("path", { d: "M7 10l5 5 5-5z" })
  }
);
function suggestionsToOptions(suggestions) {
  return suggestions.map((s) => ({
    label: s.label,
    value: s.value,
    score: s.score,
    matched: (
      /** @type {const} */
      "label"
    ),
    matchSlices: []
  }));
}
var PreactDatefield = ({
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
  maxSuggestions = 10
}) => {
  const timezone = timezoneProp || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedTimeFavor = (
    /** @type {DateBoundaryPreference} */
    timeFavor === "end" || timeFavor == null && favor === "end" ? "end" : "start"
  );
  const autoId = useId();
  const id = idProp || autoId;
  const [inputValue, setInputValue] = useState4("");
  const [getIsDropdownOpen, setIsDropdownOpen] = useLive(false);
  const [getIsFocused, setIsFocused] = useLive(false);
  const [announcement, setAnnouncement] = useState4("");
  const optionsListboxRef = useRef4(
    /** @type {OptionsListboxRef | null} */
    null
  );
  const [activeDescendantValue, setActiveDescendantValue] = useState4("");
  const inputRef = useRef4(
    /** @type {HTMLInputElement | null} */
    null
  );
  const blurTimeoutRef = useRef4(
    /** @type {number | undefined} */
    void 0
  );
  const rootElementRef = useRef4(
    /** @type {HTMLDivElement | null} */
    null
  );
  const dropdownPopperRef = useRef4(
    /** @type {HTMLUListElement | null} */
    null
  );
  const dropdownClosedExplicitlyRef = useRef4(false);
  const [getTrayLabel, setTrayLabel] = useLive(trayLabelProp);
  const previousValidValueRef = useRef4(value || "");
  useEffect4(() => {
    if (value) previousValidValueRef.current = value;
  }, [value]);
  const [getIsTrayOpen, setIsTrayOpen] = useLive(false);
  const trayClosedExplicitlyRef = useRef4(false);
  const [isMobileScreen, setIsMobileScreen] = useState4(false);
  const [trayActiveInputValue, setTrayActiveInputValue] = useState4("");
  useEffect4(() => {
    if (tray === "auto") {
      const mediaQuery = window.matchMedia(`(max-width: ${trayBreakpoint})`);
      setIsMobileScreen(mediaQuery.matches);
      const handleChange = (e) => setIsMobileScreen(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [tray, trayBreakpoint]);
  const shouldUseTray = tray === true || tray === "auto" && isMobileScreen;
  const activeInputValue = getIsTrayOpen() ? trayActiveInputValue : inputValue;
  const displayLabel = useMemo2(
    () => isoToDisplayLabel(value, { mode, timezone, allowSeconds, allowMilliseconds, labelFormatter }),
    [value, mode, timezone, allowSeconds, allowMilliseconds, labelFormatter]
  );
  const parserOptions = useMemo2(
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
      maxOptions: maxSuggestions
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
      maxSuggestions
    ]
  );
  const suggestions = useMemo2(
    () => buildDateSuggestions(activeInputValue, parserOptions),
    [activeInputValue, parserOptions]
  );
  const filteredOptions = useMemo2(() => suggestionsToOptions(suggestions), [suggestions]);
  const computeEffectiveTrayLabel = useCallback4(() => {
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
  const handleActiveDescendantChange = useCallback4(
    /** @param {string} val */
    (val) => setActiveDescendantValue(val),
    []
  );
  const closeDropdown = useCallback4(
    (closedExplicitly = false) => {
      setIsDropdownOpen(false);
      if (dropdownPopperRef.current) {
        dropdownPopperRef.current.style.display = "none";
      }
      if (closedExplicitly) {
        dropdownClosedExplicitlyRef.current = true;
      }
      optionsListboxRef.current?.clearActiveDescendant();
    },
    [setIsDropdownOpen]
  );
  useEffect4(() => {
    if (getIsDropdownOpen() && !shouldUseTray && rootElementRef.current && dropdownPopperRef.current) {
      const computedDir = window.getComputedStyle(rootElementRef.current).direction;
      const placement = computedDir === "rtl" ? "bottom-end" : "bottom-start";
      const popperInstance = createPopper(rootElementRef.current, dropdownPopperRef.current, {
        placement,
        // @ts-ignore
        modifiers: dropdownPopperModifiers
      });
      dropdownPopperRef.current.style.display = "block";
      return () => popperInstance.destroy();
    }
    if (shouldUseTray && dropdownPopperRef.current) {
      dropdownPopperRef.current.style.display = "none";
    }
  }, [getIsDropdownOpen, shouldUseTray]);
  const handleOptionSelect = useCallback4(
    /** @param {string} selectedValue */
    (selectedValue) => {
      onChange(selectedValue);
      const match = suggestions.find((s) => s.value === selectedValue);
      if (match) {
        const label = labelFormatter ? labelFormatter(match) : match.label;
        setInputValue(label);
        setAnnouncement(`Selected ${label}`);
      }
      closeDropdown();
    },
    [onChange, suggestions, labelFormatter, closeDropdown]
  );
  const virtualKeyboardExplicitlyClosedRef = useRef4(null);
  const virtualKeyboardDismissSubscription = useRef4(
    /** @type {function | null} */
    null
  );
  const focusInputWithVirtualKeyboardGuard = useCallback4(
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
    []
  );
  const focusInput = useCallback4(
    (forceOpenKeyboard = false) => {
      focusInputWithVirtualKeyboardGuard({
        input: inputRef.current,
        shouldPreventKeyboardReopen: getIsFocused() && virtualKeyboardExplicitlyClosedRef.current === true,
        forceOpenKeyboard
      });
    },
    [getIsFocused, focusInputWithVirtualKeyboardGuard]
  );
  const openTray = useCallback4(() => {
    if (!shouldUseTray) return;
    setIsTrayOpen(true);
    setIsDropdownOpen(false);
    trayClosedExplicitlyRef.current = false;
  }, [shouldUseTray, setIsDropdownOpen, setIsTrayOpen]);
  const closeTray = useCallback4(() => {
    setIsTrayOpen(false);
    setTrayActiveInputValue("");
    trayClosedExplicitlyRef.current = true;
    focusInput(true);
  }, [setIsTrayOpen, focusInput]);
  const handleInputChange = useCallback4(
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
    [setIsDropdownOpen, shouldUseTray, openTray]
  );
  const handleTrayInputChange = useCallback4(
    /** @param {string} val */
    (val) => setTrayActiveInputValue(val),
    []
  );
  const handleInputFocus = useCallback4(() => {
    setIsFocused(true);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = void 0;
    if (shouldUseTray) {
      if (!trayClosedExplicitlyRef.current) openTray();
      trayClosedExplicitlyRef.current = false;
    } else {
      if (value && inputRef.current) {
        inputRef.current.select();
      }
      if (inputValue) {
        setIsDropdownOpen(true);
      }
      dropdownClosedExplicitlyRef.current = false;
      if (!virtualKeyboardDismissSubscription.current) {
        virtualKeyboardDismissSubscription.current = subscribeToVirtualKeyboard({
          visibleCallback(isVisible) {
            virtualKeyboardExplicitlyClosedRef.current = !isVisible;
          }
        });
      }
    }
  }, [setIsFocused, setIsDropdownOpen, openTray, shouldUseTray, value, inputValue]);
  const handleInputBlur = useCallback4(() => {
    setIsFocused(false);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = void 0;
    closeDropdown();
    dropdownClosedExplicitlyRef.current = false;
    const text = inputRef.current?.value?.trim() || "";
    const input = inputRef.current;
    if (!text) {
      if (value !== "") onChange("");
      if (input) {
        input.setCustomValidity(required ? "Please select a date" : "");
      }
      setInputValue("");
    } else if (text === displayLabel) {
      if (input) input.setCustomValidity("");
    } else {
      const results = buildDateSuggestions(text, parserOptions);
      const best = results[0];
      if (best) {
        onChange(best.value);
        const bestLabel = labelFormatter ? labelFormatter(best) : best.label;
        setInputValue(bestLabel);
        if (input) input.setCustomValidity("");
        setAnnouncement(`Selected ${bestLabel}`);
      } else {
        if (previousValidValueRef.current) {
          const prevLabel = isoToDisplayLabel(previousValidValueRef.current, {
            mode,
            timezone,
            allowSeconds,
            allowMilliseconds,
            labelFormatter
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
    onBlurProp
  ]);
  const handleKeyDown = useCallback4(
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
    [inputValue, displayLabel, getIsDropdownOpen, setIsDropdownOpen, closeDropdown]
  );
  const handleClearValue = useCallback4(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e) => {
      e.stopPropagation();
      setInputValue("");
      onChange("");
      setAnnouncement("Date cleared");
      if (inputRef.current) {
        inputRef.current.setCustomValidity(required ? "Please select a date" : "");
      }
    },
    [onChange, required]
  );
  const handleClearMouseDown = useCallback4(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e) => {
      e.preventDefault();
    },
    []
  );
  const handleRootElementClick = useCallback4(() => {
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
  useEffect4(() => {
    if (!getIsFocused()) {
      setInputValue(displayLabel);
    }
  }, [displayLabel, getIsFocused]);
  const setDropdownRef = useCallback4(
    /** @param {HTMLUListElement | null} el */
    (el) => {
      dropdownPopperRef.current = el;
    },
    []
  );
  const optionsListbox = /* @__PURE__ */ jsx4(
    OptionsListbox_default,
    {
      ref: optionsListboxRef,
      id,
      searchText: activeInputValue,
      filteredOptions,
      isLoading: false,
      arrayValues: value ? [value] : [],
      invalidValues: [],
      multiple: false,
      allowFreeText: false,
      onOptionSelect: handleOptionSelect,
      onActiveDescendantChange: handleActiveDescendantChange,
      onClose: shouldUseTray ? closeTray : closeDropdown,
      showValue: false,
      language: "en",
      translations: defaultTranslations,
      theme,
      maxPresentedOptions: maxSuggestions,
      isOpen: isListOpen,
      shouldUseTray,
      setDropdownRef
    }
  );
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: [
        className,
        "PreactDatefield",
        disabled ? "PreactDatefield--disabled" : "",
        `PreactDatefield--${theme}`,
        tray === "auto" ? "PreactDatefield--trayAuto" : ""
      ].filter(Boolean).join(" "),
      "aria-disabled": disabled,
      onClick: handleRootElementClick,
      id: `${id}-root`,
      ref: rootElementRef,
      ...rootElementProps,
      children: [
        /* @__PURE__ */ jsx4("div", { className: "PreactDatefield-srOnly", "aria-live": "polite", "aria-atomic": "true", children: getIsFocused() ? announcement : "" }),
        /* @__PURE__ */ jsxs3("div", { className: `PreactDatefield-field ${disabled ? "PreactDatefield-field--disabled" : ""}`, children: [
          /* @__PURE__ */ jsx4(
            "input",
            {
              id,
              ref: inputRef,
              type: "text",
              value: inputValue,
              placeholder: !shouldUseTray && getIsDropdownOpen() ? defaultTranslations.searchPlaceholder : displayLabel || placeholder,
              onChange: handleInputChange,
              onKeyDown: handleKeyDown,
              onFocus: handleInputFocus,
              onBlur: () => {
                blurTimeoutRef.current = setTimeout(handleInputBlur, 200);
              },
              className: `PreactDatefield-input ${disabled ? "PreactDatefield-input--disabled" : ""}`,
              role: "combobox",
              "aria-expanded": getIsDropdownOpen(),
              "aria-haspopup": "listbox",
              "aria-controls": `${id}-options-listbox`,
              "aria-activedescendant": activeDescendantValue ? `${id}-option-${toHTMLId(activeDescendantValue)}` : void 0,
              autocomplete: "off",
              disabled,
              required: required && !value,
              ...inputProps
            }
          ),
          !disabled && showClearButton && value ? /* @__PURE__ */ jsx4(
            "button",
            {
              type: "button",
              className: "PreactDatefield-clearButton",
              "aria-label": defaultTranslations.clearValue,
              onMouseDown: handleClearMouseDown,
              onClick: handleClearValue,
              children: /* @__PURE__ */ jsx4("span", { "aria-hidden": "true", children: "\u2715" })
            }
          ) : null,
          defaultChevronIcon,
          formSubmitCompatible ? /* @__PURE__ */ jsx4("input", { type: "hidden", name, value: value || "" }) : null
        ] }),
        /* @__PURE__ */ jsx4(Portal, { parent: portal, rootElementRef, children: shouldUseTray ? /* @__PURE__ */ jsx4(
          TraySearchList_default,
          {
            id,
            isOpen: getIsTrayOpen(),
            onClose: closeTray,
            trayLabel: getTrayLabel() || "",
            theme,
            translations: defaultTranslations,
            onInputChange: handleTrayInputChange,
            children: optionsListbox
          }
        ) : optionsListbox })
      ]
    }
  );
};
var PreactDatefield_default = PreactDatefield;
export {
  buildDateSuggestions,
  PreactDatefield_default as default,
  isoToDisplayLabel
};
//# sourceMappingURL=PreactDatefield.js.map

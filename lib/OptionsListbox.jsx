import { forwardRef } from "preact/compat";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "preact/hooks";
import { toHTMLId } from "./utils.jsx";

/**
 * @typedef {import("preact").VNode} VNode
 */

/**
 * @typedef {Object} Option
 * @property {string} label
 * @property {string} value
 * @property {VNode | string} [icon]
 * @property {boolean} [disabled]
 * @property {boolean} [divider]
 */

/**
 * @typedef {Object} OptionMatch
 * @property {string} label
 * @property {string} value
 * @property {VNode|string} [icon]
 * @property {boolean} [disabled]
 * @property {boolean} [divider]
 * @property {number} score
 * @property {'value' | 'label' | 'none'} matched
 * @property {Array<[number, number]>} matchSlices
 */

/**
 * @typedef {Object} Translations
 * @property {string} searchPlaceholder
 * @property {string} noOptionsFound
 * @property {string} [loadingOptions]
 * @property {string} [addOption]
 * @property {string} [selectedOption]
 * @property {string} [invalidOption]
 * @property {string} [typeToLoadMore]
 * @property {string} [clearValue]
 */

/**
 * @callback OptionTransformFunction
 * @param {Object} params
 * @param {OptionMatch} params.option
 * @param {string} params.language
 * @param {boolean} params.isSelected
 * @param {boolean} params.isInvalid
 * @param {boolean} params.isActive
 * @param {boolean} params.showValue
 * @param {VNode} [params.warningIcon]
 * @param {VNode} [params.tickIcon]
 * @param {(option: Option, isInput?: boolean) => VNode|null} [params.optionIconRenderer]
 * @returns {VNode}
 */

/**
 * @typedef {Object} OptionsListboxProps
 * @property {string} id - Component ID for ARIA attributes
 * @property {string} searchText - Current search/input text
 * @property {OptionMatch[]} filteredOptions - Pre-filtered options to display
 * @property {boolean} isLoading - Whether options are currently loading
 * @property {string[]} arrayValues - Currently selected values
 * @property {string[]} invalidValues - Invalid selected values
 * @property {boolean} multiple - Whether multi-select is enabled
 * @property {boolean} allowFreeText - Allow adding custom options
 * @property {(selectedValue: string, options?: {toggleSelected?: boolean}) => void} onOptionSelect - Handle option selection
 * @property {(value: string) => void} [onActiveDescendantChange] - Callback when active descendant changes (for aria-activedescendant)
 * @property {() => void} [onClose] - Handle close (for single-select)
 * @property {OptionTransformFunction} [optionRenderer] - Function to render options
 * @property {VNode} [warningIcon] - Warning icon element
 * @property {VNode} [tickIcon] - Tick icon element
 * @property {(option: Option, isInput?: boolean) => VNode|null} [optionIconRenderer] - Option icon renderer
 * @property {boolean} [showValue] - Whether to show option values
 * @property {string} [language] - Language code for rendering
 * @property {(text: string) => VNode|string} [loadingRenderer] - Loading renderer
 * @property {Translations} translations - Translation strings
 * @property {string} theme - Theme for styling
 * @property {number} maxPresentedOptions - Maximum number of options presented
 * @property {boolean} isOpen - Whether the list should be visible
 * @property {boolean} shouldUseTray - Whether this is used in tray mode
 * @property {(ref: HTMLUListElement | null) => void} [setDropdownRef] - Callback to set dropdown ref for popper
 */

/**
 * @typedef {Object} OptionsListboxRef
 * @property {() => void} navigateUp - Navigate to previous option
 * @property {() => void} navigateDown - Navigate to next option
 * @property {() => void} navigateToFirst - Navigate to first option
 * @property {() => void} navigateToLast - Navigate to last option
 * @property {() => void} navigatePageDown - Navigate down by one visible page of options
 * @property {() => void} navigatePageUp - Navigate up by one visible page of options
 * @property {() => boolean} selectActive - Select the currently active option, returns true if selection was made
 * @property {() => string} getActiveDescendant - Get the currently active descendant value
 * @property {(value: string) => void} setActiveDescendant - Set the active descendant value
 * @property {() => void} clearActiveDescendant - Clear the active descendant
 */

/**
 * OptionsListbox component - renders a listbox with keyboard navigation and selection
 * Receives pre-filtered options and handles navigation/selection
 * @type {import("preact/compat").ForwardRefExoticComponent<OptionsListboxProps & import("preact/compat").RefAttributes<OptionsListboxRef>>}
 */
const OptionsListbox = forwardRef(
  (
    /** @type {OptionsListboxProps} */
    {
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
      setDropdownRef,
    },
    ref,
  ) => {
    const [activeDescendant, setActiveDescendant] = useState("");
    const listRef = useRef(/** @type {HTMLUListElement | null} */ (null));

    const searchTextTrimmed = searchText.trim();

    const addNewOptionVisible =
      !isLoading &&
      allowFreeText &&
      searchTextTrimmed &&
      !arrayValues.includes(searchTextTrimmed) &&
      !filteredOptions.find((/** @type {OptionMatch} */ o) => o.value === searchTextTrimmed);

    const scrollOptionIntoView = useCallback(
      /** @param {string} optionValue */
      (optionValue) => {
        if (!listRef.current || !optionValue) return;
        const elementId = `${id}-option-${toHTMLId(optionValue)}`;
        const element = listRef.current.querySelector(`#${CSS.escape(elementId)}`);
        if (element) {
          const listRect = listRef.current.getBoundingClientRect();
          const itemRect = element.getBoundingClientRect();
          // do not user scrollIntoView, because that would scroll the page
          // as well and that's annoying.
          if (itemRect.bottom > listRect.bottom) {
            listRef.current.scrollTop += itemRect.bottom - listRect.bottom;
          } else if (itemRect.top < listRect.top) {
            listRef.current.scrollTop += itemRect.top - listRect.top;
          }
        }
      },
      [id],
    );

    const getNavigableOptions = useCallback(() => {
      const options = filteredOptions
        .filter((/** @type {OptionMatch} */ o) => !o.disabled)
        .map((/** @type {OptionMatch} */ o) => o.value);
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
          if (nextValue !== undefined) {
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
          if (prevValue !== undefined) {
            setActiveDescendant(prevValue);
            scrollOptionIntoView(prevValue);
          }
        },
        navigateToFirst: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstValue = options[0];
          if (firstValue !== undefined) {
            setActiveDescendant(firstValue);
            scrollOptionIntoView(firstValue);
          }
        },
        navigateToLast: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const lastValue = options[options.length - 1];
          if (lastValue !== undefined) {
            setActiveDescendant(lastValue);
            scrollOptionIntoView(lastValue);
          }
        },
        navigatePageDown: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize =
            listRef.current && firstOptionEl
              ? Math.max(
                  1,
                  Math.floor(
                    listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height,
                  ),
                )
              : 10;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : -1;
          const targetIndex = Math.min(currentIndex + pageSize, options.length - 1);
          const targetValue = options[targetIndex];
          if (targetValue !== undefined) {
            setActiveDescendant(targetValue);
            scrollOptionIntoView(targetValue);
          }
        },
        navigatePageUp: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize =
            listRef.current && firstOptionEl
              ? Math.max(
                  1,
                  Math.floor(
                    listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height,
                  ),
                )
              : 10;
          const currentIndex = activeDescendant
            ? options.indexOf(activeDescendant)
            : options.length;
          const targetIndex = Math.max(currentIndex - pageSize, 0);
          const targetValue = options[targetIndex];
          if (targetValue !== undefined) {
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
            (/** @type {OptionMatch} */ o) => o.value === activeDescendant,
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
        clearActiveDescendant: () => setActiveDescendant(""),
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
        onClose,
      ],
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
      [setDropdownRef, shouldUseTray],
    );

    if (!isOpen) {
      return null;
    }

    return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      <ul
        className={[
          "PreactDatefield-options",
          `PreactDatefield--${theme}`,
          shouldUseTray ? "PreactDatefield-options--tray" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        // biome-ignore lint/a11y/useSemanticElements: it is correct by examples I've found for comboboxes
        role="listbox"
        id={`${id}-options-listbox`}
        aria-multiselectable={multiple ? "true" : undefined}
        hidden={!isOpen}
        ref={handleListRef}
      >
        {isLoading && loadingRenderer ? (
          <li className="PreactDatefield-option" aria-disabled>
            {loadingRenderer(translations.loadingOptions || "Loading...")}
          </li>
        ) : (
          <>
            {addNewOptionVisible && (
              <li
                key={searchTextTrimmed}
                id={`${id}-option-${toHTMLId(searchTextTrimmed)}`}
                className={`PreactDatefield-option ${activeDescendant === searchTextTrimmed ? "PreactDatefield-option--active" : ""}`}
                // biome-ignore lint/a11y/useSemanticElements: parent is <ul> so want to keep equivalent semantics
                role="option"
                tabIndex={-1}
                aria-selected={false}
                onMouseEnter={() => setActiveDescendant(searchTextTrimmed)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOptionSelect(searchTextTrimmed);
                  if (!multiple && onClose) {
                    onClose();
                  }
                }}
              >
                {(translations.addOption || 'Add "{value}"').replace("{value}", searchTextTrimmed)}
              </li>
            )}
            {filteredOptions.map((/** @type {OptionMatch} */ option) => {
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
                hasDivider ? "PreactDatefield-option--divider" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <li
                  key={option.value}
                  id={`${id}-option-${toHTMLId(option.value)}`}
                  className={optionClasses}
                  // biome-ignore lint/a11y/useSemanticElements: <explanation>
                  role="option"
                  tabIndex={-1}
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  onMouseEnter={() => !isDisabled && setActiveDescendant(option.value)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isDisabled) return;
                    onOptionSelect(option.value, { toggleSelected: true });
                    if (!multiple && onClose) {
                      onClose();
                    }
                  }}
                >
                  {optionRenderer
                    ? optionRenderer({
                        option,
                        language: language || "en",
                        isActive,
                        isSelected,
                        isInvalid,
                        showValue: showValue || false,
                        warningIcon,
                        tickIcon,
                        optionIconRenderer,
                      })
                    : option.label}
                  {isSelected && translations.selectedOption ? (
                    <span
                      className="PreactDatefield-srOnly"
                      aria-atomic="true"
                      data-reader="selected"
                      aria-hidden={!isActive}
                    >
                      {translations.selectedOption}
                    </span>
                  ) : null}
                  {isInvalid && translations.invalidOption ? (
                    <span
                      className="PreactDatefield-srOnly"
                      aria-atomic="true"
                      data-reader="invalid"
                      aria-hidden={!isActive}
                    >
                      {translations.invalidOption}
                    </span>
                  ) : null}
                </li>
              );
            })}
            {filteredOptions.length === 0 &&
              !isLoading &&
              (!allowFreeText || !searchText || arrayValues.includes(searchText)) && (
                <li className="PreactDatefield-option">{translations.noOptionsFound}</li>
              )}
            {filteredOptions.length === maxPresentedOptions && translations.typeToLoadMore && (
              <li className="PreactDatefield-option">{translations.typeToLoadMore}</li>
            )}
          </>
        )}
      </ul>
    );
  },
);

export default OptionsListbox;

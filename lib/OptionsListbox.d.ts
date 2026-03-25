export default OptionsListbox;
export type VNode = import("preact").VNode;
export type Option = {
    label: string;
    value: string;
    icon?: string | import("preact").VNode<any> | undefined;
    disabled?: boolean | undefined;
    divider?: boolean | undefined;
};
export type OptionMatch = {
    label: string;
    value: string;
    icon?: string | import("preact").VNode<any> | undefined;
    disabled?: boolean | undefined;
    divider?: boolean | undefined;
    score: number;
    matched: "value" | "label" | "none";
    matchSlices: Array<[number, number]>;
};
export type Translations = {
    searchPlaceholder: string;
    noOptionsFound: string;
    loadingOptions?: string | undefined;
    addOption?: string | undefined;
    selectedOption?: string | undefined;
    invalidOption?: string | undefined;
    typeToLoadMore?: string | undefined;
    clearValue?: string | undefined;
};
export type OptionTransformFunction = (params: {
    option: OptionMatch;
    language: string;
    isSelected: boolean;
    isInvalid: boolean;
    isActive: boolean;
    showValue: boolean;
    warningIcon?: import("preact").VNode<any> | undefined;
    tickIcon?: import("preact").VNode<any> | undefined;
    optionIconRenderer?: ((option: Option, isInput?: boolean) => VNode | null) | undefined;
}) => VNode;
export type OptionsListboxProps = {
    /**
     * - Component ID for ARIA attributes
     */
    id: string;
    /**
     * - Current search/input text
     */
    searchText: string;
    /**
     * - Pre-filtered options to display
     */
    filteredOptions: OptionMatch[];
    /**
     * - Whether options are currently loading
     */
    isLoading: boolean;
    /**
     * - Currently selected values
     */
    arrayValues: string[];
    /**
     * - Invalid selected values
     */
    invalidValues: string[];
    /**
     * - Whether multi-select is enabled
     */
    multiple: boolean;
    /**
     * - Allow adding custom options
     */
    allowFreeText: boolean;
    /**
     * - Handle option selection
     */
    onOptionSelect: (selectedValue: string, options?: {
        toggleSelected?: boolean;
    }) => void;
    /**
     * - Callback when active descendant changes (for aria-activedescendant)
     */
    onActiveDescendantChange?: ((value: string) => void) | undefined;
    /**
     * - Handle close (for single-select)
     */
    onClose?: (() => void) | undefined;
    /**
     * - Function to render options
     */
    optionRenderer?: OptionTransformFunction | undefined;
    /**
     * - Warning icon element
     */
    warningIcon?: import("preact").VNode<any> | undefined;
    /**
     * - Tick icon element
     */
    tickIcon?: import("preact").VNode<any> | undefined;
    /**
     * - Option icon renderer
     */
    optionIconRenderer?: ((option: Option, isInput?: boolean) => VNode | null) | undefined;
    /**
     * - Whether to show option values
     */
    showValue?: boolean | undefined;
    /**
     * - Language code for rendering
     */
    language?: string | undefined;
    /**
     * - Loading renderer
     */
    loadingRenderer?: ((text: string) => VNode | string) | undefined;
    /**
     * - Translation strings
     */
    translations: Translations;
    /**
     * - Theme for styling
     */
    theme: string;
    /**
     * - Maximum number of options presented
     */
    maxPresentedOptions: number;
    /**
     * - Whether the list should be visible
     */
    isOpen: boolean;
    /**
     * - Whether this is used in tray mode
     */
    shouldUseTray: boolean;
    /**
     * - Callback to set dropdown ref for popper
     */
    setDropdownRef?: ((ref: HTMLUListElement | null) => void) | undefined;
};
export type OptionsListboxRef = {
    /**
     * - Navigate to previous option
     */
    navigateUp: () => void;
    /**
     * - Navigate to next option
     */
    navigateDown: () => void;
    /**
     * - Navigate to first option
     */
    navigateToFirst: () => void;
    /**
     * - Navigate to last option
     */
    navigateToLast: () => void;
    /**
     * - Navigate down by one visible page of options
     */
    navigatePageDown: () => void;
    /**
     * - Navigate up by one visible page of options
     */
    navigatePageUp: () => void;
    /**
     * - Select the currently active option, returns true if selection was made
     */
    selectActive: () => boolean;
    /**
     * - Get the currently active descendant value
     */
    getActiveDescendant: () => string;
    /**
     * - Set the active descendant value
     */
    setActiveDescendant: (value: string) => void;
    /**
     * - Clear the active descendant
     */
    clearActiveDescendant: () => void;
};
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
declare const OptionsListbox: import("preact/compat").ForwardRefExoticComponent<OptionsListboxProps & import("preact/compat").RefAttributes<OptionsListboxRef>>;

# preact-datefield

> Work in progress: API and behavior may change.

`preact-datefield` is a Preact date/datetime input with natural-language parsing and ranked autocomplete suggestions.

Demo (GitHub Pages): https://munawwar.github.io/preact-datefield/example/example.html

## Project Status

This project is not published to npm yet.

## Features

- Date mode and datetime mode
- Natural language suggestions (month/day/year/time)
- ISO value output (`YYYY-MM-DD` for date mode, UTC ISO timestamp for datetime mode)
- Timezone-aware datetime interpretation
- Start/end boundary inference for partial input
- DMY/MDY/YMD numeric date order controls
- Min/max range constraints (`minValue`, `maxValue`, `bounds`)
- Mobile tray mode
- Form-compatible hidden input support

## Local Usage (from repo)

```jsx
import { useState } from "preact/hooks";
import PreactDatefield from "./dist/esm/PreactDatefield.js";
import "./dist/esm/PreactDatefield.css";

function App() {
  const [value, setValue] = useState("");

  return (
    <PreactDatefield
      id="start-date"
      mode="datetime"
      timeFavor="start"
      timezone="Asia/Dubai"
      value={value}
      onChange={setValue}
      placeholder="Try: Mar 6, 6pm"
    />
  );
}
```

## Component Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | required | Input id |
| `value` | `string` | required | `""`, `YYYY-MM-DD`, or UTC ISO string |
| `onChange` | `(value: string) => void` | required | Receives ISO value or `""` |
| `mode` | `"date" \| "datetime"` | `"date"` | Parsing/output mode |
| `timeFavor` | `"start" \| "end"` | `"start"` | For inferred time boundaries |
| `favor` | `"start" \| "end"` | `undefined` | Deprecated alias for `timeFavor` |
| `dayFavor` | `"past" \| "future"` | `"past"` | Direction for weekday-only input (`Sun`, `Monday`) |
| `timezone` | `string` | browser timezone | IANA timezone |
| `dateOrder` | `"auto" \| "MDY" \| "DMY" \| "YMD"` | `"auto"` | Numeric parsing preference |
| `locale` | `string` | `"en-US"` | Used when `dateOrder="auto"` |
| `allowSeconds` | `boolean` | `false` | Allow `HH:mm:ss` input |
| `allowMilliseconds` | `boolean` | `false` | Allow milliseconds input |
| `minValue` | `string` | `undefined` | Minimum allowed ISO value |
| `maxValue` | `string` | `undefined` | Maximum allowed ISO value |
| `bounds` | `"inclusive" \| "exclusive"` | `"inclusive"` | Applies to both min/max checks |
| `labelFormatter` | `(parts) => string` | `undefined` | Custom display formatting |
| `placeholder` | `string` | `""` | Input placeholder |
| `required` | `boolean` | `false` | HTML required behavior |
| `disabled` | `boolean` | `false` | Disable input |
| `showClearButton` | `boolean` | `true` | Show clear action |
| `name` | `string` | `undefined` | Hidden input name |
| `formSubmitCompatible` | `boolean` | `false` | Renders hidden input |
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | Visual theme |
| `tray` | `boolean \| "auto"` | `"auto"` | Mobile tray mode |
| `trayBreakpoint` | `string` | `"768px"` | Breakpoint when tray is auto |
| `trayLabel` | `string` | inferred | Tray title |
| `portal` | `HTMLElement` | `document.body` | Dropdown portal target |
| `className` | `string` | `""` | Root class |
| `rootElementProps` | `Record<string, any>` | `undefined` | Root div props |
| `inputProps` | `Record<string, any>` | `undefined` | Input props |
| `maxSuggestions` | `number` | `10` | Suggestion limit |
| `onBlur` | `(event: FocusEvent) => void` | `undefined` | Blur callback |

## Parser API

The package also exports parser helpers:

- `buildDateSuggestions(input, options)`
- `isoToDisplayLabel(value, options)`

`buildDateSuggestions` supports options like:

- `mode`, `timeFavor`, `dayFavor`, `timezone`, `dateOrder`, `locale`
- `allowSeconds`, `allowMilliseconds`
- `minValue`, `maxValue`, `bounds`
- `includeDefaultOption` (default `true`)
- `defaultDate` (default: `now`)
- `maxOptions`

## Development

```bash
npm run dev
```

Then open `http://localhost:3050/example/example.html`.

## License

MIT

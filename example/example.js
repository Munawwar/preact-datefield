import { createElement, render } from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";
import htm from "htm";
import PreactDatefield from "../dist/esm/PreactDatefield.js";

const html = htm.bind(createElement);
const dateFieldClass = "example-field example-field--date";
const datetimeFieldClass = "example-field example-field--datetime";

function ValueDisplay({ value }) {
  return html`
    <div class="value-display">
      <div class="value-display-inner">
        <span>Output Value</span>
        ${value 
          ? html`<code>${value}</code>` 
          : html`<span class="empty-value">(empty)</span>`
        }
      </div>
    </div>
  `;
}

function DateOnlyExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="date-only">Date Only</label>
      <${PreactDatefield}
        id="date-only"
        mode="date"
        theme=${theme}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Try: Mar 6, 3/25, tomorrow"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DateRangeExample({ theme }) {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  return html`
    <div class="section" style="grid-column: 1 / -1;">
      <div class="section-title">Date Range (linked min/max)</div>
      <div class="range-grid">
        <div>
          <label class="range-sub-label" for="range-from">Start Date</label>
          <${PreactDatefield}
            id="range-from"
            mode="date"
            theme=${theme}
            className=${dateFieldClass}
            value=${fromValue}
            onChange=${setFromValue}
            maxValue=${toValue}
            bounds="inclusive"
            placeholder="Select start date"
          />
          <${ValueDisplay} value=${fromValue} />
        </div>
        <div>
          <label class="range-sub-label" for="range-to">End Date</label>
          <${PreactDatefield}
            id="range-to"
            mode="date"
            theme=${theme}
            className=${dateFieldClass}
            value=${toValue}
            onChange=${setToValue}
            minValue=${fromValue}
            bounds="inclusive"
            placeholder="Select end date"
          />
          <${ValueDisplay} value=${toValue} />
        </div>
      </div>
    </div>
  `;
}

function DatetimeRangeExample({ theme }) {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  return html`
    <div class="section" style="grid-column: 1 / -1;">
      <div class="section-title">Datetime Range (start/end + bounds)</div>
      <div class="range-grid">
        <div>
          <label class="range-sub-label" for="dt-from">Start Time</label>
          <${PreactDatefield}
            id="dt-from"
            mode="datetime"
            timeFavor="start"
            timezone="Asia/Dubai"
            theme=${theme}
            className=${datetimeFieldClass}
            value=${fromValue}
            onChange=${setFromValue}
            maxValue=${toValue}
            bounds="inclusive"
            placeholder="e.g. Monday 9am"
          />
          <${ValueDisplay} value=${fromValue} />
        </div>
        <div>
          <label class="range-sub-label" for="dt-to">End Time</label>
          <${PreactDatefield}
            id="dt-to"
            mode="datetime"
            timeFavor="end"
            timezone="Asia/Dubai"
            theme=${theme}
            className=${datetimeFieldClass}
            value=${toValue}
            onChange=${setToValue}
            minValue=${fromValue}
            bounds="inclusive"
            placeholder="e.g. Friday 5pm"
          />
          <${ValueDisplay} value=${toValue} />
        </div>
      </div>
    </div>
  `;
}

function DMYExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="dmy">DMY Date Order (European)</label>
      <${PreactDatefield}
        id="dmy"
        mode="date"
        dateOrder="DMY"
        theme=${theme}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Try: 3/6 (= June 3rd)"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function FormIntegrationExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <form onSubmit=${(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        alert("Form submitted! Hidden input 'event-date' value: " + formData.get("event-date"));
      }} style="display: flex; flex-direction: column; height: 100%;">
        <label for="form-date">Form Integration (Required + Hidden Input)</label>
        <${PreactDatefield}
          id="form-date"
          name="event-date"
          mode="date"
          theme=${theme}
          className=${dateFieldClass}
          value=${value}
          onChange=${setValue}
          required=${true}
          formSubmitCompatible=${true}
          placeholder="Required field"
        />
        <div class="button-group" style="margin-top: 12px; margin-bottom: 8px;">
          <button type="submit">Submit Form</button>
        </div>
        <${ValueDisplay} value=${value} />
      </form>
    </div>
  `;
}

function DisabledExample({ theme }) {
  return html`
    <div class="section">
      <label for="disabled-date">Disabled State</label>
      <${PreactDatefield}
        id="disabled-date"
        mode="date"
        theme=${theme}
        className=${dateFieldClass}
        value="2026-03-25"
        onChange=${() => {}}
        disabled=${true}
      />
      <${ValueDisplay} value="2026-03-25" />
    </div>
  `;
}

function ProgrammaticExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="programmatic">Programmatic Control</label>
      <${PreactDatefield}
        id="programmatic"
        mode="datetime"
        timezone="America/New_York"
        theme=${theme}
        className=${datetimeFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Controlled externally"
      />
      <div class="button-group">
        <button type="button" onClick=${() => setValue("2026-03-25T14:00:00.000Z")}>Set: Mar 25, 10am ET</button>
        <button type="button" onClick=${() => setValue("2026-12-31T23:59:59.999Z")}>Set: NYE</button>
        <button type="button" onClick=${() => setValue("")}>Clear</button>
      </div>
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function SecondsExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="seconds">Datetime with Seconds</label>
      <${PreactDatefield}
        id="seconds"
        mode="datetime"
        timezone="Asia/Dubai"
        allowSeconds=${true}
        theme=${theme}
        className=${datetimeFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Try: 6:30:45 pm"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function CustomFormatterExample({ theme }) {
  const [value, setValue] = useState("");
  const formatter = useCallback((parts) => {
    return `${parts.day}/${parts.month}/${parts.year}`;
  }, []);
  return html`
    <div class="section">
      <label for="custom-fmt">Custom Label Formatter (DD/MM/YYYY)</label>
      <${PreactDatefield}
        id="custom-fmt"
        mode="date"
        dateOrder="DMY"
        theme=${theme}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        labelFormatter=${formatter}
        placeholder="Try: 25 mar"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function TrayExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="tray-example">Mobile Tray (auto)</label>
      <${PreactDatefield}
        id="tray-example"
        mode="date"
        theme=${theme}
        tray="auto"
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Dropdown on desktop, tray on mobile"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DarkThemeExample() {
  const [value, setValue] = useState("");
  return html`
    <div class="section" style="background: #0f172a; border-color: #1e293b; color: #f8fafc;">
      <label for="dark-date" style="color: #f8fafc;">Explicit Dark Theme</label>
      <${PreactDatefield}
        id="dark-date"
        mode="datetime"
        timezone="Asia/Dubai"
        theme="dark"
        className=${datetimeFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Always dark"
      />
      <div class="value-display" style="margin-top: auto; padding-top: 20px; font-size: 13px; color: #94a3b8;">
        <div class="value-display-inner" style="background: #020617; border-color: #334155;">
          <span>Output Value</span>
          ${value 
            ? html`<code style="background: #1e293b; color: #e2e8f0;">${value}</code>` 
            : html`<span class="empty-value">(empty)</span>`
          }
        </div>
      </div>
    </div>
  `;
}

function App() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const handleThemeChange = (e) => setTheme(e.detail?.theme || "light");
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  return html`
    <main class="main-content">
      <div class="examples-grid">
        <${DateOnlyExample} theme=${theme} />
        <${SecondsExample} theme=${theme} />
        <${TrayExample} theme=${theme} />
        <${DatetimeRangeExample} theme=${theme} />
        <${DMYExample} theme=${theme} />
        <${FormIntegrationExample} theme=${theme} />
        <${ProgrammaticExample} theme=${theme} />
        <${DateRangeExample} theme=${theme} />
        <${DisabledExample} theme=${theme} />
        <${CustomFormatterExample} theme=${theme} />
        <${DarkThemeExample} />
      </div>
    </main>
  `;
}

render(html`<${App} />`, document.getElementById("root"));

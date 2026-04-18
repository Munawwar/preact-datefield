import { createElement, render } from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";
import htm from "htm";
import PreactDatefield from "../dist/esm/PreactDatefield.js";

const html = htm.bind(createElement);
const dateFieldClass = "example-field example-field--date";
const datetimeFieldClass = "example-field example-field--datetime";

function ValueDisplay({ value }) {
  return html`<div class="value-display">Value: <code>${value || "(empty)"}</code></div>`;
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
        tray=${false}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Try: Mar 6, 3/25, etc."
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DateRangeExample({ theme }) {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  return html`
    <div class="section">
      <div class="section-title">Date Range (linked min/max)</div>
      <div class="range-grid">
        <div class="range-item">
          <label class="range-sub-label" for="range-from">From</label>
          <${PreactDatefield}
            id="range-from"
            mode="date"
            theme=${theme}
            tray=${false}
            className=${dateFieldClass}
            value=${fromValue}
            onChange=${setFromValue}
            maxValue=${toValue}
            bounds="inclusive"
            placeholder="Start date"
          />
          <${ValueDisplay} value=${fromValue} />
        </div>
        <div class="range-item">
          <label class="range-sub-label" for="range-to">To</label>
          <${PreactDatefield}
            id="range-to"
            mode="date"
            theme=${theme}
            tray=${false}
            className=${dateFieldClass}
            value=${toValue}
            onChange=${setToValue}
            minValue=${fromValue}
            bounds="inclusive"
            placeholder="End date"
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
    <div class="section">
      <div class="section-title">Datetime Range (start/end + min/max)</div>
      <div class="range-grid">
        <div class="range-item">
          <label class="range-sub-label" for="dt-from">From</label>
          <${PreactDatefield}
            id="dt-from"
            mode="datetime"
            timeFavor="start"
            timezone="Asia/Dubai"
            theme=${theme}
            tray=${false}
            className=${datetimeFieldClass}
            value=${fromValue}
            onChange=${setFromValue}
            maxValue=${toValue}
            bounds="inclusive"
            placeholder="Start datetime"
          />
          <${ValueDisplay} value=${fromValue} />
        </div>
        <div class="range-item">
          <label class="range-sub-label" for="dt-to">To</label>
          <${PreactDatefield}
            id="dt-to"
            mode="datetime"
            timeFavor="end"
            timezone="Asia/Dubai"
            theme=${theme}
            tray=${false}
            className=${datetimeFieldClass}
            value=${toValue}
            onChange=${setToValue}
            minValue=${fromValue}
            bounds="inclusive"
            placeholder="End datetime"
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
        tray=${false}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Try: 3/6 (= June 3rd)"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function RequiredFieldExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <form onSubmit=${(e) => { e.preventDefault(); alert("Form submitted! Value: " + value); }}>
        <label for="required-date">Required Date</label>
        <${PreactDatefield}
          id="required-date"
          mode="date"
          theme=${theme}
          tray=${false}
          className=${dateFieldClass}
          value=${value}
          onChange=${setValue}
          required=${true}
          placeholder="Required field"
        />
        <${ValueDisplay} value=${value} />
        <button type="submit" style="margin-top: 4px">Submit</button>
      </form>
    </div>
  `;
}

function DisabledExample({ theme }) {
  return html`
    <div class="section">
      <label for="disabled-date">Disabled</label>
      <${PreactDatefield}
        id="disabled-date"
        mode="date"
        theme=${theme}
        tray=${false}
        className=${dateFieldClass}
        value="2026-03-25"
        onChange=${() => {}}
        disabled=${true}
      />
    </div>
  `;
}

function ProgrammaticExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="programmatic">Programmatic Value</label>
      <${PreactDatefield}
        id="programmatic"
        mode="datetime"
        timezone="America/New_York"
        theme=${theme}
        tray=${false}
        className=${datetimeFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Click buttons below"
      />
      <${ValueDisplay} value=${value} />
      <div style="display: flex; gap: 8px; margin-top: 4px;">
        <button type="button" onClick=${() => setValue("2026-03-25T14:00:00.000Z")}>Set to Mar 25, 10am ET</button>
        <button type="button" onClick=${() => setValue("2026-12-31T23:59:59.999Z")}>Set to NYE midnight</button>
        <button type="button" onClick=${() => setValue("")}>Clear</button>
      </div>
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
        tray=${false}
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
        tray=${false}
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

function FormSubmitExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <form onSubmit=${(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        alert("Form data: " + formData.get("event-date"));
      }}>
        <label for="form-date">Form Compatible</label>
        <${PreactDatefield}
          id="form-date"
          name="event-date"
          mode="date"
          theme=${theme}
          tray=${false}
          className=${dateFieldClass}
          value=${value}
          onChange=${setValue}
          formSubmitCompatible=${true}
          placeholder="Submits via hidden input"
        />
        <${ValueDisplay} value=${value} />
        <button type="submit" style="margin-top: 4px">Submit Form</button>
      </form>
    </div>
  `;
}

function TrayExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="tray-example">Mobile Tray (explicit)</label>
      <${PreactDatefield}
        id="tray-example"
        mode="date"
        theme=${theme}
        tray=${true}
        className=${dateFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Tray enabled explicitly"
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DarkThemeExample() {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="dark-date">Explicit Dark Theme</label>
      <${PreactDatefield}
        id="dark-date"
        mode="datetime"
        timezone="Asia/Dubai"
        theme="dark"
        tray=${false}
        className=${datetimeFieldClass}
        value=${value}
        onChange=${setValue}
        placeholder="Always dark"
      />
      <${ValueDisplay} value=${value} />
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
    <div>
      <${DateOnlyExample} theme=${theme} />
      <${DateRangeExample} theme=${theme} />
      <${DatetimeRangeExample} theme=${theme} />
      <${DMYExample} theme=${theme} />
      <${TrayExample} theme=${theme} />
      <${RequiredFieldExample} theme=${theme} />
      <${DisabledExample} theme=${theme} />
      <${ProgrammaticExample} theme=${theme} />
      <${SecondsExample} theme=${theme} />
      <${CustomFormatterExample} theme=${theme} />
      <${FormSubmitExample} theme=${theme} />
      <${DarkThemeExample} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("root"));

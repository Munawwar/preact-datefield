import { createElement, render } from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";
import htm from "htm";
import PreactDatefield from "../dist/esm/PreactDatefield.js";

const html = htm.bind(createElement);

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
        value=${value}
        onChange=${setValue}
        placeholder="Try: Mar 6, 3/25, etc."
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DatetimeFavorStartExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="dt-start">Datetime (favor start)</label>
      <${PreactDatefield}
        id="dt-start"
        mode="datetime"
        timeFavor="start"
        timezone="Asia/Dubai"
        theme=${theme}
        value=${value}
        onChange=${setValue}
        placeholder="Try: Mar 6, 6pm, etc."
      />
      <${ValueDisplay} value=${value} />
    </div>
  `;
}

function DatetimeFavorEndExample({ theme }) {
  const [value, setValue] = useState("");
  return html`
    <div class="section">
      <label for="dt-end">Datetime (favor end)</label>
      <${PreactDatefield}
        id="dt-end"
        mode="datetime"
        timeFavor="end"
        timezone="Asia/Dubai"
        theme=${theme}
        value=${value}
        onChange=${setValue}
        placeholder="Try: Mar 6, 6pm, etc."
      />
      <${ValueDisplay} value=${value} />
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
      <${DatetimeFavorStartExample} theme=${theme} />
      <${DatetimeFavorEndExample} theme=${theme} />
      <${DMYExample} theme=${theme} />
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

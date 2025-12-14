import { LitElement, html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";

import { Icons } from "../../shared/icons";
import { db, Template } from "../../service/db";
import { Parameter } from "../../service/interface";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

import styles from "./fg-input-parameter.lit.scss?inline";
import SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

setBasePath("/");
@customElement("fg-input-parameter")
export class FgInputParameter extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ type: Number, hasChanged: () => true }) itemId?: number = 0;
  @state() template?: Template = undefined;
  @queryAll("sl-textarea") textareas!: SlTextarea[];

  constructor() {
    super();
  }

  async willUpdate(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("itemId") &&
      this.itemId !== undefined &&
      this.itemId !== 0
    ) {
      this.refresh();
    }
  }

  async refresh() {
    if (this.itemId !== undefined && this.itemId !== 0) {
      this.template = await db.selectItemById(this.itemId);
    }
  }

  render() {
    return html` <div class="input-parameter">
      ${this.template?.params?.map(
        (f) =>
          html`<sl-tooltip content=${f} placement="top-start" trigger="focus">
            <sl-textarea
              placeholder=${f}
              size="small"
              rows="1"
              resize="auto"
              @focus=${this._handleChange}
              @blur=${this._handleChange}
              @input=${this._handleChange}
            ></sl-textarea>
          </sl-tooltip>`
      )}
    </div>`;
  }

  async clear() {
    this.textareas.forEach((f) => (f.value = ""));
    this._handleChange();
  }

  private _handleChange() {
    const params: Parameter[] = Array.from(this.textareas).map((f) => {
      return {
        key: f.placeholder,
        value: f.value,
        isFocus: this.shadowRoot?.activeElement === f,
      } as Parameter;
    });

    const event = new CustomEvent("change-param", {
      detail: { params: params },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

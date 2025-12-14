import { LitElement, html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { Icons } from "../../shared/icons";
import { db, Template } from "../../service/db";
import { Parameter } from "../../service/interface";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

import styles from "./fg-output-result.lit.scss?inline";

setBasePath("/");
@customElement("fg-output-result")
export class FgOutputResult extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ type: Number, hasChanged: () => true }) itemId?: number = 0;
  @property({ type: [] }) params?: Parameter[] = [];
  @state() template?: Template = undefined;
  @query("output-result") outputResult!: HTMLDivElement;

  constructor() {
    super();
  }

  async willUpdate(changedProperties: Map<string, any>) {
    if (
      (changedProperties.has("itemId") || changedProperties.has("params")) &&
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
    return html`<div class="result" @click=${this._handleClick}>
      <div class="inner">${unsafeHTML(this._editText())}</div>
    </div>`;
  }
  private _editText(needFocus: boolean = true) {
    let workText: string = this.template?.content ?? "";

    this.params?.forEach((p) => {
      const regex = new RegExp(p.key, "g");
      if (needFocus && p.isFocus) {
        workText = workText.replace(
          regex,
          `<span class="focus">${p.key}</span>`
        );
      }
      if (p.value !== "") {
        workText = workText.replace(regex, p.value);
      }
    });
    return workText;
  }
  private async _handleClick() {
    await this.copyText();
  }
  async copyText() {
    await navigator.clipboard.writeText(this._editText(false));
  }
}

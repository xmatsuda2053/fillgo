import { LitElement, html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";

import { Icons } from "../../shared/icons";
import { db, Template } from "../../service/db";

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
  @state() template?: Template = undefined;

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
    return html` <div class="output-result"></div>`;
  }
}

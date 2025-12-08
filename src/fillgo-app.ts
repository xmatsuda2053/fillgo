import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

setBasePath("/");

import styles from "./fillgo-app.lit.scss?inline";

@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html`<div></div>`;
  }
}

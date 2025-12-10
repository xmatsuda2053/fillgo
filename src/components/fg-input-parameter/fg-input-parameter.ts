import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "../../shared/icons";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

import styles from "./fg-input-parameter.lit.scss?inline";

setBasePath("/");
@customElement("fg-input-parameter")
export class FgInputParameter extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html` <div class="input-parameter"></div>`;
  }
}

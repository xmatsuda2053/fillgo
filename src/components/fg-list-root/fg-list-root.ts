import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "../../shared/icons";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";

import styles from "./fg-list-root.lit.scss?inline";

setBasePath("/");
@customElement("fg-list-root")
export class FgListRoot extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html` <div class="list-root" @click-menu=${this._openMenu}>
      <slot></slot>
    </div>`;
  }

  private _openMenu(e: CustomEvent) {
    console.log(e.target);
  }
}

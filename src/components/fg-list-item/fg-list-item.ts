import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "../../shared/icons";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";

import styles from "./fg-list-item.lit.scss?inline";

setBasePath("/");
@customElement("fg-list-item")
export class FgListItem extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html` <div class="list-item">
      <div class="text title-area">
        <slot name="title" class="title"></slot>
      </div>
      <div class="text udpateAt-area">
        <slot name="updateAt" class="updateAt"></slot>
      </div>
      <div class="button-area">
        <sl-tooltip content="Menu">
          <sl-button size="small">${Icons.dots}</sl-button>
        </sl-tooltip>
      </div>
    </div>`;
  }
}

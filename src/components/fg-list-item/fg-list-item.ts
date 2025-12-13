import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, property, query } from "lit/decorators.js";

import { Icons } from "../../shared/icons";
import { Template } from "../../service/db";

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

  @property({ type: Object, hasChanged: () => true }) template?: Template;
  @state() private _internalTemplate?: Template;

  constructor() {
    super();
  }

  willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has("template") && this.template !== undefined) {
      this._internalTemplate = { ...this.template };
    }
  }

  render() {
    return html` <div class="list-item">
      <div class="text title-area" @click=${this._selected}>
        <slot name="title" class="title"></slot>
      </div>
      <div class="text udpateAt-area" @click=${this._selected}>
        <slot name="updateAt" class="updateAt"></slot>
      </div>
      <div class="button-area">
        <sl-tooltip content="Menu">
          <sl-button size="small" @click=${this._openMenu}>
            ${Icons.dots}
          </sl-button>
        </sl-tooltip>
      </div>
    </div>`;
  }

  private _selected() {
    console.log("selected");
  }

  private _openMenu(e: Event) {
    const event = new CustomEvent("click-menu", {
      detail: { target: e.target },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

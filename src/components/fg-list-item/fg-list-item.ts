import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { Icons } from "../../shared/icons";
import { Template } from "../../service/db";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";

import styles from "./fg-list-item.lit.scss?inline";

setBasePath("/");
@customElement("fg-list-item")
export class FgListItem extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ type: Number, hasChanged: () => true }) itemId?: Number;
  @property({ type: Boolean }) isSelect?: Boolean;

  constructor() {
    super();
  }

  render() {
    return html` <div
      class=${classMap({
        "list-item": true,
        "is-selected": this.isSelect === true,
      })}
    >
      <div class="text title-area" @click=${this._selected}>
        <slot name="title" class="title"></slot>
      </div>
      <div class="text udpateAt-area" @click=${this._selected}>
        <slot name="updateAt" class="updateAt"></slot>
      </div>
      <div class="button-area">
        <sl-dropdown>
          <sl-button size="small" slot="trigger"> ${Icons.dots} </sl-button>
          <sl-menu id="context-menu">
            <sl-menu-item value="edit" @click=${this._edit}>
              編集
            </sl-menu-item>
            <sl-menu-item value="delete" class="danger" @click=${this._delete}>
              削除 ${Icons.trash}
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>
    </div>`;
  }

  private _selected() {
    const event = new CustomEvent("selected-item", {
      detail: { itemId: this.itemId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _edit() {
    const event = new CustomEvent("edit-item", {
      detail: { itemId: this.itemId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _delete() {
    const event = new CustomEvent("delete-item", {
      detail: { itemId: this.itemId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

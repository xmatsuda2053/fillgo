import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, query } from "lit/decorators.js";
import { emit } from "@/components/shared/event";

import styles from "./fg-list-group.lit.scss?inline";

@customElement("fg-list-group")
export class FgListGroup extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * 選択中リストのID
   *
   * @private
   * @type {string}
   * @memberof FgListGroup
   */
  @state() private _selectedId: string = "";

  /**
   * コンポーネント内のすべてのslot
   *
   * @private
   * @type {HTMLSlotElement}
   * @memberof FgListGroup
   */
  @query("slot") private _slots!: HTMLSlotElement;

  protected willUpdate(_changedProperties: PropertyValues) {}

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * ツールバーおよびコンテンツから構成されるリストビューの基本構造を定義します。
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgListGroup
   */
  protected render(): HTMLTemplateResult {
    return html`<div class="fg-list-group">
      <div class="button-group-toolbar">
        <sl-button-group label="file">
          <!-- 新規追加 -->
          <sl-button size="small" @click=${this._handleAddClick}>
            <sl-icon library="fillgo" name="plus-lg" label="add"></sl-icon>
          </sl-button>
          <!-- 編集 -->
          <sl-button
            size="small"
            ?disabled=${this._selectedId === ""}
            @click=${this._handleEditClick}
          >
            <sl-icon
              library="fillgo"
              name="pencil-square"
              label="edit"
            ></sl-icon>
          </sl-button>
          <!-- その他 -->
          <sl-dropdown>
            <sl-button size="small" slot="trigger">
              <sl-icon
                library="fillgo"
                name="three-dots"
                label="menu"
              ></sl-icon>
            </sl-button>
            <sl-menu>
              <sl-menu-item
                class="delete"
                ?disabled=${this._selectedId === ""}
                @click=${this._handleDeleteClick}
              >
                <sl-icon
                  library="fillgo"
                  name="trash3"
                  label="delete"
                  slot="prefix"
                ></sl-icon>
                Delete
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>
        </sl-button-group>
      </div>
      <div class="contents scrollable" @clickList=${this._handleListClick}>
        <slot></slot>
      </div>
    </div>`;
  }

  /**
   * 新規追加イベントを発行する。
   *
   * @private
   * @memberof FgListGroup
   */
  private _handleAddClick() {
    emit(this, "clickMenuAdd");
  }

  /**
   * 編集イベントを発行する。
   *
   * @private
   * @memberof FgListGroup
   */
  private _handleEditClick() {
    emit(this, "clickMenuEdit", { detail: { listId: this._selectedId } });
  }

  /**
   * 削除イベントを発行する。
   */
  private _handleDeleteClick() {
    emit(this, "clickMenuDelete", { detail: { listId: this._selectedId } });
  }

  /**
   * クリックされたList以外からselectedを解除する。
   *
   * @private
   * @param {Event} e
   * @memberof FgListGroup
   */
  private _handleListClick(e: CustomEvent) {
    this._selectedId = e.detail.listId;

    const clickedItem = e.target as HTMLElement;
    const items = this._slots.assignedElements() as any[];
    items.forEach((item) => {
      if (typeof item.selected !== "undefined") {
        if (item !== clickedItem) {
          item.selected = false;
        }
      }
    });
  }
}

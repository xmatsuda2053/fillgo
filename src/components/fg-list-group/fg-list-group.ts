import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { emit } from "@/components/shared/event";

import type { FgList } from "@components/fg-list/fg-list";

import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./fg-list-group.lit.scss?inline";

export interface Filter {
  id: number;
  name: string;
}

const FILTER_ALL: number = 0;

@customElement("fg-list-group")
export class FgListGroup extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(sharedStyles)}
    `,
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * フィルタ用の設定値
   *
   * @type {Filter[]}
   * @memberof FgListGroup
   */
  @property({ type: Array }) filters?: Filter[];

  /**
   * 選択中リストのID
   *
   * @private
   * @type {string}
   * @memberof FgListGroup
   */
  @state() private _selectedId: number | undefined = undefined;

  /**
   * フィルタ要素のID
   *
   * @private
   * @type {string}
   * @memberof FgListGroup
   */
  @state() private _selectedFilterId: number | undefined = undefined;

  /**
   * コンポーネント内のすべてのslot
   *
   * @private
   * @type {HTMLSlotElement}
   * @memberof FgListGroup
   */
  @query("slot") private _slots!: HTMLSlotElement;

  /**
   * プロパティ更新時の事前処理。
   * filters プロパティが変更された際、現在選択されているフィルターID (`_selectedFilterId`) が
   * 新しいリスト内に存在するかを確認します。
   * リストから削除されていた場合や、初期状態の場合は ID を 0 (初期値) にリセットします。
   *
   * @protected
   * @param {PropertyValues} _changedProperties 更新されたプロパティのマップ
   * @memberof FgListGroup
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    if (!_changedProperties.has("filters")) return;
    const exists = this.filters?.some((f) => f.id === this._selectedFilterId);
    if (!exists) {
      this._selectedFilterId = FILTER_ALL;
    }
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * ツールバーおよびコンテンツから構成されるリストビューの基本構造を定義します。
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgListGroup
   */
  protected render(): HTMLTemplateResult {
    return html`<div class="item-base">
      <div class="toolbar">
        <sl-button-group label="file">
          <sl-tooltip content="新規追加" placement="bottom-start">
            <sl-button size="small" @click=${this._handleAddClick} outline>
              <sl-icon library="fillgo" name="plus-lg" label="add"></sl-icon>
            </sl-button>
          </sl-tooltip>

          <sl-dropdown>
            <sl-button size="small" slot="trigger" outline Caret>
              <sl-icon
                library="fillgo"
                name="${this._selectedFilterId === FILTER_ALL
                  ? "filter"
                  : "filter-square-fill"}"
                label="filter"
              ></sl-icon>
            </sl-button>
            <sl-menu @sl-select=${this._handleFilterSelect}>
              <sl-menu-item
                type="checkbox"
                value="0"
                ?checked=${this._selectedFilterId === FILTER_ALL}
              >
                すべて
              </sl-menu-item>
              ${this.filters?.map(
                (f) =>
                  html`<sl-menu-item
                    type="checkbox"
                    value=${f.id}
                    ?checked=${this._selectedFilterId === f.id}
                  >
                    ${f.name}
                  </sl-menu-item>`
              )}
            </sl-menu>
          </sl-dropdown>

          <sl-tooltip content="編集" placement="bottom-start">
            <sl-button
              size="small"
              ?disabled=${!this._selectedId}
              @click=${this._handleEditClick}
              outline
            >
              <sl-icon
                library="fillgo"
                name="pencil-square"
                label="edit"
              ></sl-icon>
            </sl-button>
          </sl-tooltip>

          <sl-tooltip content="コピー" placement="bottom-start">
            <sl-button
              size="small"
              ?disabled=${!this._selectedId}
              @click=${this._handleCopyClick}
              outline
            >
              <sl-icon library="fillgo" name="copy" label="copy"></sl-icon>
            </sl-button>
          </sl-tooltip>

          <sl-dropdown>
            <sl-button size="small" slot="trigger" outline>
              <sl-icon
                library="fillgo"
                name="three-dots"
                label="menu"
              ></sl-icon>
            </sl-button>
            <sl-menu>
              <sl-menu-item
                class="delete"
                ?disabled=${!this._selectedId}
                @click=${this._handleDeleteClick}
              >
                <sl-icon
                  library="fillgo"
                  name="trash3"
                  label="delete"
                  slot="prefix"
                ></sl-icon>
                削除
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
   * フィルタ実行時のイベントを発行する。
   *
   * @private
   * @param {CustomEvent} e
   * @memberof FgListGroup
   */
  private _handleFilterSelect(e: CustomEvent) {
    const selectedItem = e.detail.item;
    const selectedId: number = Number(selectedItem.value);

    this._selectedFilterId =
      this._selectedFilterId === selectedId ? undefined : selectedId;

    // フィルタ実行
    const items = this._slots.assignedElements() as FgList[];

    items.forEach((item) => {
      if (
        this._selectedFilterId === FILTER_ALL ||
        item.compareCategoryId(this._selectedFilterId!)
      ) {
        item.show();
      } else {
        item.hide();
      }
    });
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
   * コピーイベントを発行する。
   *
   * @private
   * @memberof FgListGroup
   */
  private _handleCopyClick() {
    emit(this, "clickMenuCopy", { detail: { listId: this._selectedId } });
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
    const items = this._slots.assignedElements() as FgList[];
    items.forEach((item) => {
      if (typeof item.selected !== "undefined") {
        if (item !== clickedItem) {
          item.selected = false;
        }
      }
    });
  }
}

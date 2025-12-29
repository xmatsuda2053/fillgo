import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { emit } from "@shared/event";

import styles from "./fg-list.lit.scss?inline";

@customElement("fg-list")
export class FgList extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _tooltipContent: string = "";

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * リストを一意に特定可能なID
   *
   * @type {string}
   * @memberof FgList
   */
  @property({ type: String }) listId?: string;

  /**
   * リストのカテゴリ
   *
   * @type {string}
   * @memberof FgList
   */
  @property({ type: String }) category?: string;

  /**
   *　リスト選択の状態を管理するフラグ
   *
   * @memberof FgList
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  protected willUpdate(_changedProperties: PropertyValues) {}

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * リストのタイトル及びタグから構成されるリストアイテムの基本構造を定義します。
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgList
   */
  protected render(): HTMLTemplateResult {
    return html`<div
      class="fg-list ${this.selected ? "is-selected" : ""}"
      @click=${() => this._handleClick(this.listId)}
    >
      <sl-tooltip content=${this._tooltipContent} placement="right-start">
        <div class="title">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </sl-tooltip>
      <div class="category">
        <sl-icon library="fillgo" name="bookmark"></sl-icon>
        ${this.category}
      </div>
    </div>`;
  }

  /**
   * スロットの中身が変わった時に呼び出されるメソッドです。
   * スロットに割り当てられたノードからテキストを抽出します。
   *
   * @private
   * @param {Event} e
   * @memberof FgList
   */
  private _handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    const text = nodes
      .map((node) => node.textContent)
      .join("")
      .trim();

    this._tooltipContent = text;
  }

  /**
   * リストクリック時、リストを選択状態とする。
   * そのうえで、リストクリックのイベントを発生させる。
   *
   * @private
   * @param {string} [id]
   * @memberof FgList
   */
  private _handleClick(id?: string) {
    this.selected = true;
    emit(this, "clickList", { detail: { item: this, listId: id } });
  }
}

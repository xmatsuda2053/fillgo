import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, query } from "lit/decorators.js";
import { db, Category } from "@service/db";

import type SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";

import styles from "./fg-setting-category.lit.scss?inline";

@customElement("fg-setting-category")
export class FgSettingCategory extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * カテゴリ一覧
   * @private
   * @type {Category[]}
   * @memberof FgSettingCategory
   */
  @state() private _categorys: Category[] = [];

  /**
   * 新規カテゴリの入力アイテム
   * @type {SlInput}
   * @memberof FgSettingCategory
   */
  @query("#new-category") newCategory!: SlInput;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * 画面更新前の処理を実行します。
   * @param _changedProperties
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    this._refresh();
  }

  /**
   * タグ一覧を取得します。
   * @private
   * @memberof FgSettingCategory
   */
  private async _refresh() {
    this._categorys = await db.selectCategorys();
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
    return html`<div class="category-root">
      <div class="category-input-area">
        <sl-input
          placeholder="入力..."
          size="small"
          id="new-category"
        ></sl-input>
        <sl-button
          variant="primary"
          size="small"
          @click=${this._handleAddCategory}
        >
          <sl-icon library="fillgo" name="plus-lg" label="add"></sl-icon>
        </sl-button>
      </div>
      <div class="category-items">
        ${this._categorys.map(
          (f) => html`
            <sl-tag
              variant="primary"
              size="small"
              @sl-remove=${() => this._handleRemoveCategory(f.id!)}
              removable
              pill
            >
              ${f.name}
            </sl-tag>
          `
        )}
      </div>
    </div>`;
  }

  /**
   * カテゴリを追加します。
   */
  private _handleAddCategory() {
    const category: Category = {
      name: this.newCategory.value,
    };

    if (category.name === "") {
      this.newCategory.setCustomValidity("カテゴリ名を入力してください");
      this.newCategory.reportValidity();
      return;
    }

    if (this._categorys.map((f) => f.name).includes(category.name)) {
      this.newCategory.setCustomValidity("登録済みのカテゴリ名です");
      this.newCategory.reportValidity();
      return;
    }

    db.insertCategory(category);
    this.newCategory.value = "";
  }

  /**
   * 対象のカテゴリを削除します。
   * @param id
   */
  private _handleRemoveCategory(id: number) {
    db.deleteCategory(id);
  }
}

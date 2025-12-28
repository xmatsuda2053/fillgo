import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import {
  customElement,
  state,
  property,
  query,
  queryAll,
} from "lit/decorators.js";
import { emit } from "../../shared/event";
import { extractParams, getTotalFullWidthCount } from "../../service/utils";
import { db, Category } from "../../service/db";
import type { Param } from "../../interface/Param";

import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import type SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import type SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import type SlRadioGroup from "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";

import styles from "./fg-template-editor.lit.scss?inline";
import { SlButton } from "@shoelace-style/shoelace";

@customElement("fg-template-editor")
export class FgTemplateEditor extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _params: Param[] = [];

  /**
   * カテゴリ一覧
   * @private
   * @type {Category[]}
   * @memberof FgSettingCategory
   */
  @state() private _categorys: Category[] = [];

  /**
   * テンプレートを編集するための画面要素。
   *
   * @type {SlDialog}
   * @memberof FillGoApp
   */
  @query("#dialog-template-editor") dialogTemplateEditor!: SlDialog;

  /**
   * テンプレートのタイトルを入力するための要素。
   * @private
   * @type {SlInput}
   * @memberof FgTemplateEditor
   */
  @query("#template-title") inputTitle!: SlInput;

  /**
   * テンプレートの本文（メインコンテンツ）を入力するための要素。
   * @private
   * @type {SlTextarea}
   * @memberof FgTemplateEditor
   */
  @query("#template-content") inputContent!: SlTextarea;

  /**
   * テンプレート内で使用されるパラメータを入力・管理するための要素。
   * @private
   * @type {SlInput}
   * @memberof FgTemplateEditor
   */
  @query("#template-params") inputParams!: SlInput;

  /**
   * パラメータ要素のラベルを管理するための要素。
   *
   * @type {SlRadioGroup[]}
   * @memberof FgTemplateEditor
   */
  @queryAll(".width-manual") paramLabels!: SlRadioGroup[];

  /**
   * カテゴリ洗濯用のボタンを管理するための要素。
   *
   * @type {SlButton[]}
   * @memberof FgTemplateEditor
   */
  @queryAll(".category-button") categoryButtons!: SlButton[];

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
    return html` <sl-dialog
      label="Template Editor"
      id="dialog-template-editor"
      @sl-request-close=${this._handleRequestClose}
    >
      <sl-tab-group id="editor-tab">
        <sl-tab slot="nav" panel="base">基本情報</sl-tab>
        <sl-tab slot="nav" panel="params">パラメタ定義</sl-tab>
        <sl-tab-panel name="base">
          <div id="editor-input-data" class="editor-form">
            ${this._renderBaseInput()}
          </div>
        </sl-tab-panel>
        <sl-tab-panel name="params">
          <div class="editor-form">${this._renderParamsInput()}</div>
        </sl-tab-panel>
      </sl-tab-group>
      <sl-button slot="footer" variant="primary">
        <sl-icon slot="prefix" library="fillgo" name="floppy2-fill"></sl-icon>
        保存
      </sl-button>
    </sl-dialog>`;
  }

  /**
   * 基礎項目入力画面の基本構造を定義します。
   *
   * @private
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgTemplateEditor
   */
  private _renderBaseInput(): HTMLTemplateResult {
    return html`<div class="base-container">
      <div class="base-l">
        <sl-input
          id="template-title"
          class="label-on-left"
          label="タイトル"
          placeholder="e.g. 業務連絡"
          size="small"
          clearable
        ></sl-input>
        <sl-textarea
          id="template-content"
          class="label-on-left"
          label="内容"
          placeholder="e.g. {所属} の {氏名} さんから次の通り連絡がありました。"
          size="small"
          resize="none"
          @input=${this._handleInputTemplateContents}
        ></sl-textarea>
        <sl-input
          id="template-params"
          class="label-on-left"
          label="パラメタ"
          size="small"
          value=${this._params.map((p) => p.value).join(",")}
          disabled
        >
        </sl-input>
      </div>
      <div class="base-r">
        ${this._categorys.map(
          (f) => html`
            <sl-button
              variant="default"
              size="small"
              class="category-button"
              @click=${this._handleClickCategory}
              pill
            >
              ${f.name}
            </sl-button>
          `
        )}
      </div>
    </div>`;
  }

  /**
   * パラメータ入力画面の基本構造を定義します。
   *
   * @private
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgTemplateEditor
   */
  private _renderParamsInput(): HTMLTemplateResult {
    return html`${this._params.map(
      (p, i) => html`<sl-radio-group
        id="type${i}"
        label=${p.value}
        class="label-on-left width-manual"
        size="small"
        value=${p.type}
        @sl-change=${(e: Event) => this._handleTypeChange(e, i)}
      >
        <sl-radio-button value="string">
          <sl-icon slot="prefix" library="fillgo" name="fonts"></sl-icon>
          文字列
        </sl-radio-button>
        <sl-radio-button value="number">
          <sl-icon slot="prefix" library="fillgo" name="123"></sl-icon>
          数値
        </sl-radio-button>
        <sl-radio-button value="date">
          <sl-icon
            slot="prefix"
            library="fillgo"
            name="calendar3-event"
          ></sl-icon>
          日付
        </sl-radio-button>
      </sl-radio-group> `
    )}`;
  }

  /**
   * パラメータのラジオボタンの変更を反映します。
   * @param {CustomEvent} e - Shoelaceのイベントオブジェクト
   * @param {number} index - 更新対象のパラメータのインデックス
   */
  private _handleTypeChange(e: Event, index: number): void {
    const target = e.target as HTMLInputElement;
    const newType = target.value;
    this._params = this._params.map((p, i) =>
      i === index ? { ...p, type: newType } : p
    );
  }

  /**
   * 画面アップデート後「Params」タブのラベルwidthを変更する。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof FgTemplateEditor
   */
  protected async updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has("_params")) {
      if (this._params && this._params.length > 0) {
        const maxRemSize = this._params
          .map((p) => {
            return Math.ceil(getTotalFullWidthCount(p.value) - 1);
          })
          .reduce((a, b) => Math.max(a, b), 0);

        Array.from(this.paramLabels).forEach((g) => {
          g.className = g.className.replace(/\bw-\d+\b/g, "");
          g.classList.add(`w-${maxRemSize}`);
        });
      }
    }
  }

  /**
   * 閉じるリクエストを処理し、ドキュメント内のアクティブなフォーカスを解除します。
   *
   * @private
   * @returns {void}
   */
  private _handleRequestClose(): void {
    (document.activeElement as HTMLElement)?.blur();
  }

  /**
   * テンプレート本文の入力を監視し、パラメータ（_params）を同期します。
   * 既存のパラメータは設定（type等）を維持し、新規は追加、存在しないものは削除します。
   * * @private
   * @returns {void}
   * @memberof FgTemplateEditor
   */
  private _handleInputTemplateContents(): void {
    const nextValues = extractParams(this.inputContent.value);
    const nextParams = nextValues.map((v) => {
      const existing = this._params.find((p) => p.value === v);
      return existing ? existing : { value: v, type: "string" };
    });
    this._params = [...nextParams];
  }

  /**
   * クリックしたカテゴリを選択状態とします。
   *
   * @private
   * @param {Event} e
   * @memberof FgTemplateEditor
   */
  private _handleClickCategory(e: Event) {
    const clickedButton = e.currentTarget as SlButton;

    this.categoryButtons.forEach((btn) => {
      btn.variant = "default";
    });

    clickedButton.variant = "primary";
  }

  /**
   * ダイアログを表示します。
   *
   * @memberof FgTemplateEditor
   */
  public show() {
    this.dialogTemplateEditor.show();
  }
}

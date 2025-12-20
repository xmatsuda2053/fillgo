import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
import { emit } from "../../shared/event";

import styles from "./fg-template-editor.lit.scss?inline";

import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import type SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import type SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

@customElement("fg-template-editor")
export class FgTemplateEditor extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _params: string[] = [];

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
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

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
    return html` <sl-dialog
      label="Template Editor"
      id="dialog-template-editor"
      @sl-request-close=${this._handleRequestClose}
    >
      <sl-tab-group>
        <sl-tab slot="nav" panel="base">Base</sl-tab>
        <sl-tab slot="nav" panel="params">Params</sl-tab>
        <sl-tab slot="nav" panel="other">Other</sl-tab>
        <sl-tab-panel name="base">
          <form id="editor-input-data" class="editor-form">
            <sl-input
              id="template-title"
              class="label-on-left"
              label="Title"
              placeholder="e.g. 業務連絡"
              size="small"
              clearable
            ></sl-input>
            <sl-textarea
              id="template-content"
              class="label-on-left"
              label="Contents"
              placeholder="e.g. {所属} の {氏名} さんから次の通り連絡がありました。"
              size="small"
              resize="none"
              @input=${this._handleInputTemplateContents}
            ></sl-textarea>
            <sl-input
              id="template-params"
              class="label-on-left"
              label="Params"
              size="small"
              value=${this._params.join(",")}
              disabled
            >
            </sl-input>
          </form>
        </sl-tab-panel>
        <sl-tab-panel name="params">
          <form class="editor-form">
            ${this._params.map(
              (p, i) => html`<sl-select
                id="type${i}"
                label=${p}
                class="label-on-left"
                size="small"
                value="string"
              >
                <sl-option value="string">String</sl-option>
                <sl-option value="number">Number</sl-option>
                <sl-option value="date">Date</sl-option>
              </sl-select>`
            )}
          </form>
        </sl-tab-panel>
        <sl-tab-panel name="other">
          <form class="editor-form">other</form>
        </sl-tab-panel>
      </sl-tab-group>
      <sl-button slot="footer" variant="primary">
        <sl-icon slot="prefix" library="fillgo" name="floppy2-fill"></sl-icon>
        Save
      </sl-button>
    </sl-dialog>`;
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
   * テンプレート本文の入力イベントをハンドリングし、含まれるパラメータを抽出して反映します。
   * 本文（inputContent）から抽出された重複のないパラメータをカンマ区切りで
   * パラメータ入力欄（inputParam）の初期値として設定します。
   * * @private
   * @returns {void}
   * @memberof FgTemplateEditor
   */
  private _handleInputTemplateContents(): void {
    this._params = this._extractParams(this.inputContent.value);
  }

  /**
   * 文字列の中から {変数名} 形式のパターンを抽出し、重複を除去した配列を返します。
   * * @example
   * // 入力: "Hello {name}, welcome to {place}. {name}!"
   * // 出力: ["{name}", "{place}"]
   * * @private
   * @param {string} s - パラメータ抽出対象のソース文字列
   * @returns {string[]} 重複を除去したパラメータ名の配列。マッチしない場合は空配列を返します。
   * @memberof FgTemplateEditor
   */
  private _extractParams(s: string): string[] {
    const pattern: RegExp = /{[^}]+}/g;
    return [...new Set(s.match(pattern) || [])];
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

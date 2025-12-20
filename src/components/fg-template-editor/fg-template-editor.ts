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

@customElement("fg-template-editor")
export class FgTemplateEditor extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * テンプレート編集画面
   *
   * @type {SlDialog}
   * @memberof FillGoApp
   */
  @query("#dialog-template-editor") dialogTemplateEditor!: SlDialog;

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
        <sl-tab slot="nav" panel="param">Pram</sl-tab>
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
              class="spacing-bottom"
              label="Contents"
              placeholder="e.g. {所属} の {氏名} さんから次の通り連絡がありました。"
              size="small"
              resize="none"
            ></sl-textarea>
            <sl-input
              id="template-params"
              class="label-on-left"
              label="Param"
              size="small"
              disabled
            ></sl-input>
          </form>
        </sl-tab-panel>
        <sl-tab-panel name="param">
          <form class="editor-form">pram</form>
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
   * ダイアログを表示します。
   *
   * @memberof FgTemplateEditor
   */
  public show() {
    this.dialogTemplateEditor.show();
  }
}

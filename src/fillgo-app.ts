import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "./shared/icons";
import { db, Template } from "./service/db";
import { formatDate, getParams } from "./service/utils";

import "./components/fg-list-root/fg-list-root";
import "./components/fg-list-item/fg-list-item";
import "./components/fg-input-parameter/fg-input-parameter";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import type SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import type SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

import styles from "./fillgo-app.lit.scss?inline";

setBasePath("/");
@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _templates: Template[] = [];
  @state() private _selectedId: Number = 0;

  @query("#template-editor") editor!: SlDialog;
  @query("#template-title") inputTitle!: SlInput;
  @query("#template-content") inputContent!: SlTextarea;
  @query("#template-param") inputParam!: SlInput;

  constructor() {
    super();
    this._refresh();
  }

  private async _refresh() {
    this._templates = await db.templates.toArray();
  }

  render() {
    return html` <div class="layout-grid-root">
      <div class="laytou-grid">
        <div class="header">FillGo</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="新規追加">
              <sl-button size="medium" @click=${this._openEditor}>
                ${Icons.plus}
              </sl-button>
            </sl-tooltip>
            <sl-tooltip content="フィルタ">
              <sl-button size="medium">${Icons.funnel}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="Upload">
              <sl-button size="medium">${Icons.upload}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="Download">
              <sl-button size="medium">${Icons.download}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="ヘルプ">
              <sl-button size="medium">${Icons.help}</sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents">
          <fg-list-root @selected-item=${this._selectedListItem}>
            ${this._templates.map((f) => {
              return html`<fg-list-item
                itemId="${f.id}"
                .isSelect=${f.id === this._selectedId}
              >
                <span slot="title">${f.title}</span>
                <span slot="updateAt">${formatDate(f.updatedAt)}</span>
              </fg-list-item>`;
            })}
          </fg-list-root>
        </div>
      </div>
      <div class="laytou-grid">
        <div class="header">arguments</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="初期化">
              <sl-button size="medium">${Icons.undo}</sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents">
          <fg-input-parameter> </fg-input-parameter>
        </div>
      </div>
      <div class="laytou-grid">
        <div class="header">result</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="コピー">
              <sl-button size="medium">${Icons.copy}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="保存">
              <sl-button size="medium">${Icons.save}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="履歴">
              <sl-button size="medium">${Icons.history}</sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents"></div>
      </div>
      <sl-dialog
        label="Template Editor"
        id="template-editor"
        @sl-request-close=${this._handleRequestClose}
      >
        <sl-input
          id="template-title"
          class="spacing-bottom"
          label="Title"
          placeholder="e.g. 業務連絡"
          size="small"
          clearable
        ></sl-input>
        <sl-textarea
          id="template-content"
          class="spacing-bottom"
          label="Contents"
          placeholder="e.g. {所属} の {氏名} さんから次の通り連絡がありました。"
          size="small"
          rows="10"
          resize="none"
          @input=${this._extractionParam}
        ></sl-textarea>
        <sl-input
          id="template-param"
          label="Param"
          size="small"
          disabled
        ></sl-input>
        <sl-button slot="footer" variant="primary" @click=${this._save}>
          ${Icons.save}
        </sl-button>
      </sl-dialog>
    </div>`;
  }

  private _openEditor() {
    this._initEditor();
    this.editor.show();
  }
  private _initEditor() {
    this.inputTitle.value = "";
    this.inputContent.value = "";
    this.inputParam.value = "";
  }
  private _extractionParam() {
    this.inputParam.value = getParams(this.inputContent.value).join(" ");
  }
  private _handleRequestClose() {
    (document.activeElement as HTMLElement)?.blur();
  }
  private async _save() {
    const newItem: Template = {
      title: this.inputTitle.value,
      content: this.inputContent.value,
    };

    this._selectedId = await db.insertItem(newItem);

    this._handleRequestClose();
    this.editor.hide();
    this._refresh();
  }

  private _selectedListItem(e: CustomEvent) {
    if (e.detail) {
      this._selectedId = e.detail.itemId;
    }
  }
}

import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "./shared/icons";
import { db, Template } from "./service/db";
import { formatDate, getParams } from "./service/utils";
import { Parameter } from "./service/interface";

import "./components/fg-list-root/fg-list-root";
import "./components/fg-list-item/fg-list-item";
import "./components/fg-input-parameter/fg-input-parameter";
import "./components/fg-output-result/fg-output-result";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/divider/divider.js";

import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import type SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import type SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import type SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import { FgInputParameter } from "./components/fg-input-parameter/fg-input-parameter";
import { FgOutputResult } from "./components/fg-output-result/fg-output-result";

import styles from "./fillgo-app.lit.scss?inline";

setBasePath("/");
@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _templates: Template[] = [];
  @state() private _selectedId: number = 0;
  @state() private _params: Parameter[] = [];

  @query("#fillgo-drawer") fillgoDrawer!: SlDrawer;
  @query("#template-editor") editor!: SlDialog;
  @query("#template-title") inputTitle!: SlInput;
  @query("#template-content") inputContent!: SlTextarea;
  @query("#template-param") inputParam!: SlInput;
  @query("#delete-dialog") deleteDialog!: SlDialog;
  @query("#delete-item-title") deleteItemTitle!: HTMLSpanElement;
  @query("fg-input-parameter") inputParameter!: FgInputParameter;
  @query("fg-output-result") outputResult!: FgOutputResult;

  constructor() {
    super();
    this._refresh();
  }

  private async _refresh() {
    this._templates = await db.selectItems();
    this.inputParameter.refresh();
  }

  render() {
    return html` <div class="layout-grid-root">
      <div class="main-header">
        <sl-button
          id="menu-button"
          variant="text"
          size="small"
          @click=${() => this.fillgoDrawer.show()}
        >
          ${Icons.list}
        </sl-button>
        <span>FillGo</span>
        <sl-drawer
          id="fillgo-drawer"
          label="FillGo"
          placement="start"
          class="drawer-placement-start"
        >
          <sl-button-group label="Alignment">
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
          <sl-divider></sl-divider>
          <p>version:<sl-badge variant="primary">1.0.0</sl-badge></p>
          <sl-divider></sl-divider>
          <p>
            <sl-badge variant="success">lit 3.3.1</sl-badge>
            <sl-badge variant="success">dexie 4.2.1</sl-badge>
            <sl-badge variant="success">shoelace 2.20.1</sl-badge>
            <sl-badge variant="success">vite-plugin-singlefile 2.3.0</sl-badge>
          </p>
          <p>
            <sl-badge variant="neutral">sass 1.94.2</sl-badge>
            <sl-badge variant="neutral">typescript 5.9.3</sl-badge>
            <sl-badge variant="neutral">vite 7.2.4</sl-badge>
          </p>
        </sl-drawer>
      </div>
      <div class="laytou-grid">
        <div class="header">List</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="新規追加">
              <sl-button size="medium" @click=${this._openEditor}>
                ${Icons.plus}
              </sl-button>
            </sl-tooltip>
            <!--
            <sl-tooltip content="フィルタ">
              <sl-button size="medium">${Icons.funnel}</sl-button>
            </sl-tooltip>
            -->
          </sl-button-group>
        </div>
        <div class="contents">
          <fg-list-root
            @selected-item=${this._selectedListItem}
            @edit-item=${this._editListItem}
            @delete-item=${this._deleteListItem}
          >
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
        <div class="header">Parameter</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="初期化">
              <sl-button size="medium" @click=${this._clearParameter}>
                ${Icons.undo}
              </sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents">
          <fg-input-parameter
            @change-param=${this._changeParameter}
            .itemId=${this._selectedId}
          >
          </fg-input-parameter>
        </div>
      </div>
      <div class="laytou-grid">
        <div class="header">Result</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="コピー">
              <sl-button size="medium" @click=${this._copyText}>
                ${Icons.copy}
              </sl-button>
            </sl-tooltip>
            <!--
            <sl-tooltip content="保存">
              <sl-button size="medium">${Icons.save}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="履歴">
              <sl-button size="medium">${Icons.history}</sl-button>
            </sl-tooltip>
            -->
          </sl-button-group>
        </div>
        <div class="contents">
          <fg-output-result
            .itemId=${this._selectedId}
            .params=${this._params}
          ></fg-output-result>
        </div>
      </div>
      ${this.renderTemplateEditor()} ${this.renderDeleteDialog()}
    </div>`;
  }
  renderTemplateEditor() {
    return html` <sl-dialog
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
    </sl-dialog>`;
  }
  renderDeleteDialog() {
    return html`<sl-dialog
      label="Delete"
      id="delete-dialog"
      @sl-request-close=${this._handleRequestClose}
    >
      <div class="message">
        ${Icons.exclamationOctagon}
        <span id="delete-item-title"></span> を削除します。よろしいですか？
      </div>
      <sl-button slot="footer" variant="danger" @click=${this._delete}>
        ${Icons.trash}
      </sl-button>
    </sl-dialog>`;
  }

  private _openEditor() {
    this._selectedId = 0;
    this._initEditor();
    this.editor.show();
  }
  private async _initEditor(itemId: number = 0) {
    this.inputTitle.value = "";
    this.inputContent.value = "";
    this.inputParam.value = "";

    if (itemId !== 0) {
      const t: Template | undefined = await db.selectItemById(itemId);
      if (t) {
        this.inputTitle.value = t.title;
        this.inputContent.value = t.content;
        this._extractionParam();
      }
    }
  }
  private _extractionParam() {
    this.inputParam.value = getParams(this.inputContent.value).join(" ");
  }
  private _handleRequestClose() {
    (document.activeElement as HTMLElement)?.blur();
  }
  private async _save() {
    const itemData: Template = {
      title: this.inputTitle.value,
      content: this.inputContent.value,
    };

    if (this._selectedId === 0) {
      this._selectedId = await db.insertItem(itemData);
    } else {
      await db.updateItem(this._selectedId, itemData);
    }

    this._handleRequestClose();
    this.editor.hide();
    this._refresh();
  }

  private _selectedListItem(e: CustomEvent) {
    if (e.detail) {
      this._selectedId = e.detail.itemId;
    }
  }
  private _editListItem(e: CustomEvent) {
    if (e.detail) {
      this._selectedId = e.detail.itemId;
      this._initEditor(this._selectedId);
      this.editor.show();
    }
  }
  private async _deleteListItem(e: CustomEvent) {
    if (e.detail) {
      this._selectedId = e.detail.itemId;
      const t: Template | undefined = await db.selectItemById(this._selectedId);
      if (t) {
        this.deleteItemTitle.innerText = t.title;
      }
      this.deleteDialog.show();
    }
  }
  private _delete() {
    db.deleteItem(this._selectedId);

    this._handleRequestClose();
    this.deleteDialog.hide();

    this._selectedId = 0;
    this._refresh();
  }

  private _clearParameter() {
    this.inputParameter.clear();
  }
  private _changeParameter(e: CustomEvent) {
    this._params = e.detail.params;
  }

  private async _copyText() {
    await this.outputResult.copyText();
  }
}

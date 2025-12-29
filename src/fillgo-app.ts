import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, query } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";
import { liveQuery, Subscription } from "dexie";
import { db } from "@service/db";
import { icons } from "@assets/icons";

import "@plugins/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@components/index";

import type SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import type { FgListGroup } from "@components/fg-list-group/fg-list-group";
import type { FgTemplateEditor } from "@components/fg-template-editor/fg-template-editor";
import type { FgContents } from "@components/fg-contents/fg-contents";
import type { Template } from "@/models/Template";
import type { Category } from "@/models/Category";

import styles from "./fillgo-app.lit.scss?inline";

setBasePath("/");
@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof FillGoApp
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @state() private _templates: Template[] = [];
  @state() private _categorys: Category[] = [];
  @state() private _deleteTargetId: number = 0;
  private _dbSubscription?: Subscription;

  /**
   * ドロワーメニュー
   *
   * @type {SlDrawer}
   * @memberof FillGoApp
   */
  @query("#fillgo-drawer-menu") fillgoDrawerMenu!: SlDrawer;

  /**
   * テンプレートリスト
   *
   * @type {FgListGroup}
   * @memberof FillGoApp
   */
  @query("#templateList") templateList!: FgListGroup;

  @query("fg-template-editor") templateEditor!: FgTemplateEditor;
  @query("#dialog-delete") dialogDelete!: SlDialog;
  @query("fg-contents") mainContents!: FgContents;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();

    // 独自アイコンを登録
    registerIconLibrary("fillgo", {
      resolver: (name: string) => {
        if (name in icons) {
          return `data:image/svg+xml;utf8,${encodeURIComponent(icons[name])}`;
        }
        return "";
      },
    });
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   * 基底クラスの処理を呼び出し、IndexedDB のリアルタイム監視を開始します。
   *
   * @override
   * @memberof FillGoApp
   */
  connectedCallback() {
    super.connectedCallback();
    this._subscribeToDb();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   * メモリリークを防止するため、データベースの購読（Subscription）を解除します。
   *
   * @override
   * @memberof FillGoApp
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._dbSubscription?.unsubscribe();
  }

  /**
   * IndexedDB の更新を監視し、変更をコンポーネントの状態に同期します。
   * Dexie.js の liveQuery を使用して、テンプレートとカテゴリのデータが更新されるたびに
   * 自動的に再レンダリングをトリガーします。
   *
   * @private
   * @returns {void}
   * @memberof FillGoApp
   */
  private _subscribeToDb(): void {
    const query = liveQuery(async () => {
      const [templates, categorys] = await Promise.all([
        db.selectTemplates(),
        db.selectCategorys(),
      ]);
      return { templates, categorys };
    });

    this._dbSubscription = query.subscribe({
      next: (data) => {
        this._templates = data.templates;
        this._categorys = data.categorys;
      },
      error: (err) => console.error("LiveQuery error:", err),
    });
  }

  /**
   * プロパティ変更を検知する。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof FillGoApp
   */
  protected willUpdate(_changedProperties: PropertyValues) {}

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * ヘッダー、リスト、コンテンツ、フッターの4つの主要エリアで構成される
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   */
  protected render(): HTMLTemplateResult {
    return html`
      <div class="fg-container">
        <div class="fg-header-area">
          <sl-icon-button
            library="fillgo"
            name="list"
            label="menu"
            class="header-button"
            @click=${() => this.fillgoDrawerMenu.show()}
          >
          </sl-icon-button>
          <sl-drawer
            id="fillgo-drawer-menu"
            label="FillGo"
            placement="start"
            class="drawer-placement-start"
            @sl-request-close=${this._handleRequestClose}
          >
            <sl-tab-group>
              <sl-tab slot="nav" panel="settings">
                <sl-icon library="fillgo" name="gear"></sl-icon>
                Settings
              </sl-tab>
              <sl-tab slot="nav" panel="storage">
                <sl-icon library="fillgo" name="database"></sl-icon>
                Storage
              </sl-tab>
              <sl-tab slot="nav" panel="about">
                <sl-icon library="fillgo" name="info-square"></sl-icon>
                About
              </sl-tab>
              <sl-tab-panel name="settings">
                <div class="group">
                  <div class="group-title">
                    <sl-icon library="fillgo" name="bookmark"></sl-icon>
                    カテゴリ
                  </div>
                  <fg-setting-category></fg-setting-category>
                </div>
              </sl-tab-panel>
              <sl-tab-panel name="storage"> </sl-tab-panel>
              <sl-tab-panel name="about">
                version:<sl-badge variant="primary">0.0.1</sl-badge>
              </sl-tab-panel>
            </sl-tab-group>
          </sl-drawer>
          <span class="app-name">FillGo</span>
        </div>
        <div class="fg-list-area">
          <fg-list-group
            id="templateList"
            @clickMenuAdd=${this._handleMenuAddClick}
            @clickMenuEdit=${this._handleMenuEditClick}
            @clickMenuDelete=${this._handleMenuDeleteClick}
            @clickList=${this._handleListClick}
          >
            ${this._templates.map(
              (t) => html`<fg-list
                listId="${t.id}"
                category="${this._getCategoryName(t.categoryId!)}"
              >
                ${t.title}
              </fg-list>`
            )}
          </fg-list-group>
          <sl-dialog
            label="確認"
            id="dialog-delete"
            @sl-request-close=${this._handleRequestClose}
          >
            選択中のテンプレートを削除します。<br />
            よろしいですか？
            <sl-button
              slot="footer"
              variant="default"
              @click=${this._handleDeleteYes}
            >
              はい
            </sl-button>
            <sl-button
              slot="footer"
              variant="primary"
              @click=${this._handleDeleteNo}
            >
              いいえ
            </sl-button>
          </sl-dialog>
        </div>
        <div class="fg-contents-area">
          <fg-contents></fg-contents>
        </div>
        <div class="fg-footer-area"></div>
      </div>
      <fg-template-editor></fg-template-editor>
    `;
  }

  /**
   * カテゴリIDに対応するカテゴリ名を取得します。
   * 指定されたIDが見つからない場合や、カテゴリデータが未ロードの場合は '***' を返します。
   *
   * @private
   * @param {number} id - 検索対象のカテゴリID
   * @returns {string} カテゴリ名、または見つからない場合のデフォルト値
   * @memberof FillGoApp
   */
  private _getCategoryName(id: number): string {
    const category = this._categorys?.find((c) => c.id === id);

    if (category) {
      return `${category.name}`;
    }

    return `***`;
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
   * リストの新規追加画面を表示します。
   */
  private _handleMenuAddClick() {
    this.templateEditor.show();
  }

  /**
   * 選択中のリストの編集画面を表示します。
   * @param e
   */
  private _handleMenuEditClick(e: CustomEvent) {
    this.templateEditor.templateId = e.detail.listId;
    this.templateEditor.show();
  }

  /**
   * 選択中のリストの削除画面を表示します。
   * @param e
   */
  private _handleMenuDeleteClick(e: CustomEvent) {
    this._deleteTargetId = e.detail.listId;
    this.dialogDelete.show();
  }
  private async _handleDeleteYes() {
    await db.deleteTemplate(Number(this._deleteTargetId));
    this._deleteTargetId = 0;
    this._handleRequestClose();
    this.dialogDelete.hide();
  }
  private _handleDeleteNo() {
    this._deleteTargetId = 0;
    this._handleRequestClose();
    this.dialogDelete.hide();
  }

  /**
   * リストクリック時、IDに該当するテンプレートを検索し画面に表示します。
   * @param e
   */
  private _handleListClick(e: CustomEvent) {
    this.mainContents.templateId = e.detail.listId;
  }
}

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

import "./components/fg-template-editor/fg-template-editor";
import "./components/fg-list/fg-list";
import "./components/fg-list-group/fg-list-group";

import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";

import type { FgListGroup } from "./components/fg-list-group/fg-list-group";
import type { FgTemplateEditor } from "./components/fg-template-editor/fg-template-editor";

import type SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.js";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./fillgo-app.lit.scss?inline";

import list from "./icons/list.svg?raw";
import download from "./icons/download.svg?raw";
import upload from "./icons/upload.svg?raw";
import plusLg from "./icons/plus-lg.svg?raw";
import filter from "./icons/filter.svg?raw";
import pencilSquare from "./icons/pencil-square.svg?raw";
import threeDots from "./icons/three-dots.svg?raw";
import trash3 from "./icons/trash3.svg?raw";
import gear from "./icons/gear.svg?raw";
import database from "./icons/database.svg?raw";
import infoSquare from "./icons/info-square.svg?raw";
import floppy2Fill from "./icons/floppy2-fill.svg?raw";
const icons: Record<string, string> = {
  list: list,
  download: download,
  upload: upload,
  "plus-lg": plusLg,
  filter: filter,
  "pencil-square": pencilSquare,
  "three-dots": threeDots,
  trash3: trash3,
  gear: gear,
  database: database,
  "info-square": infoSquare,
  "floppy2-fill": floppy2Fill,
};

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
              <sl-tab-panel name="settings"> </sl-tab-panel>
              <sl-tab-panel name="storage"> </sl-tab-panel>
              <sl-tab-panel name="about">
                version:<sl-badge variant="primary">1.0.0</sl-badge>
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
            <fg-list listId="1" tag="tag1">test1</fg-list>
            <fg-list listId="2" tag="tag2">test2</fg-list>
            <fg-list listId="3" tag="tag3">test3</fg-list>
            <fg-list listId="4" tag="tag4">test4</fg-list>
            <fg-list listId="5" tag="tag5">test5</fg-list>
            <fg-list listId="6" tag="tag6">test6</fg-list>
            <fg-list listId="7" tag="tag7">test7</fg-list>
            <fg-list listId="8" tag="tag8">test8</fg-list>
            <fg-list listId="9" tag="tag9">test9</fg-list>
            <fg-list listId="10" tag="tag10">test10</fg-list>
            <fg-list listId="11" tag="tag11">test11</fg-list>
            <fg-list listId="12" tag="tag12">test12</fg-list>
            <fg-list listId="13" tag="tag13">test13</fg-list>
            <fg-list listId="14" tag="tag14">test14</fg-list>
            <fg-list listId="15" tag="tag15">test15</fg-list>
            <fg-list listId="16" tag="tag16">test16</fg-list>
            <fg-list listId="17" tag="tag17">test17</fg-list>
            <fg-list listId="18" tag="tag18">test18</fg-list>
            <fg-list listId="19" tag="tag19">test19</fg-list>
            <fg-list listId="20" tag="tag20">test20</fg-list>
          </fg-list-group>
        </div>
        <div class="fg-contents-area">
          <div class="dummy">test</div>
        </div>
        <div class="fg-footer-area"></div>
      </div>
      <fg-template-editor></fg-template-editor>
    `;
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
    console.log("_handleMenuEditClick");
    console.log(e.detail.listId);
  }

  /**
   * 選択中のリストの削除画面を表示します。
   * @param e
   */
  private _handleMenuDeleteClick(e: CustomEvent) {
    console.log("_handleMenuDeleteClick");
    console.log(e.detail.listId);
  }
  /**
   * リストクリック時、IDに該当するテンプレートを検索し画面に表示します。。
   * @param e
   */
  private _handleListClick(e: CustomEvent) {
    console.log("_handleListClick");
    console.log(e.detail.listId);
  }
}

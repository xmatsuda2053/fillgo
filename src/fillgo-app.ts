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

import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import styles from "./fillgo-app.lit.scss?inline";

import list from "./icons/list.svg?raw";
const icons: Record<string, string> = {
  list: list,
};

setBasePath("/");
@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

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
          <sl-tooltip content="menu">
            <sl-icon-button
              library="fillgo"
              name="list"
              label="menu"
              class="header-button"
            >
            </sl-icon-button>
          </sl-tooltip>
          <span class="app-name">FillGo</span>
        </div>
        <div class="fg-list-area">
          <div class="dummy">test</div>
        </div>
        <div class="fg-contents-area">
          <div class="dummy">test</div>
        </div>
        <div class="fg-fotter-area"></div>
      </div>
    `;
  }
}

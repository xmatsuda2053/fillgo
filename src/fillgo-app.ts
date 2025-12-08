import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "./shared/icons";

import "./components/fg-list-root/fg-list-root";
import "./components/fg-list-item/fg-list-item";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";

import styles from "./fillgo-app.lit.scss?inline";

setBasePath("/");
@customElement("fillgo-app")
export class FillGoApp extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html` <div class="layout-grid-root">
      <div class="laytou-grid">
        <div class="header">Select Template</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="新規追加">
              <sl-button size="medium">${Icons.plus}</sl-button>
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
          <fg-list-root>
            <fg-list-item>
              <span slot="title">テスト用タイトルテスト用タイトルテスト用</span>
              <span slot="updateAt">2025/12/08 22:28</span>
            </fg-list-item>
            <fg-list-item>
              <span slot="title">test2</span>
              <span slot="updateAt">2025/12/08 22:28</span></fg-list-item
            >
            <fg-list-item>
              <span slot="title">test3</span>
              <span slot="updateAt">2025/12/08 22:28</span></fg-list-item
            >
          </fg-list-root>
        </div>
      </div>
      <div class="laytou-grid">
        <div class="header">Input Parameter</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="クリア">
              <sl-button size="medium">${Icons.clearAll}</sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents"></div>
      </div>
      <div class="laytou-grid">
        <div class="header">Output Text</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="コピー">
              <sl-button size="medium">${Icons.copy}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="保存">
              <sl-button size="medium">${Icons.writing}</sl-button>
            </sl-tooltip>
            <sl-tooltip content="履歴">
              <sl-button size="medium">${Icons.history}</sl-button>
            </sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents"></div>
      </div>
    </div>`;
  }
}

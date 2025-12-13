import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import { Icons } from "./shared/icons";

import "./components/fg-list-root/fg-list-root";
import "./components/fg-list-item/fg-list-item";
import "./components/fg-input-parameter/fg-input-parameter";

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
        <div class="header">FillGo</div>
        <div class="menu">
          <sl-button-group label="Alignment">
            <sl-tooltip content="新規追加">
              <sl-button size="medium">${Icons.plus}</sl-button>
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
          <fg-list-root>
            <fg-list-item itemId="1">
              <span slot="title">テスト用タイトルテスト用タイトルテスト用</span>
              <span slot="updateAt">2025/12/08 22:28</span>
            </fg-list-item>
            <fg-list-item itemId="2">
              <span slot="title">test2</span>
              <span slot="updateAt">2025/12/08 22:28</span></fg-list-item
            >
            <fg-list-item itemId="3">
              <span slot="title">test3</span>
              <span slot="updateAt">2025/12/08 22:28</span></fg-list-item
            >
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
    </div>`;
  }
}

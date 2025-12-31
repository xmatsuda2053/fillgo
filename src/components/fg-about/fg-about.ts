import { LitElement, html, css, unsafeCSS, HTMLTemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import favicon from "@assets/favicon/favicon.svg?raw";

import styles from "./fg-about.lit.scss?inline";

@customElement("fg-about")
export class FgAbout extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }
  /**
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgListGroup
   */
  protected render(): HTMLTemplateResult {
    return html` <div class="app-name">
        ${unsafeSVG(favicon)}
        <span>FillGo</span>
      </div>
      <div class="description-area">
        <div class="text">version:</div>
        <div class="badge"><sl-badge variant="primary">1.0.0</sl-badge></div>
      </div>
      <div class="description-area">
        <div class="text">updatedAt:</div>
        <div class="badge">
          <sl-badge variant="primary">2026.12.31</sl-badge>
        </div>
      </div>`;
  }
}

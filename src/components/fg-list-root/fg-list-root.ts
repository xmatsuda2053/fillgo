import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./fg-list-root.lit.scss?inline";

@customElement("fg-list-root")
export class FgListRoot extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="list-root">
        <slot></slot>
      </div>
    `;
  }
}

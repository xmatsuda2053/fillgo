import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { db } from "@service/db";
import type { Template } from "@/models/Template";

import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./fg-contents.lit.scss?inline";
import { Param } from "@/models/Param";

@customElement("fg-contents")
export class FgContents extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(sharedStyles)}
    `,
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  @property({ type: Number, hasChanged: () => true }) templateId?:
    | number
    | undefined = undefined;

  @state() private _template: Template | undefined;

  @query("#parameter-form") parameterForm!: HTMLFormElement;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * 画面更新前の処理を実行します。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof FgContents
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    if (
      _changedProperties.has("templateId") &&
      this.templateId !== undefined &&
      this.templateId !== 0
    ) {
      this._getTemplate();
    }
  }

  /**
   * 指定されたIDに基づいてテンプレートデータを取得し、各フィールドに反映します。
   *
   * @private
   * @returns {Promise<void>}
   * @memberof FgTemplateEditor
   */
  private async _getTemplate(): Promise<void> {
    if (!this.templateId) return;

    this._template = undefined;

    const template = await db.selectTemplateById(Number(this.templateId));
    if (!template) return;

    this._template = template;
  }

  /**
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgList
   */
  protected render(): HTMLTemplateResult {
    return html`<div class="container">
      <div class="parameter-area item-base">
        <div class="toolbar">
          <sl-button-group label="file">
            <sl-button size="small" outline>
              <sl-icon
                library="fillgo"
                name="eraser"
                label="clear"
                @click=${this._clearParameter}
              ></sl-icon>
            </sl-button>
          </sl-button-group>
        </div>
        <div class="contents scrollable">
          <form id="parameter-form">
            ${this._template?.params?.map((p) => this._renderParameter(p))}
          </form>
        </div>
      </div>
      <div class="result-area item-base">
        <div class="toolbar">
          <sl-button-group label="file">
            <sl-button size="small" outline>
              <sl-icon library="fillgo" name="copy" label="copy"></sl-icon>
            </sl-button>
          </sl-button-group>
        </div>
        <div class="contents scrollable">contents</div>
      </div>
    </div>`;
  }

  /**
   *
   *
   * @private
   * @param {Param} p
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgContents
   */
  private _renderParameter(p: Param): HTMLTemplateResult {
    const createInput = () => {
      switch (p.type) {
        case "string":
          return html`<sl-textarea
            placeholder="${p.value}"
            size="small"
            rows="1"
            resize="auto"
            class="parameter-item"
          >
          </sl-textarea>`;
        case "number":
        case "date":
        case "time":
          return html`<sl-input
            placeholder="${p.value}"
            size="small"
            class="parameter-item"
            type="${p.type}"
          ></sl-input>`;
        case "tel":
          return html`<sl-input
            placeholder="${p.value}"
            size="small"
            class="parameter-item adjust-icon"
            type="tel"
          >
            <sl-icon slot="suffix" library="fillgo" name="telephone"></sl-icon>
          </sl-input>`;
        default:
          return html``;
      }
    };

    return html`<sl-tooltip content="${p.value}" placement="left-start">
      ${createInput()}
    </sl-tooltip>`;
  }

  /**
   *
   *
   * @private
   * @memberof FgContents
   */
  private _clearParameter() {
    this.parameterForm.reset();
  }
}

import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
  TemplateResult,
} from "lit";
import { literal, html as staticHtml } from "lit/static-html.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property, state, query } from "lit/decorators.js";
import { db } from "@service/db";
import { sanitize } from "@service/utils";
import type { Template } from "@/models/Template";

import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./fg-contents.lit.scss?inline";
import { Param } from "@/models/Param";

interface InputParam extends Param {
  inputText: string;
  isFocus: boolean;
}

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
  @state() private _params: InputParam[] = [];

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
  protected async willUpdate(_changedProperties: PropertyValues) {
    if (
      _changedProperties.has("templateId") &&
      this.templateId !== undefined &&
      this.templateId !== 0
    ) {
      await this._getTemplate();
      this._initParams();
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
   */
  private _initParams() {
    this.parameterForm.reset();
    this._params = (this._template?.params || []).map((param) => ({
      ...param,
      inputText: "",
      isFocus: false,
    }));
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
                @click=${this._handleClickClear}
              ></sl-icon>
            </sl-button>
          </sl-button-group>
        </div>
        <div class="contents scrollable">
          <form id="parameter-form">
            ${this._params?.map((p, index) => this._renderParameter(p, index))}
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
        <div class="contents scrollable">
          <div id="result">${this._renderResult()}</div>
        </div>
      </div>
    </div>`;
  }

  /**
   *
   *
   * @private
   * @memberof FgContents
   */
  private _handleClickClear() {
    this._initParams();
  }

  /**
   *
   *
   * @private
   * @param {Param} p
   * @param {number} index
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgContents
   */
  private _renderParameter(p: Param, index: number): TemplateResult {
    const isTextarea = p.type === "string";
    const tag = isTextarea ? literal`sl-textarea` : literal`sl-input`;

    const commonProps = {
      id: index,
      placeholder: p.value,
      size: "small" as const,
      class: `parameter-item ${p.type === "tel" ? "adjust-icon" : ""}`,
      type: isTextarea ? undefined : p.type,
      rows: isTextarea ? "1" : undefined,
      resize: isTextarea ? "auto" : undefined,
      onInput: (e: Event) => this._handleChangeParameter(e, index),
      onFocus: () => this._handleFocusParameter(index),
      onBlur: this._handleBlurParameter,
    };

    return staticHtml`
      <sl-tooltip content="${p.value}" placement="left-start">
        <${tag}
          id=${commonProps.id}
          placeholder="${commonProps.placeholder}"
          size=${commonProps.size}
          class=${commonProps.class}
          type=${commonProps.type}
          rows=${commonProps.rows}
          resize=${commonProps.resize}
          @input=${commonProps.onInput}
          @focus=${commonProps.onFocus}
          @blur=${commonProps.onBlur}
        >
          ${
            p.type === "tel"
              ? html`<sl-icon
                  slot="suffix"
                  library="fillgo"
                  name="telephone"
                ></sl-icon>`
              : ""
          }
        </${tag}>
      </sl-tooltip>
    `;
  }

  /**
   *
   *
   * @private
   * @param {Event} e
   * @param {number} index
   * @memberof FgContents
   */
  private _handleChangeParameter(e: Event, index: number) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    this._params = this._params.map((param, i) =>
      i === index
        ? { ...param, inputText: value }
        : { ...param, isFocus: false }
    );
    this._params[index].isFocus = true;
  }

  /**
   *
   *
   * @private
   * @param {number} index
   * @memberof FgContents
   */
  private _handleFocusParameter(index: number) {
    this._params = this._params.map((param, i) =>
      i === index ? { ...param, isFocus: true } : { ...param, isFocus: false }
    );
  }

  /**
   *
   *
   * @private
   * @memberof FgContents
   */
  private _handleBlurParameter() {
    this._params = this._params.map((param) => ({ ...param, isFocus: false }));
  }

  /**
   *
   * @returns
   */
  private _renderResult(): HTMLTemplateResult {
    const replaceText = (str: string): string => {
      this._params.forEach((p) => {
        const regex = new RegExp(p.value, "g");
        const safeInput = sanitize(p.inputText);
        if (p.isFocus) {
          str = str.replace(regex, `<span class="focus">${p.value}</span>`);
        }
        if (p.inputText !== "") {
          str = str.replace(regex, safeInput);
        }
      });
      return str;
    };

    const finalContent = replaceText(this._template?.content ?? "");
    return html`${unsafeHTML(finalContent)}`;
  }
}

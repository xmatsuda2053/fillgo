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
import { sanitize, toastSuccess } from "@service/utils";
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
  @state() private _textForCopy: string = "";

  @query("#parameter-form") parameterForm!: HTMLFormElement;

  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントの更新ライフサイクル。
   * templateIdの変更を検知し、データの取得と初期化を行います。
   *
   * @protected
   * @param {PropertyValues} _changedProperties 変更されたプロパティのマップ
   * @memberof FgContents
   */
  protected async willUpdate(_changedProperties: PropertyValues) {
    if (
      _changedProperties.has("templateId") &&
      this.templateId !== undefined &&
      this.templateId !== 0
    ) {
      await this._getTemplate();
      this._init();
    }
  }

  /**
   * DBからテンプレート情報を取得し、内部状態に保存します。
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
   * パラメータ入力状態を初期化します。
   * フォームのリセットと、テンプレートに基づいた初期パラメータ配列の生成、コピー用テキストの初期化を行います。
   *
   * @private
   * @memberof FgContents
   */
  private _init() {
    this.parameterForm.reset();
    this._params = (this._template?.params || []).map((param) => ({
      ...param,
      inputText: "",
      isFocus: false,
    }));
    this._textForCopy = "";
  }

  /**
   * コンポーネントのメインレンダリング処理。
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
            <sl-tooltip content="クリア" placement="bottom-start">
              <sl-button size="small" outline>
                <sl-icon
                  library="fillgo"
                  name="eraser"
                  label="clear"
                  @click=${this._handleClickClear}
                ></sl-icon>
              </sl-button>
            </sl-tooltip>
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
            <sl-tooltip
              content="クリップボードにコピー"
              placement="bottom-start"
            >
              <sl-button size="small" outline>
                <sl-icon
                  library="fillgo"
                  name="clipboard"
                  label="copy"
                  @click=${this._handleClickCopy}
                ></sl-icon> </sl-button
            ></sl-tooltip>
          </sl-button-group>
        </div>
        <div class="contents scrollable" @click=${this._handleClickCopy}>
          <div id="result">${this._renderResult()}</div>
        </div>
      </div>
    </div>`;
  }

  /**
   * クリアボタン押下時のハンドラ。
   * 全てのパラメータ入力を初期状態に戻します。
   *
   * @private
   * @memberof FgContents
   */
  private _handleClickClear() {
    this._init();
  }

  /**
   * パラメータごとの入力フィールド（sl-input または sl-textarea）をレンダリングします。
   *
   * @private
   * @param {Param} p パラメータ定義
   * @param {number} index パラメータのインデックス
   * @returns {TemplateResult} 動的タグを含むテンプレート結果
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
   * 入力値変更時のハンドラ。
   * 変更された値を状態に反映し、プレビューを更新します。
   *
   * @private
   * @param {Event} e 入力イベント
   * @param {number} index パラメータのインデックス
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
   * フォーカス取得時のハンドラ。
   * プレビュー領域で該当するキーワードを強調表示するために状態を更新します。
   *
   * @private
   * @param {number} index パラメータのインデックス
   * @memberof FgContents
   */
  private _handleFocusParameter(index: number) {
    this._params = this._params.map((param, i) =>
      i === index ? { ...param, isFocus: true } : { ...param, isFocus: false }
    );
  }

  /**
   * フォーカス外れ時のハンドラ。
   * 強調表示を解除します。
   *
   * @private
   * @memberof FgContents
   */
  private _handleBlurParameter() {
    this._params = this._params.map((param) => ({ ...param, isFocus: false }));
  }

  /**
   * テンプレート内のキーワードを入力値で置換し、プレビュー結果をレンダリングします。
   * セキュリティのため入力値はサニタイズ処理されます。
   *
   * @returns {HTMLTemplateResult} サニタイズ済みのHTMLを含むテンプレート
   */
  private _renderResult(): HTMLTemplateResult {
    const replaceText = (str: string, isDisplay: boolean): string => {
      this._params.forEach((p) => {
        const regex = new RegExp(p.value, "g");
        const safeInput = sanitize(p.inputText);
        if (isDisplay && p.isFocus) {
          str = str.replace(regex, `<span class="focus">${p.value}</span>`);
        }
        if (p.inputText !== "") {
          str = str.replace(regex, safeInput);
        }
      });
      return str;
    };

    const finalContent = replaceText(this._template?.content ?? "", true);
    this._textForCopy = replaceText(this._template?.content ?? "", false);
    return html`${unsafeHTML(finalContent)}`;
  }

  /**
   * 生成結果クリックのハンドラ。
   *
   * @private
   * @memberof FgContents
   */
  private async _handleClickCopy() {
    try {
      await navigator.clipboard.writeText(this._textForCopy);
      toastSuccess(`<strong>コピーしました</strong><br />
        クリップボードにテキストを保存しました。`);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  }
}

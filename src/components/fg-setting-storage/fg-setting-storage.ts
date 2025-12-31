import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, query } from "lit/decorators.js";
import { db } from "@service/db";
import {
  formatDate,
  downloadFile,
  toastSuccess,
  toastDanger,
} from "@/service/utils";
import { ExportData } from "@/models/ExportData";
import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";

import styles from "./fg-setting-storage.lit.scss?inline";

@customElement("fg-setting-storage")
export class FgSettingStorage extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @query("#import") import!: HTMLInputElement;
  @query("#dialog-initialize") dialogInitialize!: SlDialog;
  /**
   * Creates an instance of FillGoApp.
   * @memberof FillGoApp
   */
  constructor() {
    super();
  }

  /**
   * 画面更新前の処理を実行します。
   * @param _changedProperties
   */
  protected willUpdate(_changedProperties: PropertyValues) {}

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * ツールバーおよびコンテンツから構成されるリストビューの基本構造を定義します。
   *
   * @protected
   * @return {*}  {HTMLTemplateResult}
   * @memberof FgListGroup
   */
  protected render(): HTMLTemplateResult {
    return html` <sl-menu>
        <sl-menu-item value="export" @click=${this._handleClickExport}>
          <sl-icon library="fillgo" name="download" slot="prefix"></sl-icon>
          エクスポート
        </sl-menu-item>
        <sl-menu-item value="import" @click=${this._handleClickImport}>
          <sl-icon library="fillgo" name="upload" slot="prefix"></sl-icon>
          インポート
        </sl-menu-item>
        <sl-menu-item value="initialize" @click=${this._handleClickInitialize}>
          <sl-icon
            library="fillgo"
            name="x-square"
            slot="prefix"
            class="danger"
          ></sl-icon>
          初期化
        </sl-menu-item>
      </sl-menu>
      <input
        type="file"
        id="import"
        class="hidden"
        accept=".json"
        @change=${this._handleChangeImport}
      />
      <sl-dialog
        label="確認"
        id="dialog-initialize"
        @sl-request-close=${this._handleRequestClose}
      >
        登録されたデータをすべて削除します。<br />
        よろしいですか？
        <sl-button
          slot="footer"
          variant="default"
          @click=${this._handleInitializeYes}
        >
          はい
        </sl-button>
        <sl-button
          slot="footer"
          variant="primary"
          @click=${this._handleInitializeNo}
        >
          いいえ
        </sl-button>
      </sl-dialog>`;
  }

  /**
   * データベースの内容をエクスポートする
   *
   * @private
   * @memberof FgSettingStorage
   */
  private async _handleClickExport() {
    const exportData = await db.export();

    const jsonString = JSON.stringify(exportData, undefined, 2);
    const exportDate = formatDate(new Date(), "yyyyMMdd_HHmmss");
    const fileName = `fillgo_export_${exportDate}.json`;

    downloadFile(jsonString, "application/json", fileName);
  }

  /**
   * インポート用の隠しファイル入力要素をクリックし、ファイル選択ダイアログを表示します。
   * ユーザーがボタンをクリックした際のハンドラーとして呼び出されます。
   * * @private
   */
  private _handleClickImport() {
    this.import.click();
  }

  /**
   * インポートファイルが選択された際の変更イベントを処理します。
   * 選択されたJSONファイルをパースし、データベースへインポートを実行します。
   * * @private
   * @param {Event} e - ファイル入力要素の変更イベント
   * @returns {Promise<void>} インポート処理が完了した際に解消されるPromise
   * @throws {Error} インポートファイルの形式が不正な場合や、システムエラーが発生した場合
   */
  private async _handleChangeImport(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const jsonString = await file.text();
      const importData: ExportData = JSON.parse(jsonString);

      if (!importData.categorys || !importData.templates) {
        throw new Error("インポートしたファイルの形式が正しくありません。");
      }

      db.import(importData);

      target.value = "";
      toastSuccess(
        "インポートしました",
        "ファイル内容をＤＢにインポートしました。"
      );
    } catch (error) {
      toastDanger(
        "インポート失敗",
        "インポート処理の実行中にシステムエラーが発生しました。ｓ"
      );
      console.log("import failed:", error);
    }
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
   * テーブルデータ初期化を開始します。
   *
   * @private
   * @memberof FgSettingStorage
   */
  private _handleClickInitialize() {
    this.dialogInitialize.show();
  }

  /**
   * 初期化を実行する。
   *
   * @private
   * @memberof FgSettingStorage
   */
  private async _handleInitializeYes() {
    await db.initialize();
    this._handleRequestClose();
    this.dialogInitialize.hide();
    toastSuccess("初期化しました", "登録データの全削除が完了しました。");
  }

  /**
   * 初期化を中断する。
   *
   * @private
   * @memberof FgSettingStorage
   */
  private _handleInitializeNo() {
    this._handleRequestClose();
    this.dialogInitialize.hide();
  }
}

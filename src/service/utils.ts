import type { SlAlert } from "@shoelace-style/shoelace";

/**
 * 日付オブジェクトを指定されたフォーマットの文字列に変換します。
 * * 使用可能なトークン: yyyy, MM, dd, HH, mm, ss
 *
 * @export
 * @param {Date} [date] - 変換対象の日付オブジェクト。
 * @param {string} [format="yyyy/MM/dd HH:mm:ss"] - フォーマット形式。
 * @returns {string} フォーマット済みの日付文字列、または空文字。
 */
export function formatDate(
  date?: Date,
  format: string = "yyyy/MM/dd HH:mm:ss"
): string {
  if (!date) return "";

  const pad = (num: number) => String(num).padStart(2, "0");

  const values: { [key: string]: string | number } = {
    yyyy: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  // 正規表現でトークンを一括置換
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (matched) =>
    values[matched].toString()
  );
}

/**
 * 文字列内から {変数名} 形式のパターンを抽出し、重複を除去した配列を返します。
 *
 * @export
 * @param {string} content - パラメータ抽出対象のテキスト内容。
 * @returns {string[]} 重複を除去したパラメータ名の配列。マッチしない場合は空配列を返します。
 */
export function extractParams(content: string): string[] {
  const pattern: RegExp = /{{[^}]+}}/g;
  return [...new Set(content.match(pattern) || [])];
}

/**
 * 文字列を UTF-8 としてエンコードした際のバイト数を取得します。
 *
 * @export
 * @param {string} str - バイト数を計算する対象の文字列。
 * @returns {number} UTF-8形式でのバイト数。
 */
export function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * 指定した文字列が半角文字（ASCII、半角カタカナ）であるか判定します。
 * * @private
 * @param {string} char - 判定対象の文字（1文字）
 * @returns {boolean} 半角文字の場合は true、全角文字等の場合は false
 * @memberof FgTemplateEditor
 */
export function isHalfWidth(char: string): boolean {
  const code = char.charCodeAt(0);
  // ASCII範囲: U+0000 - U+007F
  // 半角カタカナ範囲: U+FF61 - U+FF9F
  return (
    (code >= 0x0000 && code <= 0x007f) || (code >= 0xff61 && code <= 0xff9f)
  );
}

/**
 * 文字列の全角換算サイズ（全角1、半角0.5）を算出し、整数に切り上げて返します。
 * * @private
 * @param {string} str - 対象の文字列
 * @returns {number} 切り上げ後の全角換算サイズ
 * @memberof FgTemplateEditor
 */
export function getTotalFullWidthCount(str: string): number {
  if (!str) return 0;

  let total = 0;
  for (const char of str) {
    total += isHalfWidth(char) ? 0.5 : 1;
  }
  return Math.ceil(total);
}

/**
 * 文字列内のHTML特殊文字をエスケープしてサニタイズします。
 * @param str サニタイズ対象の文字列
 */
export function sanitize(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * トースト通知を表示するためのベースとなる共通処理です。
 *
 * @param {string} variant 種類 ("success" | "danger" | "primary" など)
 * @param {string} iconName 表示するアイコンの名前
 * @param {string} title タイトル
 * @param {string} message メッセージ内容
 */
function showToast(
  variant: string,
  iconName: string,
  title: string,
  message: string
) {
  const alert = Object.assign(document.createElement("sl-alert"), {
    variant: variant,
    duration: 1500,
    closable: true,
    innerHTML: `
        <sl-icon slot="icon" library="fillgo" name="${iconName}"></sl-icon>
        <strong>${title}</strong><br />
        ${message}
      `,
  });
  document.body.append(alert);
  (alert as SlAlert).toast();
}

/**
 * 処理成功時のトーストを表示します。
 *
 * @export
 * @param {string} innerTitleText タイトル
 * @param {string} innerHtmlText メッセージ内容
 */
export function toastSuccess(innerTitleText: string, innerHtmlText: string) {
  showToast("success", "check2-circle", innerTitleText, innerHtmlText);
}

/**
 * 処理失敗時のトーストを表示します。
 *
 * @export
 * @param {string} innerTitleText タイトル
 * @param {string} innerHtmlText メッセージ内容
 */
export function toastDanger(innerTitleText: string, innerHtmlText: string) {
  showToast("danger", "exclamation-octagon", innerTitleText, innerHtmlText);
}

/**
 * ファイルをダウンロードする。
 *
 * @export
 * @param {string} strData
 * @param {string} type
 * @param {string} fileName
 */
export function downloadFile(strData: string, type: string, fileName: string) {
  const blob = new Blob([strData], { type: type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

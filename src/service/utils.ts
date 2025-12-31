import type { SlAlert } from "@shoelace-style/shoelace";

/**
 * 日付オブジェクトを指定されたフォーマット（yyyy/MM/dd HH:mm:ss）の文字列に変換します。
 *
 * @export
 * @param {Date} [date] - 変換対象の日付オブジェクト。指定がない場合は空文字を返します。
 * @returns {string} フォーマット済みの日付文字列、または空文字。
 */
export function formatDate(date?: Date): string {
  if (!date) return "";
  const pad = (num: number) => String(num).padStart(2, "0");

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1); // 月は0始まり
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
}

/**
 * 文字列内から {変数名} 形式のパターンを抽出し、重複を除去した配列を返します。
 *
 * @export
 * @param {string} content - パラメータ抽出対象のテキスト内容。
 * @returns {string[]} 重複を除去したパラメータ名の配列。マッチしない場合は空配列を返します。
 */
export function extractParams(content: string): string[] {
  const pattern: RegExp = /{[^}]+}/g;
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
 * 処理成功時のトーストを表示します。
 *
 * @export
 * @param {string} innerHtmlText メッセージ内容
 */
export function toastSuccess(innerHtmlText: string) {
  const alert = Object.assign(document.createElement("sl-alert"), {
    variant: "success",
    duration: 1500,
    closable: true,
    innerHTML: `
        <sl-icon slot="icon" library="fillgo" name="check2-circle"></sl-icon>
        ${innerHtmlText}
      `,
  });
  document.body.append(alert);
  (alert as SlAlert).toast();
}

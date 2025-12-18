export function formatDate(date?: Date): String {
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

export function getParams(content: string): string[] {
  const pattern: RegExp = /{[^}]+}/g;
  return [...new Set(content.match(pattern) || [])];
}

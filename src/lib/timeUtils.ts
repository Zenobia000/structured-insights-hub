/**
 * 時間相關共用工具。原先散在 9 個 route 各自定義 relativeTime，現統一於此。
 */

/**
 * 把 ISO 時間轉成相對時間字串（用於「已自動儲存於 X 秒前」）。
 * - <5s: "剛剛"
 * - <60s: "N 秒前"
 * - <60m: "N 分鐘前"
 * - 其他：本地化的 HH:MM
 */
export function relativeTime(iso: string): string {
  if (!iso) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 5) return "剛剛";
  if (diffSec < 60) return `${diffSec} 秒前`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分鐘前`;
  return new Date(iso).toLocaleString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

import { useEffect, useMemo, useState } from "react";

import { relativeTime } from "@/lib/timeUtils";

/**
 * 取得「已儲存 X 秒/分鐘前」字串，每 15 秒自動 refresh。
 *
 * 取代 9 個 route 中重複的 `useState + useEffect setInterval + relativeTime` 樣板。
 * 重要：interval 只在 mount 時建立一次，不會因為 updatedAt 變化而 reset，
 * 避免 keystroke heavy 場景反覆重建 timer。
 */
export function useSavedAgo(updatedAt: string | undefined | null): string {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  return useMemo(
    () => relativeTime(updatedAt ?? ""),
    // tick 是 refresh 觸發器；雖然 relativeTime 不直接讀 tick，但每次 tick 變動就要重算當下的相對時間
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updatedAt, tick],
  );
}

import { useEffect, useState } from "react";

/**
 * usePersistedToggle — boolean state 持久化到 localStorage
 *
 * 用於記住使用者個人 UI 偏好(如「反思問題」摺疊區是否展開),
 * 刷新頁面後不會被重置。SSR-safe:第一次渲染回傳 defaultValue,
 * hydrate 後才從 localStorage 讀取真實值,避免 hydration mismatch。
 */
export function usePersistedToggle(
  key: string,
  defaultValue: boolean,
): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void] {
  const [value, setValue] = useState<boolean>(defaultValue);

  // hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === "1") setValue(true);
      else if (raw === "0") setValue(false);
    } catch {
      // localStorage 可能被 disable / quota 滿,忽略即可
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value ? "1" : "0");
    } catch {
      // 同上,忽略寫入失敗
    }
  }, [key, value]);

  return [value, setValue];
}

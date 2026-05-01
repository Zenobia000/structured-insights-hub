import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /learn/worksheet → / 重導向。
 *
 * 原因：使用者已選擇讓 Worksheet landing 取代首頁，
 * 兩個入口共存會導致重複內容與 SEO 分散。
 * 規格文件的 route_path 「/learn/worksheet」改由首頁承接。
 */
export const Route = createFileRoute("/learn/worksheet/")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

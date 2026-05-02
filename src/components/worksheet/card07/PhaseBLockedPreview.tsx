import { Lock } from "lucide-react";

export function PhaseBLockedPreview() {
  return (
    <section
      className="rounded-lg bg-muted-bg/60 border border-dashed border-border p-6 sm:p-8 max-w-3xl relative overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative z-10 flex flex-col items-center text-center gap-2 mb-6">
        <Lock className="h-8 w-8 text-text-muted" aria-hidden />
        <h2 className="text-[22px] font-bold text-text-primary">
          填完上面 4 欄就會解鎖
        </h2>
        <p className="text-[14.5px] text-text-secondary max-w-md leading-[1.6]">
          AI 回覆 + 痛點判斷表 + 第二輪 prompt 在這下面，但你必須先寫完自己的猜測。
        </p>
      </div>

      {/* blurred preview outline */}
      <div
        className="space-y-4 select-none pointer-events-none"
        style={{ filter: "blur(8px)" }}
      >
        <div className="h-6 w-2/3 bg-text-muted/40 rounded" />
        <div className="h-4 w-5/6 bg-text-muted/30 rounded" />
        <div className="h-32 w-full bg-text-muted/20 rounded" />
        <div className="grid grid-cols-1 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-full bg-text-muted/25 rounded flex items-center px-3 gap-2"
            >
              <div className="h-4 w-4 bg-text-muted/40 rounded" />
              <div className="h-3 flex-1 bg-text-muted/30 rounded" />
            </div>
          ))}
        </div>
        <div className="h-24 w-full bg-text-muted/20 rounded" />
        <div className="h-24 w-full bg-text-muted/20 rounded" />
      </div>

      <p className="relative z-10 mt-4 text-[12.5px] text-text-secondary italic text-center">
        這不是 bug。我們刻意擋住，避免你被 AI 牽著走。
      </p>
    </section>
  );
}

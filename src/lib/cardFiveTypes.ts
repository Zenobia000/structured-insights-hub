import type { TrizId, TrizLabel } from "@/types/painCard";

export type Contradiction = {
  triz_id: TrizId | null;
  triz_label: TrizLabel | null;
  side_a: string;
  side_b: string;
  sacrificed: "a" | "b" | null;
};

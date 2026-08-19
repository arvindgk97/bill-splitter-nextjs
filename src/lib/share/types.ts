import type { Person, BillItem, BillAdjustment } from "@/types/bill";

export type ShareableBill = {
  title?: string;
  people: Person[];
  items: BillItem[];
  adjustments: BillAdjustment;
};

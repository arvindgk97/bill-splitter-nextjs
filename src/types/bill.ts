export type ExtraChargeType = "percentage" | "fixed";

export interface Person {
  id: string;
  name: string;
  avatarColor?: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  personIds: string[];
  assignedMemberIds: string[];
}

export interface BillAdjustment {
  taxRate: number;
  serviceChargeRate: number;
  discountAmount: number;
}

export interface BillSettings {
  title: string;
  tax: number;
  taxType: ExtraChargeType;
  serviceCharge: number;
  serviceChargeType: ExtraChargeType;
  discount: number;
  discountType: ExtraChargeType;
}

export interface PersonSummary {
  person: Person;
  subtotal: number;
  taxAmount: number;
  serviceChargeAmount: number;
  discountAmount: number;
  total: number;
  assignedItemsCount: number;
}

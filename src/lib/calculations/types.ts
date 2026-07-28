export type BillAdjustment = {
  taxRate: number;
  serviceChargeRate: number;
  discountAmount: number;
};

export type CalculateBillOptions = {
  taxRate?: number;
  serviceChargeRate?: number;
  discountAmount?: number;
};

export type PersonItemShare = {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemTotal: number;
  participantCount: number;
  amount: number;
};

export type PersonBreakdown = {
  personId: string;
  items?: PersonItemShare[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  grandTotal: number;
};

export type BillCalculation = {
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  grandTotal: number;
  people: PersonBreakdown[];
};

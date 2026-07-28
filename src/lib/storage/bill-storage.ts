import { Bill } from "@/types/bill";

const STORAGE_KEY = "bill-splitter:bills";

export function getBills(): Bill[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading bills from localStorage:", error);
    return [];
  }
}

export function getBill(id: string): Bill | null {
  const bills = getBills();
  return bills.find((item) => item.id === id) || null;
}

export function saveBill(bill: Bill): void {
  if (typeof window === "undefined") return;
  const bills = getBills();

  const existingIndex = bills.findIndex((item) => item.id === bill.id);

  if (existingIndex >= 0) {
    bills[existingIndex] = bill;
  } else {
    bills.push(bill);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
}

export function deleteBill(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const bills = getBills();
    const updatedBills = bills.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
  } catch (error) {
    console.error("Error deleting bill from localStorage:", error);
  }
}

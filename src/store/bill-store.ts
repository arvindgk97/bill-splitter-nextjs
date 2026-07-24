import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Person, BillItem, ExtraChargeType, PersonSummary } from '../types/bill';
import { personSchema, itemSchema } from '../lib/validations/bill';

export type { Person, BillItem, ExtraChargeType, PersonSummary };

interface BillState {
  // State
  title: string;
  people: Person[];
  members: Person[];
  items: BillItem[];
  tax: number;
  taxType: ExtraChargeType;
  serviceCharge: number;
  serviceChargeType: ExtraChargeType;
  discount: number;
  discountType: ExtraChargeType;

  // Actions - Title & Settings
  setTitle: (title: string) => void;
  setTax: (tax: number, type?: ExtraChargeType) => void;
  setServiceCharge: (serviceCharge: number, type?: ExtraChargeType) => void;
  setDiscount: (discount: number, type?: ExtraChargeType) => void;

  // Actions - Members
  addPerson: (name: string) => boolean;
  removePerson: (id: string) => void;
  updatePerson: (id: string, name: string) => boolean;

  // Actions - Items
  addItem: (
    nameOrItem: string | { name: string; price: number; quantity?: number; personIds?: string[]; assignedMemberIds?: string[] },
    price?: number,
    quantity?: number,
    personIds?: string[]
  ) => boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<Omit<BillItem, 'id'>>) => boolean;
  togglePersonAssignment: (itemId: string, personId: string) => void;
  assignAllToItem: (itemId: string) => void;
  unassignAllFromItem: (itemId: string) => void;

  // Utilities
  resetStore: () => void;
  loadSampleData: () => void;

  // Calculations / Getters
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getServiceChargeAmount: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
  getPersonSummaries: () => PersonSummary[];
}

const DEFAULT_AVATAR_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#38BDF8', '#818CF8', '#C084FC', '#F472B6',
];

const getRandomColor = () => {
  return DEFAULT_AVATAR_COLORS[Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)];
};

const initialBillState = {
  title: 'Tagihan Baru',
  people: [],
  members: [],
  items: [],
  tax: 0,
  taxType: 'percentage' as ExtraChargeType,
  serviceCharge: 0,
  serviceChargeType: 'percentage' as ExtraChargeType,
  discount: 0,
  discountType: 'fixed' as ExtraChargeType,
};

export const useBillStore = create<BillState>()(
  persist(
    (set, get) => ({
      ...initialBillState,

      // Settings actions
      setTitle: (title) => set({ title }),
      setTax: (tax, taxType) =>
        set((state) => ({ tax: Math.max(0, tax), taxType: taxType ?? state.taxType })),
      setServiceCharge: (serviceCharge, serviceChargeType) =>
        set((state) => ({
          serviceCharge: Math.max(0, serviceCharge),
          serviceChargeType: serviceChargeType ?? state.serviceChargeType,
        })),
      setDiscount: (discount, discountType) =>
        set((state) => ({
          discount: Math.max(0, discount),
          discountType: discountType ?? state.discountType,
        })),

      // Member actions
      addPerson: (name) => {
        const validation = personSchema.safeParse({ name });
        if (!validation.success) return false;

        const newPerson: Person = {
          id: crypto.randomUUID(),
          name: validation.data.name,
          avatarColor: getRandomColor(),
        };
        set((state) => {
          const updated = [...state.people, newPerson];
          return { people: updated, members: updated };
        });
        return true;
      },

      removePerson: (id) => {
        set((state) => {
          const updated = state.people.filter((m) => m.id !== id);
          return {
            people: updated,
            members: updated,
            items: state.items.map((item) => ({
              ...item,
              assignedMemberIds: item.assignedMemberIds.filter((mId) => mId !== id),
            })),
          };
        });
      },

      updatePerson: (id, name) => {
        const validation = personSchema.safeParse({ name });
        if (!validation.success) return false;

        set((state) => {
          const updated = state.people.map((m) =>
            m.id === id ? { ...m, name: validation.data.name } : m
          );
          return { people: updated, members: updated };
        });
        return true;
      },

      // Item actions
      addItem: (nameOrItem, priceArg, quantityArg, personIdsArg) => {
        let itemObj: { name: string; price: number; quantity?: number; personIds?: string[]; assignedMemberIds?: string[] };
        if (typeof nameOrItem === 'string') {
          itemObj = {
            name: nameOrItem,
            price: priceArg ?? 0,
            quantity: quantityArg ?? 1,
            personIds: personIdsArg ?? [],
          };
        } else {
          itemObj = nameOrItem;
        }
        const pIds = itemObj.personIds || itemObj.assignedMemberIds || [];
        const validation = itemSchema.safeParse({ ...itemObj, assignedMemberIds: pIds });
        if (!validation.success) return false;

        const newItem: BillItem = {
          id: crypto.randomUUID(),
          name: validation.data.name,
          price: validation.data.price,
          quantity: validation.data.quantity,
          personIds: validation.data.assignedMemberIds,
          assignedMemberIds: validation.data.assignedMemberIds,
        };
        set((state) => ({ items: [...state.items, newItem] }));
        return true;
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      updateItem: (id, updatedFields) => {
        const currentItem = get().items.find((i) => i.id === id);
        if (!currentItem) return false;

        const merged = { ...currentItem, ...updatedFields };
        const personIds = (merged as any).personIds || merged.assignedMemberIds || [];
        const validation = itemSchema.safeParse({ ...merged, assignedMemberIds: personIds });
        if (!validation.success) return false;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...validation.data,
                  personIds: validation.data.assignedMemberIds,
                  assignedMemberIds: validation.data.assignedMemberIds,
                }
              : item
          ),
        }));
        return true;
      },

      togglePersonAssignment: (itemId, personId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const currentIds = item.personIds || item.assignedMemberIds || [];
            const isAssigned = currentIds.includes(personId);
            const newAssigned = isAssigned
              ? currentIds.filter((id) => id !== personId)
              : [...currentIds, personId];
            return {
              ...item,
              personIds: newAssigned,
              assignedMemberIds: newAssigned,
            };
          }),
        }));
      },

      assignAllToItem: (itemId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const allIds = state.people.map((m) => m.id);
            return {
              ...item,
              personIds: allIds,
              assignedMemberIds: allIds,
            };
          }),
        }));
      },

      unassignAllFromItem: (itemId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, personIds: [], assignedMemberIds: [] };
          }),
        }));
      },

      resetStore: () => {
        set({ ...initialBillState });
      },

      loadSampleData: () => {
        const p1Id = crypto.randomUUID();
        const p2Id = crypto.randomUUID();
        const p3Id = crypto.randomUUID();

        set({
          title: 'Makan Malam Resto Bintang',
          members: [
            { id: p1Id, name: 'Budi', avatarColor: '#38BDF8' },
            { id: p2Id, name: 'Siti', avatarColor: '#F472B6' },
            { id: p3Id, name: 'Andi', avatarColor: '#34D399' },
          ],
          items: [
            {
              id: crypto.randomUUID(),
              name: 'Nasi Goreng Spesial',
              price: 35000,
              quantity: 2,
              personIds: [p1Id, p2Id],
              assignedMemberIds: [p1Id, p2Id],
            },
            {
              id: crypto.randomUUID(),
              name: 'Ayam Bakar Madu',
              price: 45000,
              quantity: 1,
              personIds: [p3Id],
              assignedMemberIds: [p3Id],
            },
            {
              id: crypto.randomUUID(),
              name: 'Es Teh Manis',
              price: 8000,
              quantity: 3,
              personIds: [p1Id, p2Id, p3Id],
              assignedMemberIds: [p1Id, p2Id, p3Id],
            },
          ],
          tax: 11,
          taxType: 'percentage',
          serviceCharge: 5,
          serviceChargeType: 'percentage',
          discount: 10000,
          discountType: 'fixed',
        });
      },

      // Calculations
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTaxAmount: () => {
        const { tax, taxType } = get();
        const subtotal = get().getSubtotal();
        if (taxType === 'percentage') {
          return (subtotal * tax) / 100;
        }
        return tax;
      },

      getServiceChargeAmount: () => {
        const { serviceCharge, serviceChargeType } = get();
        const subtotal = get().getSubtotal();
        if (serviceChargeType === 'percentage') {
          return (subtotal * serviceCharge) / 100;
        }
        return serviceCharge;
      },

      getDiscountAmount: () => {
        const { discount, discountType } = get();
        const subtotal = get().getSubtotal();
        if (discountType === 'percentage') {
          return (subtotal * discount) / 100;
        }
        return discount;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const taxAmount = get().getTaxAmount();
        const serviceChargeAmount = get().getServiceChargeAmount();
        const discountAmount = get().getDiscountAmount();
        return Math.max(0, subtotal + taxAmount + serviceChargeAmount - discountAmount);
      },

      getPersonSummaries: () => {
        const { members, items } = get();
        const subtotal = get().getSubtotal();
        const taxAmount = get().getTaxAmount();
        const serviceChargeAmount = get().getServiceChargeAmount();
        const discountAmount = get().getDiscountAmount();

        return members.map((person) => {
          let personSubtotal = 0;
          let assignedItemsCount = 0;

          items.forEach((item) => {
            if (item.assignedMemberIds.includes(person.id) && item.assignedMemberIds.length > 0) {
              const share = (item.price * item.quantity) / item.assignedMemberIds.length;
              personSubtotal += share;
              assignedItemsCount += 1;
            }
          });

          const ratio = subtotal > 0 ? personSubtotal / subtotal : 0;
          const personTax = taxAmount * ratio;
          const personService = serviceChargeAmount * ratio;
          const personDiscount = discountAmount * ratio;
          const personTotal = Math.max(0, personSubtotal + personTax + personService - personDiscount);

          return {
            person,
            subtotal: personSubtotal,
            taxAmount: personTax,
            serviceChargeAmount: personService,
            discountAmount: personDiscount,
            total: personTotal,
            assignedItemsCount,
          };
        });
      },
    }),
    {
      name: 'bill-splitter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        title: state.title,
        members: state.members,
        items: state.items,
        tax: state.tax,
        taxType: state.taxType,
        serviceCharge: state.serviceCharge,
        serviceChargeType: state.serviceChargeType,
        discount: state.discount,
        discountType: state.discountType,
      }),
    }
  )
);

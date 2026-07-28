import { z } from "zod";

export const personSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nama anggota tidak boleh kosong" }),
});

export const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nama barang/makanan tidak boleh kosong" }),
  price: z.coerce
    .number()
    .min(0, { message: "Harga harus bernilai 0 atau lebih" }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "Jumlah minimal 1" })
    .default(1),
  assignedMemberIds: z.array(z.string()).default([]),
});

export const extraChargeTypeSchema = z.enum(["percentage", "fixed"]);

export const billSettingsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul tagihan tidak boleh kosong" }),
  tax: z.coerce.number().min(0, { message: "Pajak tidak boleh negatif" }),
  taxType: extraChargeTypeSchema,
  serviceCharge: z.coerce
    .number()
    .min(0, { message: "Biaya layanan tidak boleh negatif" }),
  serviceChargeType: extraChargeTypeSchema,
  discount: z.coerce.number().min(0, { message: "Diskon tidak boleh negatif" }),
  discountType: extraChargeTypeSchema,
});

export type PersonInput = z.infer<typeof personSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type BillSettingsInput = z.infer<typeof billSettingsSchema>;

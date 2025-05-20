// src/core/domain/schemas/staff.schema.ts
import { z } from 'zod';

export const StaffFormSchema = z.object({
  name: z.string().min(1, 'ກະລຸນາລະບຸຊື່ພະນັກງານ'),
  tel: z.union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0, 'ເບີໂທລະສັບຕ້ອງເປັນຕົວເລກທີ່ບໍ່ຕິດລົບ'),
  address: z.string().optional(),
  userName: z.string().min(1, 'ກະລຸນາລະບຸຊື່ຜູ້ໃຊ້'),
  salary: z.union([z.string(), z.number(), z.null()])
    .transform(val => val === null || val === '' ? null : Number(val))
    .refine(val => val === null || (!isNaN(Number(val)) && Number(val) >= 0), 'ເງິນເດືອນຕ້ອງເປັນຕົວເລກທີ່ບໍ່ຕິດລົບ'),
  gender: z.string().min(1, 'ກະລຸນາເລືອກເພດ'),
  password: z.string().optional(),
  roleId: z.union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 1, 'ກະລຸນາເລືອກສິດການໃຊ້ງານ')
});
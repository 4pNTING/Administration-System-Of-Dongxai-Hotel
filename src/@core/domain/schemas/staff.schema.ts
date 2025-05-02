// src/core/domain/schemas/staff.schema.ts
import { z } from 'zod';

export const StaffFormSchema = z.object({
  name: z.string().min(1, 'ກະລຸນາລະບຸຊື່ພະນັກງານ'),
  tel: z.number().nonnegative('ເບີໂທລະສັບຕ້ອງເປັນຕົວເລກທີ່ບໍ່ຕິດລົບ'),
  address: z.string().optional(),
  userName: z.string().min(1, 'ກະລຸນາລະບຸຊື່ຜູ້ໃຊ້'),
  salary: z.number().nonnegative('ເງິນເດືອນຕ້ອງເປັນຕົວເລກທີ່ບໍ່ຕິດລົບ').nullable(),
  gender: z.string().min(1, 'ກະລຸນາເລືອກເພດ'),
  password: z.string().optional(),
  roleId: z.number().min(1, 'ກະລຸນາເລືອກສິດການໃຊ້ງານ')
});
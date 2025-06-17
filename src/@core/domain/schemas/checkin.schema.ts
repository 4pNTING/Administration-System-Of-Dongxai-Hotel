// src/core/domain/schemas/checkin.schema.ts
import { z } from 'zod';

export const CheckInFormSchema = z.object({
  CheckInDate: z.union([
    z.string().min(1, 'ວັນທີເຊັກອິນບໍ່ສາມາດເວັ້ນວ່າງໄດ້'),
    z.date()
  ]).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ');
      }
      return date;
    }
    return val;
  }),

  CheckoutDate: z.union([
    z.string().min(1, 'ວັນທີເຊັກເອົາບໍ່ສາມາດເວັ້ນວ່າງໄດ້'),
    z.date()
  ]).transform((val) => {
    if (typeof val === 'string') {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ');
      }
      return date;
    }
    return val;
  }),

  RoomId: z.number({
    required_error: 'ກະລຸນາເລືອກຫ້ອງພັກ',
    invalid_type_error: 'ຫ້ອງພັກຕ້ອງເປັນຕົວເລກ'
  }).min(1, 'ກະລຸນາເລືອກຫ້ອງພັກ'),

  BookingId: z.number({
    invalid_type_error: 'ລະຫັດການຈອງຕ້ອງເປັນຕົວເລກ'
  }).optional(),

  CustomerId: z.number({
    required_error: 'ກະລຸນາເລືອກລູກຄ້າ',
    invalid_type_error: 'ລູກຄ້າຕ້ອງເປັນຕົວເລກ'
  }).min(1, 'ກະລຸນາເລືອກລູກຄ້າ'),

  StaffId: z.number({
    required_error: 'ກະລຸນາເລືອກພະນັກງານ',
    invalid_type_error: 'ພະນັກງານຕ້ອງເປັນຕົວເລກ'
  }).min(1, 'ກະລຸນາເລືອກພະນັກງານ')

}).refine((data) => {
  // ตรวจสอบว่าวันที่เช็คเอาท์ต้องมาหลังวันที่เช็คอิน
  const checkInDate = new Date(data.CheckInDate);
  const checkoutDate = new Date(data.CheckoutDate);
  
  return checkoutDate.getTime() > checkInDate.getTime();
}, {
  message: 'ວັນທີເຊັກເອົາຕ້ອງມາຫຼັງວັນທີເຊັກອິນ',
  path: ['CheckoutDate']
}).refine((data) => {
  // ตรวจสอบว่าวันที่เช็คอินไม่เก่าเกินไป (ไม่เกิน 7 วัน)
  const checkInDate = new Date(data.CheckInDate);
  const today = new Date();
  const maxPastDays = 7;
  const minDate = new Date(today.getTime() - (maxPastDays * 24 * 60 * 60 * 1000));
  
  return checkInDate.getTime() >= minDate.getTime();
}, {
  message: 'ວັນທີເຊັກອິນບໍ່ສາມາດເກົ່າເກີນ 7 ວັນ',
  path: ['CheckInDate']
}).refine((data) => {
  // ตรวจสอบว่าระยะเวลาพักไม่เกิน 30 วัน
  const checkInDate = new Date(data.CheckInDate);
  const checkoutDate = new Date(data.CheckoutDate);
  const maxStayDays = 30;
  const diffTime = checkoutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= maxStayDays;
}, {
  message: 'ໄລຍະເວລາພັກບໍ່ສາມາດເກີນ 30 ວັນ',
  path: ['CheckoutDate']
});

export type CheckInFormType = z.infer<typeof CheckInFormSchema>;
import { z } from 'zod';

export const RoomFormSchema = z.object({
    TypeId: z.number().min(1, { message: 'กรุณาเลือกประเภทห้องพัก' }),
    StatusId: z.number().min(1, { message: 'กรุณาเลือกสถานะห้องพัก' }),
    RoomPrice: z.number().min(0, { message: 'ราคาห้องพักต้องมากกว่าหรือเท่ากับ 0' }),
});
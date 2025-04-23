import { z } from 'zod';

export const RoomFormSchema = z.object({
  TypeId: z.number({
    required_error: "ประเภทห้องพักจำเป็นต้องกรอก",
    invalid_type_error: "ประเภทห้องพักต้องเป็นตัวเลข"
  }),
  StatusId: z.number({
    required_error: "สถานะห้องพักจำเป็นต้องกรอก",
    invalid_type_error: "สถานะห้องพักต้องเป็นตัวเลข"
  }),
  RoomPrice: z.number({
    required_error: "ราคาห้องพักจำเป็นต้องกรอก",
    invalid_type_error: "ราคาห้องพักต้องเป็นตัวเลข"
  })
}).partial();

export type RoomInput = z.infer<typeof RoomFormSchema>;
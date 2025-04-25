// src/core/domain/models/room-type/form.model.ts
import { z } from "zod";

export const RoomTypeFormSchema = z.object({
  TypeName: z.string().min(1, "ต้องระบุชื่อประเภทห้อง"),
  Description: z.string().optional()
});

export type RoomTypeFormData = z.infer<typeof RoomTypeFormSchema>;
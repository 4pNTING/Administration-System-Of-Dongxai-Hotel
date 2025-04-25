// src/core/domain/models/room-status/form.model.ts
import { z } from "zod";

export const RoomStatusFormSchema = z.object({
  StatusName: z.string().min(1, "ต้องระบุชื่อสถานะ")
});

export type RoomStatusFormData = z.infer<typeof RoomStatusFormSchema>;
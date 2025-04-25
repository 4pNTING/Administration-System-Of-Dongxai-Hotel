import { z } from "zod";

import { RoomStatusFormSchema } from "@core/domain/schemas/room-status.schema";
import { RoomStatusModel } from "./list.model";

type RoomStatusFormInput = z.infer<typeof RoomStatusFormSchema>;

// Interface สำหรับจัดการสถานะของรายการสถานะห้องพัก
export interface RoomStatusListState {
  items: RoomStatusModel[];
  isLoading: boolean;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: RoomStatusModel[]) => void;
  addItem: (item: RoomStatusModel) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: RoomStatusModel) => void;
  fetchItems: () => Promise<void>;
  delete: (id: number) => Promise<void>;
}

// Interface สำหรับจัดการสถานะของฟอร์มสถานะห้องพัก
export interface RoomStatusFormState {
  isVisible: boolean;
  isSubmitting: boolean;
  selectedItem: RoomStatusModel | null;
  setVisible: (visible: boolean) => void;
  setSelectedItem: (item: RoomStatusModel | null) => void;
  create: (data: RoomStatusFormInput) => Promise<RoomStatusModel>;
  update: (id: number, data: RoomStatusFormInput) => Promise<RoomStatusModel>;
  reset: () => void;
}

// Interface สำหรับจัดการสถานะทั้งหมด
export interface RoomStatusState extends RoomStatusListState, RoomStatusFormState {
    roomStatuses: RoomStatusModel[];
    loading: boolean;
    error: string | null;
    fetchRoomStatuses: () => Promise<RoomStatusModel[]>; 
    createRoomStatus: (data: { StatusName: string }) => Promise<RoomStatusModel>;
    updateRoomStatus: (id: number, data: { StatusName: string }) => Promise<boolean>;
    deleteRoomStatus: (id: number) => Promise<boolean>;
}
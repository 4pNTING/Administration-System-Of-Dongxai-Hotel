// src/core/domain/models/room-status/props.model.ts
import { RoomStatusModel } from "./list.model";

export interface RoomStatusFilterProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export interface RoomStatusDataTableProps {
  data: RoomStatusModel[];
  filters: any;
  loading?: boolean;
  onEdit: (item: RoomStatusModel) => void;
}

export interface RoomStatusFormInputProps {
  visible: boolean;
  selectedItem?: RoomStatusModel | null;
  onHide: () => void;
}
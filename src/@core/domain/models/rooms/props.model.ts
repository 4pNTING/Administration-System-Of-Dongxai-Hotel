import { Room } from "./list.model";

export interface RoomFilterProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export interface RoomFormInputProps {
  visible: boolean;
  selectedItem?: Room | null;
  onHide: () => void;
}

export interface RoomDataTableProps {
  data: Room[];
  filters: Record<string, any>;
  loading?: boolean;
  onEdit: (item: Room) => void;
}

export interface RoomAvailabilitySearchProps {
  onSearch: (checkInDate: string, checkOutDate: string) => void;
  loading?: boolean;
}
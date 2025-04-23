import { Room } from "./list.model";

export interface RoomFilterProps {
  value: string;
  onFilterChange: (value: string) => void;
}

export interface RoomDataTableProps {
  data: Room[];
  filters: any;
  loading?: boolean;
  onEdit: (item: Room) => void;
}

export interface RoomFormInputProps {
  visible: boolean;
  selectedItem?: Room | null;
  onHide: () => void;
}
import { RoomFormData } from "@core/domain/models/rooms/form.model";
import { Room } from "@core/domain/models/rooms/list.model";

export interface RoomRepositoryPort {
  getMany(): Promise<Room[]>;
  getOne(id: number): Promise<Room>;
  getAvailable(checkInDate: string, checkOutDate: string): Promise<Room[]>;
  create(data: RoomFormData): Promise<Room>;
  update(id: number, data: Partial<RoomFormData>): Promise<Room>;
  delete(id: number): Promise<void>;
}